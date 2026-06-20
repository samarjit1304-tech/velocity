const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getCategories,
  createCategory,
  getCategoryBySlug
} = require('../controllers/categoryController');

router.route('/')
  .get(getCategories)
  .post(protect, admin, createCategory);

router.route('/:slug')
  .get(getCategoryBySlug);

module.exports = router;
