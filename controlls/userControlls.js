const { esES } = require('@mui/x-date-pickers');
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
        res.cookie("token",token,{
          httpOnly:true,
        }).cookie("email",email,{
          httpOnly:true,
        }).send();
       // res.status(200).json({email,token});
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

    res.cookie("token",token,{
      httpOnly:true,
    }).cookie("email",email,{
          httpOnly:true,
        }).send();
}
catch(error)
{
res.status(400).json({err:error.message})
}
}



const userLogout = async (req,res) =>{

try { 

  res.cookie("token","",{
    httpOnly:true,
    expires:new Date(0),
  }).cookie("email","",{
    httpOnly:true,
    expires:new Date(0),
  }).send();
}
catch(error)
{
res.status(400).json({err:error.message})
}
}

const loggedIn = (req,res)=>{
 
  try { 
   
    const token = req.cookies.token;
   
    if(!token)
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
module.exports = {userLogin,userSignup,userLogout,loggedIn} 