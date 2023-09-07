const jwt=require('jsonwebtoken')
const User =require('../modules/userModel')
const requireAuth = async (req,res,next) =>{
    // verify Authentication 
   const {authorization} = req.headers
   const token = req.cookies.token

   if (!token)
   {
     return  res.status(401).json({error : 'No authorization'})
   }
   try { 
    const {_id} =  jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findOne({_id}).select('_id')
    next();
   }catch(err)
   {
 
    res.status(401).json({error: 'Request is not Authorized'})
   }
    
}
module.exports = requireAuth