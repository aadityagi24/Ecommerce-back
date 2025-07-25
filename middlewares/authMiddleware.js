const JWT = require('jsonwebtoken')
const userModel = require('../models/userModel')

//protected routr token based

const requireSignIn = async (req,res,next)=>{
   try {
     const decode =JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
     req.user = decode;
     next()
 
   } catch (error) {
    console.log(error)
    
   }
}


//admin access
const isAdmin = async(req,res,next)=>{
    try {
        const user = await  userModel.findById(req.user._id)
        if(user.role !==1){
            return res.status(401).send({
            sucess:false,
            message:'unauthorized access'
            })
        }else{
            next()

        }

    } catch (error) {
        console.log(error)
         return res.status(401).send({
            sucess:false,
            error,
            message:'error in admin middleware'
         })
    }
}

module.exports = {
    requireSignIn,
    isAdmin,
};