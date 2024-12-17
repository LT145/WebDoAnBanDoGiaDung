const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// MoMo API parameters
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = 'MOMO';
const lang = 'vi';
const ipnUrl = 'http://localhost:5000/api/payment-result'; // Sử dụng HTTPS cho IPN
const requestType = 'payWithMethod';

// Path to your order data file (update this as needed)
const orderDataFilePath = path.join(__dirname, './database/orders.json');
const cartDataFilePath = path.join(__dirname, './database/cart.json');

// Helper functions to read and write data
const readData = (filePath) => {
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error reading data from ${filePath}:`, error);
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing data to ${filePath}:`, error);
  }
};

// MoMo Payment API: Create payment
router.post('/create-payment', async (req, res) => {
  const { amount, orderInfo, userId, selectedItems, totalPrice, address, paymentMethod, userInfo } = req.body;

  // Validate request body
  if (!amount || !orderInfo || !userId || !selectedItems || !address || !paymentMethod || !userInfo) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  const orderId = partnerCode + new Date().getTime(); // Generate unique order ID
  const requestId = orderId;
  const extraData = ''; // Optional, pass any custom data here

  // Create raw signature string
  const redirectUrl = `http://localhost:5000/api/payment-result?userId=${userId}&selectedItems=${JSON.stringify(selectedItems)}`;
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  // Generate HMAC SHA256 signature
  const signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  // Create request body for MoMo
  const requestBody = {
    partnerCode,
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    extraData,
    signature,
  };

  console.log("Request Body to MoMo:", requestBody); // Log request to MoMo

  try {
    // Send request to MoMo API
    const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
      headers: { 'Content-Type': 'application/json' },
    });

    const parsedResponse = response.data;
    console.log("MoMo API Response:", parsedResponse); // Log response from MoMo
    const fullAddress = `${address.street}, ${address.ward}, ${address.district}, ${address.province}`;
    if (parsedResponse.resultCode === 0) {
      // Order creation logic here if payment was successful
      const orderData = {
        orderId,
        userId,
        userInfo,
        selectedItems,
        totalPrice,
        address:fullAddress,
        status: 'Chờ Duyệt',  // Default status
        paymentMethod,
        paymentStatus: 'Chưa thanh toán', // Payment status
        paymentMessage: '', // Payment message
        createdAt: new Date().toISOString(), // Timestamp of order creation
      };

      const orders = readData(orderDataFilePath);
      orders.push(orderData);
      writeData(orderDataFilePath, orders);

      return res.status(200).json({
        message: 'Payment created successfully',
        payUrl: parsedResponse.payUrl,  // MoMo payment URL
        order: orderData,  // Include order data in response
      });
    } else {
      return res.status(500).json({ message: 'Error from MoMo API', data: parsedResponse });
    }
  } catch (error) {
    console.error('Error during MoMo API call:', error.response ? error.response.data : error.message);
    return res.status(500).json({ message: 'Error connecting to MoMo API', error: error.message });
  }
});

// MoMo Payment Result: Handle the response from MoMo and place the order
router.get('/payment-result', (req, res) => {
    const { resultCode, message, orderId, userId, selectedItems } = req.query;
  
    // Kiểm tra các tham số đầu vào
    if (!resultCode || !orderId || !userId || !selectedItems) {
      return res.status(400).json({ message: 'Missing resultCode, orderId, userId, or selectedItems' });
    }
  
    // Giải mã selectedItems từ chuỗi JSON
    let parsedSelectedItems;
    try {
      parsedSelectedItems = JSON.parse(selectedItems);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid selectedItems format' });
    }
  
    console.log("Payment Result Received:", req.query); // Log payment result
  
    // Đọc dữ liệu đơn hàng từ file
    const orderData = readData(orderDataFilePath);
    const orderIndex = orderData.findIndex(order => String(order.orderId) === String(orderId));
  
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }
  
    // Xác định trạng thái thanh toán
    const paymentStatus = resultCode === '0' ? 'Thanh toán thành công' : 'Thanh toán thất bại';
    const paymentMessage = message || 'Không có thông báo từ MoMo';
  
    // Cập nhật thông tin đơn hàng với trạng thái thanh toán và phương thức thanh toán
    orderData[orderIndex].paymentStatus = paymentStatus;
    orderData[orderIndex].paymentMessage = paymentMessage;
    orderData[orderIndex].paymentMethod = 'MoMo';  // Đặt phương thức thanh toán là MoMo
  
    // Lưu lại dữ liệu đơn hàng đã cập nhật
    writeData(orderDataFilePath, orderData);
  
    // Nếu thanh toán thành công, cập nhật giỏ hàng
    if (resultCode === '0') {
      // Cập nhật trạng thái đơn hàng từ "Chờ Duyệt" thành "Đã thanh toán"
      orderData[orderIndex].status = 'Đã thanh toán';
      orderData[orderIndex].createdAt = new Date().toISOString(); // Cập nhật lại thời gian tạo
  
      // Lưu lại đơn hàng đã cập nhật trạng thái
      writeData(orderDataFilePath, orderData);
  
      // Cập nhật giỏ hàng sau khi thanh toán thành công
      const cartData = readData(cartDataFilePath);
      const userCart = cartData.find(cart => cart.userId === userId);
  
      if (userCart) {
        // Xóa các sản phẩm đã được đặt từ giỏ hàng
        parsedSelectedItems.forEach(item => {
          const cartItemIndex = userCart.cart.findIndex(cartItem => cartItem.productId === item.productId);
          if (cartItemIndex !== -1) {
            userCart.cart.splice(cartItemIndex, 1);  // Xóa sản phẩm đã đặt từ giỏ hàng
          }
        });
  
        // Lưu lại giỏ hàng đã cập nhật
        writeData(cartDataFilePath, cartData);
      }
  
      // Redirect người dùng tới trang xác nhận đơn hàng
      return res.redirect('http://localhost:3000/order-confirmation');
    } else {
      // Thanh toán thất bại, redirect về trang đơn hàng với thông báo lỗi
      return res.redirect(`http://localhost:3000/order?error=${encodeURIComponent(message || 'Thanh toán thất bại')}`);
    }
  });
  
module.exports = router;
