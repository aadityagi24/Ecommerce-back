const express = require('express')
const {registerController ,
     loginController ,
      testController, 
      forgetPasswordController,
      updateProfileController ,
       getOrdersController,
      getAllOrdersController ,
      orderStatusController,
      getAllUsersController
    }= require('../controllers/authController.js')
//router object
const router = express.Router()
 const {requireSignIn,isAdmin} = require ("../middlewares/authMiddleware");




//routing
//register||method post
router.post('/register', registerController);


//login || post
router.post('/login', loginController);

//forgot passwowd ||post
router.post('/forgot-password',forgetPasswordController )



//test route
router.get('/test', requireSignIn,isAdmin, testController);


//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

///all user in admin dashboard
router.get('/all-users', requireSignIn, isAdmin, getAllUsersController);


// //protected route for dashboard
// router.get('/user-auth', requireSignIn, (req, res) => {
//   res.status(200).send({ ok: true });
// });

// //protected route for  admin dashboard
// router.get('/aminr-auth', requireSignIn,isAdmin, (req, res) => {
//   res.status(200).send({ ok: true });
// });



module.exports = router;



