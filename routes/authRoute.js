const express = require('express');
const {
  registerController,
  loginController,
  testController,
  forgetPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  getAllUsersController,
} = require('../controllers/authController.js');

const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Auth Routes

// Register
router.post('/register', registerController);

// Login
router.post('/login', loginController);

// Forgot Password
router.post('/forgot-password', forgetPasswordController);

// Test route (admin only)
router.get('/test', requireSignIn, isAdmin, testController);

// Update user profile
router.put("/profile", requireSignIn, updateProfileController);

// User orders
router.get("/orders", requireSignIn, getOrdersController);

// Admin: get all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// Admin: update order status
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController);

// Admin: get all users
router.get('/all-users', requireSignIn, isAdmin, getAllUsersController);

//  Protected route for user dashboard
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//  Protected route for admin dashboard
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

module.exports = router;
