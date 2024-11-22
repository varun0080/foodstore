const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); 
const mongoose = require('mongoose'); 


router.get('/', async (req, res) => {
  try {
    console.log("Request received at /api/products"); 
    const products = await Product.find();
    console.log("Products fetched from MongoDB:", products); 
    res.json(products); 
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product); 
  } catch (error) {
    console.error('Error fetching product by ID:', error); 
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
