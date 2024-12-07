const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const cors = require('cors');

router.use(cors()); 

const orderFilePath = path.join(__dirname, './database/orders.json');


const readOrderData = () => {
  try {
    if (!fs.existsSync(orderFilePath)) {
      fs.writeFileSync(orderFilePath, JSON.stringify([])); 
    }
    const data = fs.readFileSync(orderFilePath, 'utf-8');
    return JSON.parse(data);   } catch (error) {
    console.error('Error reading or parsing the order data file:', error);
    return [];   }
};

const writeOrderData = (data) => {
  try {
    fs.writeFileSync(orderFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to the order data file:', error);
  }
};


const readCartData = () => {
  const cartFilePath = path.join(__dirname, './database/cart.json');
  try {
    if (!fs.existsSync(cartFilePath)) {
      fs.writeFileSync(cartFilePath, JSON.stringify([]));     }
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
  const { userId, userInfo, selectedItems, totalPrice, address } = req.body;

    if (!userId || !selectedItems || !userInfo || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    return res.status(400).json({ message: 'Selected items cannot be empty' });
  }

  if (typeof totalPrice !== 'number' || totalPrice <= 0) {
    return res.status(400).json({ message: 'Invalid total price' });
  }

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

    orderData.push(newOrder);
  writeOrderData(orderData);

    const cartData = readCartData();
  const userCart = cartData.find((cart) => cart.userId === userId);
  
  if (userCart) {
    console.log('User Cart before removing items:', userCart.cart);
    
    selectedItems.forEach(orderItem => {
      const cartItemIndex = userCart.cart.findIndex(item => item.productId === orderItem.productId);
      
      if (cartItemIndex !== -1) {
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



router.get('/orders', (req, res) => {
  const orderData = readOrderData();
  res.status(200).json(orderData);
});
router.get('/orders/:orderId', (req, res) => {
  const { orderId } = req.params;

    const orderData = readOrderData();

    const order = orderData.find((o) => o.orderId === parseInt(orderId));

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.status(200).json(order);
});
router.put('/orders/:orderId/cancel', (req, res) => {
  const { orderId } = req.params;

    const orderData = readOrderData();

    const orderIndex = orderData.findIndex((order) => order.orderId === parseInt(orderId));

  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

    orderData[orderIndex].status = 'Đã hủy';

    writeOrderData(orderData);

  res.status(200).json({ message: 'Order has been canceled', order: orderData[orderIndex] });
});
router.put('/orders/:orderId/approve', (req, res) => {
  const { orderId } = req.params;

    const orderData = readOrderData();

    const orderIndex = orderData.findIndex((order) => order.orderId === parseInt(orderId));

  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

    orderData[orderIndex].status = 'Hoàn Thành';

    writeOrderData(orderData);

  res.status(200).json({ message: 'Order has been approved', order: orderData[orderIndex] });
});
router.get('/orders/user/:userId', (req, res) => {
  const { userId } = req.params;

    const orderData = readOrderData();

    const userOrders = orderData.filter(order => order.userId === userId);

  if (userOrders.length === 0) {
    return res.status(404).json({ message: 'No orders found for this user' });
  }

  res.status(200).json(userOrders);
});

module.exports = router;
