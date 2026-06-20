const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createStripePaymentIntent,
  createRazorpayOrder,
  capturePayPalOrder,
  refundPayment
} = require('../controllers/paymentController');

router.post('/stripe/create-intent', protect, createStripePaymentIntent);
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/paypal/capture', protect, capturePayPalOrder);

// Admin-only refund gateway endpoint
router.post('/refund/:id', protect, admin, refundPayment);

module.exports = router;
