const jwt=require('jsonwebtoken')
const User =require('../modules/userModel')
const requireAuth = async (req,res,next) =>{
    // verify Authentication 

    const token = req.headers.authorization?.split(' ')[1];
    
   if (token == "null")
   {
     return  res.status(401).json({error : 'No authorization'})
   }
   try { 
    const {_id} =  jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findOne({_id}).select('email')
    next();
   }catch(err)
   {
 
    res.status(401).json({error: 'Request is not Authorized'})
   }
    
}
module.exports = requireAuth