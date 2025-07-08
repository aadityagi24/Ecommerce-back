const userModel = require('../models/userModel');
const orderModel =require('../models/orderModel');
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const JWT = require('jsonwebtoken')





const registerController = async(req,res)=>{
    try {
        const {name, email , password , phone, address,answer} = req.body

        //validation
        if(!name){
            return res.send({message: 'Name is Required'})
        }
        if(!email){
            return res.send({message: 'Email is Required'})
        }
        if(!password){
            return res.send({message: 'Password is Required'})
        }
        if(!phone){
            return res.send({message: 'Phone no.  is Required'})
        }
        if(!address){
            return res.send({message: 'Address is Required'})
        }
          if(!answer){
            return res.send({message: 'Answer is Required'})
        }


        //check user
        const existingUser = await userModel.findOne({email})

        //existing user
        if(existingUser){
            return res.status(200).send({
                success:false ,
                message:'Already Register Please Login',
            })
        }


        //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel(
            {name,email,phone,address,password:hashedPassword,answer}
            ).save()

         return res.status(201).send({
                success:true,
                message:'User Registration successfully',
                user
            })



        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Registartion',
            error
            
        })
        
    }

}




//Post login

const loginController = async (req, res) =>{

    try {
          const {email , password} = req.body
          //validation
        if(!email|| !password){
            return res.status(404).send({
                success :false,
                message:'Invalid email or password'
            })
        }
        //check user
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not registerd'
            })
        }

        const match = await comparePassword  (password,user.password)
        if(!match){
           return res.status(200).send({
                success:false,
                message:'Invalid Password'
           })
        }


        //token
        const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.status(200).send({
                success:true,
                message:'login successfully',
                user:{
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    phone:user.phone,
                    address:user.address,
                    role:user.role
                },
                token,
            })


        
    } catch (error) {
        console.error("Login Error:", error) //in terminal
        res.status(500).send({
            success:false,
            message:'Error in Login',
            error:error.message  //show message in Postman
             
        })
        
    }
}



//forgetPasswordController
const forgetPasswordController = async(req,res) =>{
    try {
        const {email,answer,newPassword} = req.body
        if(!email){
            res.status(400).send({message:'Email is required'})
        }
        if(!answer){
            res.status(400).send({message:'Answer is required'})
        }
        if(!newPassword){
            res.status(400).send({message:'New password is required'})
        }

        //check
        const user = await userModel.findOne({email,answer})
        //validation
        if(!user){
             res.status(404).send({
            success:false,
            message:'Wrong Email or Answer',
            
             })
        }

        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id,{password:hashed})
         res.status(200).send({
            success:true,
            message:'Password Reset Sucessfully',
         });

    } catch (error) {
        console.log(error)
         res.status(500).send({
            success:false,
            message:'Something went wrong',
            error
         })
        
    }
};


//test controller
 const testController =(req,res)=>{
    res.send('protected route')
}



//update prfole
const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders
 const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//all orders
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort("-createdAt"); ; //to show latest order on top
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};


//all user in admin dashboard


const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({ role: 0 }).select("-password");
    res.status(200).send({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ success: false, message: "Error fetching users", error });
  }
};


module.exports = {
  registerController,
  loginController,
  testController,
  forgetPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController ,
  orderStatusController,
  getAllUsersController

};
