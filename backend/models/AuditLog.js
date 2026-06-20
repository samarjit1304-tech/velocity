const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true, // e.g. "CREATE_PRODUCT", "UPDATE_ORDER", "DELETE_COUPON"
    trim: true
  },
  targetModel: {
    type: String,
    required: true // e.g. "Product", "Order", "Coupon"
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  changes: {
    type: mongoose.Schema.Types.Mixed, // Stores before/after payload details
    required: true
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

// Create indexes
AuditLogSchema.index({ adminUser: 1 });
AuditLogSchema.index({ targetModel: 1, targetId: 1 });
AuditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
