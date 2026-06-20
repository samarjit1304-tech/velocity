const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please provide a coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discountPercent: {
    type: Number,
    required: [true, 'Please provide discount percent'],
    min: 0,
    max: 100
  },
  minSpend: {
    type: Number,
    default: 0
  },
  expireDate: {
    type: Date,
    required: [true, 'Please provide coupon expiration date']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coupon', CouponSchema);
