const mongoose = require('mongoose');

const RefundLogSchema = new mongoose.Schema({
  refundId: { type: String, required: true },
  amount: { type: Number, required: true },
  reason: { type: String },
  status: { type: String, required: true, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const PaymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gateway: {
    type: String,
    required: true,
    enum: ['Stripe', 'Razorpay', 'PayPal', 'COD']
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded', 'Partially_Refunded'],
    default: 'Pending'
  },
  refunds: [RefundLogSchema]
}, {
  timestamps: true
});

// Create index for fast lookups
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ order: 1 });
PaymentSchema.index({ user: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);
