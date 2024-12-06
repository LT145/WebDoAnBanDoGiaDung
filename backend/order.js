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

// Place order API
// Place order API
// Place order API
router.post('/place-order', (req, res) => {
  const { userId, userInfo, selectedItems, totalPrice, address } = req.body;

  // Kiểm tra dữ liệu bắt buộc
  if (!userId || !selectedItems || !userInfo || !address) {
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

  const orderData = readOrderData();

  const newOrder = {
    orderId: orderData.length + 1,
    userId,
    userInfo,
    selectedItems,
    totalPrice,
    address: fullAddress,
    status: 'Chờ Duyệt',
    createdAt: new Date().toISOString(),
  };

  // Lưu đơn hàng vào database
  orderData.push(newOrder);
  writeOrderData(orderData);

  // Now remove the ordered items from the cart of the user
  const cartData = readCartData();
  const userCart = cartData.find((cart) => cart.userId === userId);
  
  if (userCart) {
    console.log('User Cart before removing items:', userCart.cart);
    
    selectedItems.forEach(orderItem => {
      const cartItemIndex = userCart.cart.findIndex(item => item.productId === orderItem.productId);
      
      if (cartItemIndex !== -1) {
        // Remove the item from the cart
        userCart.cart.splice(cartItemIndex, 1);
        console.log(`Removed item with productId: ${orderItem.productId}`);
      } else {
        console.log(`Item with productId: ${orderItem.productId} not found in cart`);
      }
    });
  
    console.log('User Cart after removing items:', userCart.cart);
    writeCartData(cartData);
  }
  res.status(200).json({ message: 'Order placed successfully', order: newOrder });
});



// Get all orders (for admin)
router.get('/orders', (req, res) => {
  const orderData = readOrderData();
  res.status(200).json(orderData);
});
// Get order by ID
router.get('/orders/:orderId', (req, res) => {
  const { orderId } = req.params;

  // Read order data
  const orderData = readOrderData();

  // Find the order by orderId
  const order = orderData.find((o) => o.orderId === parseInt(orderId));

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

  // Tìm đơn hàng với orderId tương ứng
  const orderIndex = orderData.findIndex((order) => order.orderId === parseInt(orderId));

  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Cập nhật trạng thái của đơn hàng thành "Đã hủy"
  orderData[orderIndex].status = 'Đã hủy';

  // Ghi dữ liệu đã cập nhật vào file
  writeOrderData(orderData);

  res.status(200).json({ message: 'Order has been canceled', order: orderData[orderIndex] });
});
// Approve order by ID
router.put('/orders/:orderId/approve', (req, res) => {
  const { orderId } = req.params;

  // Đọc dữ liệu đơn hàng
  const orderData = readOrderData();

  // Tìm đơn hàng dựa trên orderId
  const orderIndex = orderData.findIndex((order) => order.orderId === parseInt(orderId));

  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Cập nhật trạng thái của đơn hàng thành "Hoàn Thành"
  orderData[orderIndex].status = 'Hoàn Thành';

  // Ghi lại dữ liệu đã cập nhật vào file
  writeOrderData(orderData);

  res.status(200).json({ message: 'Order has been approved', order: orderData[orderIndex] });
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
