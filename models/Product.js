const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  productCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  sourceEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  }
}, {
  timestamps: true
});

// Create unique index on productCode
productSchema.index({ productCode: 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema);