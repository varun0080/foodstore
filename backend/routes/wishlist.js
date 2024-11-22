const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const WishlistItem = require('../models/WishlistItem');
const Product = require('../models/Product'); 


router.get('/', authenticateJWT, async (req, res) => {
  try {
    
    const wishlistItems = await WishlistItem.find({ userId: req.user.userId }).populate('product');
    res.json(wishlistItems);
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    res.status(500).json({ message: error.message });
  }
});


router.post('/', authenticateJWT, async (req, res) => {
  const { productId } = req.body;
  try {
    
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    
    const existingItem = await WishlistItem.findOne({ userId: req.user.userId, product: productId });
    if (existingItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    
    const wishlistItem = new WishlistItem({
      userId: req.user.userId, 
      product: productId
    });
    const newWishlistItem = await wishlistItem.save();
    res.status(201).json(newWishlistItem);
  } catch (error) {
    console.error("Error saving to wishlist:", error);
    res.status(400).json({ message: error.message });
  }
});


router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    
    const wishlistItem = await WishlistItem.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!wishlistItem) {
      return res.status(404).json({ message: "Wishlist item not found or not authorized" });
    }
    res.json({ message: "Wishlist item removed" });
  } catch (error) {
    console.error("Error removing wishlist item:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
