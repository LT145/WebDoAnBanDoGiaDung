  const express = require('express');
  const fs = require('fs');
  const path = require('path');
  const multer = require('multer');
  const router = express.Router();

  const productsPath = path.join(__dirname, './database/products.json');   let productsData = require(productsPath); 
    const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../frontend/public', 'img', 'product'));     },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));     }
  });

  const upload = multer({ storage });


    router.get('/products', (req, res) => {
    res.json(productsData);
  });

    router.get('/categories', (req, res) => {
    const categoriesPath = path.join(__dirname, './database/categories.json');
    const categories = require(categoriesPath);
    res.json(categories);
  });

    router.get('/products/:categoryId', (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const filteredProducts = productsData.filter(product => product.categoryId === categoryId);
    res.json(filteredProducts);
  });
router.get('/products/findid/:id', (req, res) => {
  const id = parseInt(req.params.id, 10); 
    const product = productsData.find(product => product.id === id);

  if (product) {
    res.json(product);   } else {
    res.status(404).json({ message: 'Sản phẩm không tìm thấy' });   }
});


    router.put('/products/:id/status', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const { active } = req.body; 
    if (!['Sẵn Hàng', 'Ngừng Kinh Doanh'].includes(active)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const productIndex = productsData.findIndex(product => product.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    productsData[productIndex].active = active;

    fs.writeFile(productsPath, JSON.stringify(productsData, null, 2), (err) => {
      if (err) {
        console.error('Lỗi khi ghi dữ liệu vào file:', err);
        return res.status(500).json({ message: 'Lỗi server khi lưu dữ liệu' });
      }

      res.json({ message: 'Cập nhật trạng thái thành công', product: productsData[productIndex] });
    });
  });

  router.post('/products', upload.single('product-image'), (req, res) => {
    console.log('Body:', req.body);     console.log('File:', req.file); 
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng tải lên ảnh sản phẩm' });
    }

    const { 'product-name': name, 'product-quantity': quantity, 'product-category': categoryId, 'product-price': price, 'is-discount': isDiscount, 'product-discount-price': discountprice } = req.body;

    const imagePath = `/img/product/${req.file.filename}`; 
        const priceValue = Number(price);     const quantityValue = Number(quantity);     const discountPriceValue = discountprice === undefined || discountprice === '' ? -1 : Number(discountprice); 
        const newProduct = {
      id: productsData.length + 1,       name,
      price: priceValue,       discountprice: discountPriceValue === -1 ? -1 : discountPriceValue,       quantity: quantityValue,       categoryId: Number(categoryId),       active: quantityValue > 0 ? 'Sẵn Hàng' : 'Ngừng Kinh Doanh',
      img: imagePath,
    };

        productsData.push(newProduct);

        fs.writeFile(productsPath, JSON.stringify(productsData, null, 2), (err) => {
      if (err) {
        console.error('Lỗi khi lưu sản phẩm:', err);
        return res.status(500).json({ message: 'Lỗi server khi lưu sản phẩm' });
      }

      res.status(201).json({ message: 'Sản phẩm đã được thêm', product: newProduct });
    });
  });
router.put('/products/:id', upload.single('product-image'), (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const { name, quantity, categoryId, price, discountPrice } = req.body;
  const imageFile = req.file;

    const productIndex = productsData.findIndex(product => product.id === productId);
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
  }

    const updatedProduct = {
    ...productsData[productIndex],
    name,
    quantity: Number(quantity),
    categoryId: Number(categoryId),
    price: Number(price),
    discountprice: discountPrice !== undefined ? Number(discountPrice) : -1,
  };

    if (imageFile) {
    updatedProduct.img = `/img/product/${imageFile.filename}`;
  }

    productsData[productIndex] = updatedProduct;

    fs.writeFile(productsPath, JSON.stringify(productsData, null, 2), (err) => {
    if (err) {
      console.error('Lỗi khi ghi dữ liệu vào file:', err);
      return res.status(500).json({ message: 'Lỗi server khi lưu dữ liệu' });
    }

    res.json({ message: 'Cập nhật sản phẩm thành công', product: updatedProduct });
  });
});
router.post('/products/search', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Từ khóa tìm kiếm không được cung cấp' });
  }

    const products = productsData.filter(product =>
    product.name.toLowerCase().includes(name.toLowerCase())
  );

  res.json(products); });
router.get('/products/findname/:productName', (req, res) => {
  const productName = req.params.productName.toLowerCase(); 
    const product = productsData.find(
    (product) => product.name.toLowerCase() === productName
  );

  if (product) {
    res.json(product);   } else {
    res.status(404).json({ message: 'Sản phẩm không tìm thấy' });   }
});

  module.exports = router;
