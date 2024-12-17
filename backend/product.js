const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();

const productsPath = path.join(__dirname, './database/products.json'); // Đường dẫn tới file products.json
let productsData = require(productsPath); // Tải dữ liệu sản phẩm từ file JSON

// Cấu hình multer để lưu ảnh vào thư mục 'public/img/product'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../frontend/public', 'img', 'product')); // Lưu ảnh vào frontend/public/img/product
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Đặt tên file ảnh dựa trên timestamp và phần mở rộng file
  }
});

const upload = multer({ storage });


// API lấy danh sách tất cả sản phẩm
router.get('/products', (req, res) => {
  res.json(productsData);
});

// API lấy danh sách tất cả danh mục
router.get('/categories', (req, res) => {
  const categoriesPath = path.join(__dirname, './database/categories.json');
  const categories = require(categoriesPath);
  res.json(categories);
});

// API lấy sản phẩm theo categoryId
router.get('/products/:categoryId', (req, res) => {
  const categoryId = parseInt(req.params.categoryId);
  const filteredProducts = productsData.filter(product => product.categoryId === categoryId);
  res.json(filteredProducts);
});
// API lấy sản phẩm theo id
router.get('/products/findid/:id', (req, res) => {
const id = parseInt(req.params.id, 10); // Đảm bảo id là kiểu số

// Tìm sản phẩm có id trùng với giá trị trong req.params.id
const product = productsData.find(product => product.id === id);

if (product) {
  res.json(product); // Trả về sản phẩm nếu tìm thấy
} else {
  res.status(404).json({ message: 'Sản phẩm không tìm thấy' }); // Trả về lỗi nếu không tìm thấy sản phẩm
}
});


// API cập nhật trạng thái của sản phẩm
router.put('/products/:id/status', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const { active } = req.body; // Trạng thái mới

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
  console.log('Body:', req.body); // Kiểm tra xem req.body có chứa dữ liệu
  console.log('File:', req.file); // Kiểm tra xem file có được tải lên không

  if (!req.file) {
    return res.status(400).json({ message: 'Vui lòng tải lên ảnh sản phẩm' });
  }

  const { 'product-name': name, 'product-quantity': quantity, 'product-category': categoryId, 'product-price': price, 'is-discount': isDiscount, 'product-discount-price': discountprice } = req.body;

  const imagePath = `/img/product/${req.file.filename}`; // Đường dẫn ảnh đã lưu

  // Chuyển các giá trị thành số
  const priceValue = Number(price); // Chuyển giá thành số
  const quantityValue = Number(quantity); // Chuyển số lượng thành số
  const discountPriceValue = discountprice === undefined || discountprice === '' ? -1 : Number(discountprice); // Chuyển giá khuyến mãi thành số hoặc -1 nếu không có

  // Tạo đối tượng sản phẩm
  const newProduct = {
    id: productsData.length + 1, // Tạo id tự động
    name,
    price: priceValue, // Giá đã được chuyển thành số
    discountprice: discountPriceValue === -1 ? -1 : discountPriceValue, // Giá khuyến mãi là -1 nếu không có
    quantity: quantityValue, // Số lượng đã được chuyển thành số
    categoryId: Number(categoryId), // Chuyển categoryId thành số
    active: quantityValue > 0 ? 'Sẵn Hàng' : 'Ngừng Kinh Doanh',
    img: imagePath,
  };

  // Thêm sản phẩm vào dữ liệu
  productsData.push(newProduct);

  // Lưu dữ liệu vào file
  fs.writeFile(productsPath, JSON.stringify(productsData, null, 2), (err) => {
    if (err) {
      console.error('Lỗi khi lưu sản phẩm:', err);
      return res.status(500).json({ message: 'Lỗi server khi lưu sản phẩm' });
    }

    res.status(201).json({ message: 'Sản phẩm đã được thêm', product: newProduct });
  });
});
// API cập nhật thông tin sản phẩm
router.put('/products/:id', upload.single('product-image'), (req, res) => {
const productId = parseInt(req.params.id, 10);
const { name, quantity, categoryId, price, discountPrice } = req.body;
const imageFile = req.file;

// Kiểm tra nếu sản phẩm tồn tại
const productIndex = productsData.findIndex(product => product.id === productId);
if (productIndex === -1) {
  return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
}

// Cập nhật thông tin sản phẩm
const updatedProduct = {
  ...productsData[productIndex],
  name,
  quantity: Number(quantity),
  categoryId: Number(categoryId),
  price: Number(price),
  discountprice: discountPrice !== undefined ? Number(discountPrice) : -1,
};

// Nếu có ảnh mới, cập nhật đường dẫn ảnh
if (imageFile) {
  updatedProduct.img = `/img/product/${imageFile.filename}`;
}

// Cập nhật sản phẩm trong mảng dữ liệu
productsData[productIndex] = updatedProduct;

// Lưu lại dữ liệu vào file
fs.writeFile(productsPath, JSON.stringify(productsData, null, 2), (err) => {
  if (err) {
    console.error('Lỗi khi ghi dữ liệu vào file:', err);
    return res.status(500).json({ message: 'Lỗi server khi lưu dữ liệu' });
  }

  res.json({ message: 'Cập nhật sản phẩm thành công', product: updatedProduct });
});
});
// API tìm kiếm sản phẩm theo tên
router.post('/products/search', (req, res) => {
const { name } = req.body;

if (!name) {
  return res.status(400).json({ message: 'Từ khóa tìm kiếm không được cung cấp' });
}

// Tiến hành tìm kiếm trong danh sách sản phẩm
const products = productsData.filter(product =>
  product.name.toLowerCase().includes(name.toLowerCase())
);

res.json(products); // Trả về kết quả tìm kiếm
});
router.get('/products/findname/:productName', (req, res) => {
const productName = req.params.productName.toLowerCase(); // Chuyển tên sản phẩm thành chữ thường để tìm kiếm không phân biệt chữ hoa chữ thường

// Tìm sản phẩm trong dữ liệu sản phẩm
const product = productsData.find(
  (product) => product.name.toLowerCase() === productName
);

if (product) {
  res.json(product); // Trả về tất cả thông tin của sản phẩm
} else {
  res.status(404).json({ message: 'Sản phẩm không tìm thấy' }); // Nếu không tìm thấy sản phẩm
}
});

module.exports = router;
