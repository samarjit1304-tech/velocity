const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getUsers,
  deleteUser,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardAnalytics
} = require('../controllers/adminController');

// All routes require protect & admin middleware
router.use(protect, admin);

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

router.post('/products', createProduct);
router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

router.get('/analytics', getDashboardAnalytics);

module.exports = router;
