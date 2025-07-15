const express = require('express');
const formidable = require('express-formidable');
const {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  updateProductController,
  searchProductController,
  realtedProductController,
  productCategoryController,
  braintreeTokenController,
  brainTreePaymentController,
} = require('../controllers/productController.js');
const { isAdmin, requireSignIn } = require('../middlewares/authMiddleware.js');

const router = express.Router();

// Create product
router.post(
  '/create-product',
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// Update product
router.put(
  '/update-product/:pid',
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// Get all products
router.get('/get-product', getProductController);

// Get single product
router.get('/get-product/:slug', getSingleProductController);

// Get product photo
router.get('/product-photo/:pid', productPhotoController);

// Delete product
router.delete('/delete-product/:pid', requireSignIn, isAdmin, deleteProductController);

// Filter products
router.post('/product-filters', productFiltersController);

// Product count
router.get('/product-count', productCountController);

// Product per page
router.get('/product-list/:page', productListController);

// Search product
router.get('/search/:keyword', searchProductController);

// Related products
router.get('/related-product/:pid/:cid', realtedProductController);

// Category wise product
router.get('/product-category/:slug', productCategoryController);

// Braintree payment routes
router.get('/braintree/token', braintreeTokenController);
router.post('/braintree/payment', requireSignIn, brainTreePaymentController);

module.exports = router;
