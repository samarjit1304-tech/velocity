const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Please enter a short description'],
    default: 'A premium, modern design crafted with maximum intent.'
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    default: 0.0
  },
  discountPrice: {
    type: Number,
    default: 0.0
  },
  images: [{
    type: String,
    required: true
  }],
  sku: {
    type: String,
    required: [true, 'Please enter product SKU'],
    unique: true,
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Please enter product brand'],
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category']
  },
  stockCount: {
    type: Number,
    required: [true, 'Please enter stock count'],
    min: 0,
    default: 0
  },
  rating: {
    type: Number,
    default: 0.0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  specifications: [{
    name: { type: String, required: true },
    value: { type: String, required: true }
  }],
  shippingInfo: {
    type: String,
    default: 'Complimentary carbon-neutral courier courier shipping. Standard transit time 3-5 business days.'
  }
}, {
  timestamps: true
});

// Automate slug creation before validate
ProductSchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

// Indexing for search performance
ProductSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });

module.exports = mongoose.model('Product', ProductSchema);
