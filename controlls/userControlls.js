
const User = require('../modules/userModel')
const jwt = require('jsonwebtoken')

const creatToken = (_id)=>{
   return jwt.sign({_id},"ZVXW3wi9761!9O3cpGec15OQbX#mwTP6",{expiresIn : '1d'});
}

const userLogin = async (req,res) =>{
    const {email , password } = req.body; 
    try { 
   
        const user = await User.login(email,password)
        const token=creatToken(user._id);
    
        res.status(200).json({token,email});
    }
    catch(error)
    {
    res.status(400).json({err:error.message})
    }

}



const userSignup = async (req,res) =>{
    const {name,email , password } = req.body; 
try { 
   
    const user = await User.signup(name,email,password)
    const token=creatToken(user._id);
  res.status(200).json({token,email})
  
}
catch(error)
{
res.status(400).json({err:error.message})
}
}



// const userLogout = async (req,res) =>{

// try { 

//   res.cookie("token","",{
//     httpOnly:true,
//     expires:new Date(0),
//   }).cookie("email","",{
//     httpOnly:true,
//     expires:new Date(0),
//   }).send();
// }
// catch(error)
// {
// res.status(400).json({err:error.message})
// }
// }

const loggedIn = (req,res)=>{
 
  try { 
   
    const token = req.headers.authorization.split(' ')[1];
   
    if(token == "null")
    {
    
      res.send(false)
    }
      else
      {
        jwt.verify(token,"ZVXW3wi9761!9O3cpGec15OQbX#mwTP6")
        res.send(true)
      }
    
    
  
   }catch(err)
   {
 
    res.send(true)
   }
}
module.exports = {userLogin,userSignup,loggedIn} 