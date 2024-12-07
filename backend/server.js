  const express = require('express');
  const cors = require('cors');
  const app = express();
  const PORT = 5000;

    app.use(express.json());
  app.use(cors());

    const locationsData = require('./database/locations.json');
  const hotsalesData = require('./database/hotsales.json');

    const authRoutes = require('./auth');
  const productRoutes = require('./product');   const cartRoutes = require('./cart');
  const orderRoutes = require('./order');
    app.use('/api', authRoutes);

    app.use('/api', productRoutes);   app.use('/api', orderRoutes); 
  app.use('/api', cartRoutes);
    app.get('/api/locations', (req, res) => {
    res.json(locationsData);
  });

  app.get('/api/hotsales', (req, res) => {
    res.json(hotsalesData);
  });

    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
