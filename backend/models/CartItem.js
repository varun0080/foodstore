const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  }
});

module.exports = mongoose.model('CartItem', cartItemSchema);
