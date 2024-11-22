const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product'); 


router.get('/', authenticateJWT, async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user.userId }).populate('product');
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: error.message });
  }
});


router.post('/', authenticateJWT, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    let cartItem = await CartItem.findOne({ userId: req.user.userId, product: productId });
    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.totalPrice = cartItem.quantity * product.price;
    } else {
      cartItem = new CartItem({
        userId: req.user.userId, 
        product: productId,
        quantity,
        totalPrice: quantity * product.price,
      });
    }

    const savedCartItem = await cartItem.save();
    res.status(201).json(savedCartItem);
  } catch (error) {
    console.error("Error saving to cart:", error);
    res.status(400).json({ message: error.message });
  }
});


router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({ _id: req.params.id, userId: req.user.userId }).populate('product');
    if (cartItem) {
      const productPrice = cartItem.product.price;
      cartItem.quantity = req.body.quantity;
      cartItem.totalPrice = cartItem.quantity * productPrice;
      const updatedCartItem = await cartItem.save();
      res.json(updatedCartItem);
    } else {
      res.status(404).json({ message: "Cart item not found or not authorized" });
    }
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(400).json({ message: error.message });
  }
});


router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const cartItem = await CartItem.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found or not authorized" });
    }
    res.json({ message: "Cart item removed" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
