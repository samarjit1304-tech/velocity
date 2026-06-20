const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

let razorpayInstance;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
} catch (e) {
  console.log('Razorpay failed to initialize:', e.message);
}

// @desc    Process Stripe payment (Create Payment Intent)
// @route   POST /api/payments/stripe/create-intent
// @access  Private
exports.createStripePaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_mock')) {
      return res.status(200).json({
        success: true,
        clientSecret: 'pi_mock_intent_secret_' + Math.random().toString(36).substring(7),
        isMock: true
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { orderId }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      isMock: false
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process Razorpay payment (Create Order ID)
// @route   POST /api/payments/razorpay/create-order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    if (!razorpayInstance || !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.startsWith('rzp_test_mock')) {
      return res.status(200).json({
        success: true,
        orderId: 'order_mock_' + Math.random().toString(36).substring(7),
        amount: Math.round(amount * 100),
        currency,
        isMock: true
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      isMock: false
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process PayPal Payment (Capture Order)
// @route   POST /api/payments/paypal/capture
// @access  Private
exports.capturePayPalOrder = async (req, res) => {
  try {
    const { orderId, paypalOrderId, amount } = req.body;

    if (!orderId || !paypalOrderId) {
      return res.status(400).json({ success: false, message: 'Order reference and PayPal order ID are required' });
    }

    // Verify order in database
    const orderObj = await Order.findById(orderId);
    if (!orderObj) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // PayPal API Capture Order simulation
    // In production, invoke standard PayPal REST SDK (Checkout-Java-SDK or direct fetch token/capture API)
    const transactionId = 'pay_paypal_capture_' + Math.random().toString(36).substring(7);

    // Save Payment Log
    const payment = await Payment.create({
      order: orderId,
      user: req.user._id,
      gateway: 'PayPal',
      transactionId,
      amount: amount || orderObj.totalPrice,
      currency: 'USD',
      status: 'Completed'
    });

    // Mark Order paid
    orderObj.isPaid = true;
    orderObj.paidAt = Date.now();
    orderObj.status = 'Processing';
    orderObj.paymentResult = {
      id: transactionId,
      status: 'Completed',
      update_time: new Date().toISOString(),
      email_address: req.user.email
    };
    await orderObj.save();

    res.status(200).json({
      success: true,
      message: 'PayPal payment processed and logged successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process refund payment (Admin Only)
// @route   POST /api/payments/refund/:id
// @access  Private/Admin
exports.refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    const { amount, reason } = req.body;
    const refundAmount = amount || payment.amount;

    if (refundAmount > payment.amount) {
      return res.status(400).json({ success: false, message: 'Refund amount exceeds transaction amount' });
    }

    const refundId = 'ref_' + Math.random().toString(36).substring(7);

    // In production, execute gateway API refund calls matching payment.gateway
    // Stripe: stripe.refunds.create({ charge: payment.transactionId, amount: refundAmount })
    // Razorpay: razorpayInstance.payments.refund(payment.transactionId, { amount: refundAmount })

    // Log refund to payment model
    payment.refunds.push({
      refundId,
      amount: refundAmount,
      reason: reason || 'Requested by customer',
      status: 'Completed'
    });

    payment.status = refundAmount === payment.amount ? 'Refunded' : 'Partially_Refunded';
    await payment.save();

    // Mark Order status as Cancelled if fully refunded
    if (payment.status === 'Refunded') {
      const orderObj = await Order.findById(payment.order);
      if (orderObj) {
        orderObj.status = 'Cancelled';
        await orderObj.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Refund executed successfully',
      payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
