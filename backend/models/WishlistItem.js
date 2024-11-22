const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  }
});

module.exports = mongoose.model('WishlistItem', wishlistItemSchema);
