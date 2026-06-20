const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  validateCoupon,
  getCoupons,
  createCoupon
} = require('../controllers/couponController');

router.post('/validate', protect, validateCoupon);

router.route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

module.exports = router;
