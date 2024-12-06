const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const cartFilePath = path.join(__dirname, "./database/cart.json");

// Đọc file cart.json
const readCartData = () => {
  if (!fs.existsSync(cartFilePath)) {
    fs.writeFileSync(cartFilePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(cartFilePath, "utf-8"));
};

// Ghi vào file cart.json
const writeCartData = (data) => {
  fs.writeFileSync(cartFilePath, JSON.stringify(data, null, 2), "utf-8");
};


// API thêm sản phẩm vào giỏ hàng
router.post("/cart/add", (req, res) => {
  const { userId, productId } = req.body; // Chỉ nhận userId và productId từ request

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "userId and productId are required" });
  }

  const cartData = readCartData();

  // Tìm giỏ hàng của user
  let userCart = cartData.find((cart) => cart.userId === userId);

  if (!userCart) {
    // Nếu giỏ hàng người dùng chưa tồn tại, tạo mới
    userCart = { userId, cart: [] };
    cartData.push(userCart);
  }

  // Tìm sản phẩm trong giỏ hàng của user
  const productIndex = userCart.cart.findIndex(
    (item) => item.productId === productId
  );

  if (productIndex > -1) {
    // Nếu sản phẩm đã tồn tại, tăng số lượng
    userCart.cart[productIndex].quantity += 1;
  } else {
    // Nếu sản phẩm chưa tồn tại, thêm mới
    userCart.cart.push({
      productId,
      quantity: 1,
    });
  }

  // Ghi dữ liệu vào file JSON
  writeCartData(cartData);

  res
    .status(200)
    .json({
      message: "Product added to cart successfully",
      cart: userCart.cart,
    });
});

// API lấy danh sách giỏ hàng
router.get("/", (req, res) => {
  const cartData = readCartData();
  res.status(200).json(cartData);
});

router.get("/cart", (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  // Đọc dữ liệu giỏ hàng từ file
  const cartData = readCartData();

  // Tìm giỏ hàng của người dùng theo userId
  let userCart = cartData.find((cart) => cart.userId === userId);

  if (!userCart) {
    // Nếu không tìm thấy giỏ hàng, tạo giỏ hàng trống
    userCart = { userId, cart: [] };

    // Thêm giỏ hàng trống vào dữ liệu và ghi lại vào file JSON
    cartData.push(userCart);
    writeCartData(cartData);
  }

  // Trả về giỏ hàng (dù là trống hoặc có sản phẩm)
  res.json(userCart.cart);
});

// API cập nhật số lượng sản phẩm trong giỏ hàng
router.put("/cart/update", (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || quantity < 1) {
    return res
      .status(400)
      .json({ message: "Invalid userId, productId, or quantity" });
  }

  const cartData = readCartData();

  // Tìm giỏ hàng của user
  const userCart = cartData.find((cart) => cart.userId === userId);

  if (!userCart) {
    return res.status(404).json({ message: "Cart not found for this user" });
  }

  // Tìm sản phẩm trong giỏ hàng của user
  const productIndex = userCart.cart.findIndex(
    (item) => item.productId === productId
  );

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found in cart" });
  }

  // Cập nhật số lượng sản phẩm
  userCart.cart[productIndex].quantity = quantity;

  // Ghi dữ liệu vào file JSON
  writeCartData(cartData);

  res
    .status(200)
    .json({ message: "Quantity updated successfully", cart: userCart.cart });
});
router.delete("/cart/remove", (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: "Thiếu thông tin người dùng hoặc sản phẩm" });
  }

  try {
    const cartData = readCartData();

    // Tìm giỏ hàng của user
    const userCart = cartData.find((cart) => cart.userId === userId);

    if (!userCart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    // Lọc sản phẩm cần xóa khỏi giỏ hàng
    userCart.cart = userCart.cart.filter((item) => item.productId !== productId);

    // Ghi lại giỏ hàng đã cập nhật vào file
    writeCartData(cartData);

    res.status(200).json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng" });
  } catch (err) {
    console.error("Error removing item from cart:", err);
    return res.status(500).json({ message: "Lỗi khi xóa sản phẩm" });
  }
});

module.exports = router;
