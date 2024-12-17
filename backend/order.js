const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const cors = require('cors');

router.use(cors()); // Allow cross-origin requests

const orderFilePath = path.join(__dirname, './database/orders.json');

// Read and write functions
const readOrderData = () => {
  try {
    if (!fs.existsSync(orderFilePath)) {
      fs.writeFileSync(orderFilePath, JSON.stringify([])); // Initialize the file if it doesn't exist
    }
    const data = fs.readFileSync(orderFilePath, 'utf-8');
    return JSON.parse(data); // Parse JSON safely
  } catch (error) {
    console.error('Error reading or parsing the order data file:', error);
    return []; // Return an empty array if there’s an error
  }
};

const writeOrderData = (data) => {
  try {
    fs.writeFileSync(orderFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to the order data file:', error);
  }
};

// Giả sử bạn đã có hàm `readCartData` và `writeCartData` giống như `readOrderData` và `writeOrderData`.

const readCartData = () => {
  const cartFilePath = path.join(__dirname, './database/cart.json');
  try {
    if (!fs.existsSync(cartFilePath)) {
      fs.writeFileSync(cartFilePath, JSON.stringify([])); // Initialize the file if it doesn't exist
    }
    const data = fs.readFileSync(cartFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading or parsing the cart data file:', error);
    return [];
  }
};

const writeCartData = (data) => {
  const cartFilePath = path.join(__dirname, './database/cart.json');
  try {
    fs.writeFileSync(cartFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to the cart data file:', error);
  }
};

router.post('/place-order', (req, res) => {
  const { userId, userInfo, selectedItems, totalPrice, address, paymentMethod, paymentStatus, paymentMessage } = req.body;

  // Kiểm tra dữ liệu bắt buộc
  if (!userId || !selectedItems || !userInfo || !address || !paymentMethod) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    return res.status(400).json({ message: 'Selected items cannot be empty' });
  }

  if (typeof totalPrice !== 'number' || totalPrice <= 0) {
    return res.status(400).json({ message: 'Invalid total price' });
  }

  // Chuẩn hóa địa chỉ đầy đủ
  const fullAddress = `${address.street}, ${address.ward}, ${address.district}, ${address.province}`;

  const orderData = readOrderData(); // Đọc dữ liệu đơn hàng từ file

  // Kiểm tra phương thức thanh toán và trạng thái thanh toán cho COD
  let finalPaymentStatus = paymentStatus || 'Chưa thanh toán';  // Nếu là COD, mặc định là chưa thanh toán
  let finalPaymentMessage = paymentMessage || '';

  if (paymentMethod === 'COD') {
    // Nếu phương thức thanh toán là COD, đơn hàng sẽ có trạng thái thanh toán là 'Chưa thanh toán'
    finalPaymentStatus = 'Chưa thanh toán';
    finalPaymentMessage = 'Thanh toán khi nhận hàng';
  }

  // Tạo mới đơn hàng
  const newOrder = {
    orderId: orderData.length + 1, // Tạo ID cho đơn hàng mới
    userId,
    userInfo,
    selectedItems,
    totalPrice,
    address: fullAddress,
    status: 'Chờ Duyệt', // Trạng thái đơn hàng
    paymentMethod, // Phương thức thanh toán (ví dụ: 'COD', 'MoMo', v.v.)
    paymentStatus: finalPaymentStatus, // Trạng thái thanh toán (đặc biệt khi là COD là 'Chưa thanh toán')
    paymentMessage: finalPaymentMessage, // Thông báo thanh toán (thêm thông tin thanh toán khi nhận hàng)
    createdAt: new Date().toISOString(), // Thời gian tạo đơn hàng
  };

  // Lưu đơn hàng vào database (file JSON)
  orderData.push(newOrder);
  writeOrderData(orderData);

  // Cập nhật giỏ hàng
  const cartData = readCartData();
  const userCart = cartData.find((cart) => cart.userId === userId);

  if (userCart) {
    selectedItems.forEach(orderItem => {
      const cartItemIndex = userCart.cart.findIndex(item => item.productId === orderItem.productId);
      
      if (cartItemIndex !== -1) {
        userCart.cart.splice(cartItemIndex, 1);  // Xóa sản phẩm đã đặt từ giỏ hàng
      }
    });

    // Cập nhật lại giỏ hàng sau khi đã xóa các sản phẩm đã được đặt
    writeCartData(cartData);
  }

  // Trả về kết quả đơn hàng
  res.status(200).json({ message: 'Order placed successfully', order: newOrder });
});



// Get all orders (for admin)
// Get all orders
router.get('/orders', (req, res) => {
  const orderData = readOrderData();
  res.status(200).json(orderData);
});

// Get order by ID
router.get('/orders/:orderId', (req, res) => {
  const { orderId } = req.params;

  // Đọc dữ liệu đơn hàng từ file
  const orderData = readOrderData();

  // Chuyển orderId từ request về chuỗi để so sánh với orderId trong dữ liệu
  const orderIdString = String(orderId);

  // Tìm đơn hàng theo orderId
  const order = orderData.find((o) => String(o.orderId) === orderIdString);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.status(200).json(order);
});

// Cancel order by ID
router.put('/orders/:orderId/cancel', (req, res) => {
  const { orderId } = req.params;

  // Đọc dữ liệu từ file
  const orderData = readOrderData();

  // Tìm đơn hàng với orderId tương ứng (so sánh chuỗi)
  const orderIndex = orderData.findIndex((order) => String(order.orderId) === String(orderId));

  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Cập nhật trạng thái của đơn hàng thành "Đã hủy"
  orderData[orderIndex].status = 'Đã hủy';

  // Ghi dữ liệu đã cập nhật vào file
  writeOrderData(orderData);

  res.status(200).json({ message: 'Order has been canceled', order: orderData[orderIndex] });
});
const readProductData = () => {
  const filePath = path.join(__dirname, './database/products.json');
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
};

// Hàm ghi dữ liệu vào file products.json
const writeProductData = (data) => {
  const filePath = path.join(__dirname, './database/products.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
// Approve order by ID
router.put('/orders/:orderId/approve', (req, res) => {
  const { orderId } = req.params;

  // Đọc dữ liệu đơn hàng
  const orderData = readOrderData();

  // Tìm đơn hàng dựa trên orderId (so sánh chuỗi)
  const orderIndex = orderData.findIndex((order) => String(order.orderId) === String(orderId));

  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Cập nhật trạng thái của đơn hàng thành "Hoàn Thành"
  const updatedOrder = orderData[orderIndex];
  updatedOrder.status = 'Hoàn Thành';

  // Cập nhật số lượng sản phẩm trong products.json
  const productData = readProductData();

  updatedOrder.selectedItems.forEach(item => {
    const productId = item.productId;
    const quantityOrdered = item.quantity;

    // Tìm sản phẩm trong danh sách sản phẩm
    const productIndex = productData.findIndex((product) => product.id === productId);

    if (productIndex !== -1) {
      const product = productData[productIndex];

      // Giảm số lượng sản phẩm
      if (product.quantity >= quantityOrdered) {
        product.quantity -= quantityOrdered;
      } else {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }
    }
  });

  // Ghi lại dữ liệu đã cập nhật vào file products.json
  writeProductData(productData);

  // Ghi lại dữ liệu đã cập nhật vào file orders.json
  writeOrderData(orderData);

  res.status(200).json({ message: 'Order has been approved and stock updated', order: updatedOrder });
});
// Get orders by userId
router.get('/orders/user/:userId', (req, res) => {
  const { userId } = req.params;

  // Đọc dữ liệu đơn hàng từ file
  const orderData = readOrderData();

  // Lọc đơn hàng theo userId
  const userOrders = orderData.filter(order => order.userId === userId);

  if (userOrders.length === 0) {
    return res.status(404).json({ message: 'No orders found for this user' });
  }

  res.status(200).json(userOrders);
});

module.exports = router;
