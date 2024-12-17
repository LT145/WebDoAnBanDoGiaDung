const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware để parse body của request
app.use(express.json());
app.use(cors());

// Giả định dữ liệu sản phẩm trong file products.json
const locationsData = require('./database/locations.json');
const hotsalesData = require('./database/hotsales.json');

// Import các route từ auth.js và product.js
const authRoutes = require('./auth');
const productRoutes = require('./product'); // Import route product.js
const cartRoutes = require('./cart');
const orderRoutes = require('./order');
const momoRoutes = require('./momo');
// Sử dụng các route đăng nhập từ auth.js
app.use('/api', authRoutes);

// Sử dụng các route sản phẩm từ product.js
app.use('/api', productRoutes); // Gọi vào
app.use('/api', orderRoutes); // Gọi vào
app.use('/api', momoRoutes); // Gọi vào
app.use('/api', cartRoutes);
// Các API khác
app.get('/api/locations', (req, res) => {
  res.json(locationsData);
});
app.get('/api/hotsales', (req, res) => {
  res.json(hotsalesData);
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
