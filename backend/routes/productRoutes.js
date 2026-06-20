const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProducts,
  getProductById,
  createProductReview,
  getAIRecommendations,
  getSmartSearch
} = require('../controllers/productController');

// Fuzzy smart search route (must be defined before /:id to prevent parameter conflict)
router.get('/search/smart', getSmartSearch);

router.route('/')
  .get(getProducts);

router.route('/:id')
  .get(getProductById);

router.route('/:id/reviews')
  .post(protect, createProductReview);

// Similarity recommendation engine
router.get('/:id/recommendations', getAIRecommendations);

module.exports = router;
