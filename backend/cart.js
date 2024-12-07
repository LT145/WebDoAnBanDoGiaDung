const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const cartFilePath = path.join(__dirname, "./database/cart.json");

const readCartData = () => {
  if (!fs.existsSync(cartFilePath)) {
    fs.writeFileSync(cartFilePath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(cartFilePath, "utf-8"));
};

const writeCartData = (data) => {
  fs.writeFileSync(cartFilePath, JSON.stringify(data, null, 2), "utf-8");
};


router.post("/cart/add", (req, res) => {
  const { userId, productId } = req.body; 

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "userId and productId are required" });
  }

  const cartData = readCartData();
  let userCart = cartData.find((cart) => cart.userId === userId);

  if (!userCart) {
    userCart = { userId, cart: [] };
    cartData.push(userCart);
  }


  const productIndex = userCart.cart.findIndex(
    (item) => item.productId === productId
  );

  if (productIndex > -1) {
    userCart.cart[productIndex].quantity += 1;
  } else {

    userCart.cart.push({
      productId,
      quantity: 1,
    });
  }

  writeCartData(cartData);

  res
    .status(200)
    .json({
      message: "Product added to cart successfully",
      cart: userCart.cart,
    });
});

router.get("/", (req, res) => {
  const cartData = readCartData();
  res.status(200).json(cartData);
});

router.get("/cart", (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  const cartData = readCartData();

  let userCart = cartData.find((cart) => cart.userId === userId);

  if (!userCart) {
    userCart = { userId, cart: [] };

    cartData.push(userCart);
    writeCartData(cartData);
  }

  res.json(userCart.cart);
});

router.put("/cart/update", (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || quantity < 1) {
    return res
      .status(400)
      .json({ message: "Invalid userId, productId, or quantity" });
  }

  const cartData = readCartData();

  const userCart = cartData.find((cart) => cart.userId === userId);

  if (!userCart) {
    return res.status(404).json({ message: "Cart not found for this user" });
  }

  const productIndex = userCart.cart.findIndex(
    (item) => item.productId === productId
  );

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found in cart" });
  }

  userCart.cart[productIndex].quantity = quantity;

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

    const userCart = cartData.find((cart) => cart.userId === userId);

    if (!userCart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    userCart.cart = userCart.cart.filter((item) => item.productId !== productId);

    writeCartData(cartData);

    res.status(200).json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng" });
  } catch (err) {
    console.error("Error removing item from cart:", err);
    return res.status(500).json({ message: "Lỗi khi xóa sản phẩm" });
  }
});

module.exports = router;
