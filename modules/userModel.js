const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator')
const Schema=mongoose.Schema;
const userSchema= new Schema({
    name:{
      type:String,
      required: true,
    },
    email:{
        type: String , 
        required: true,
        unique : true
    } ,
    password:{
        type: String , 
        required: true,
    } 
    
  },{timestamps:true}
  )
  // statics
  userSchema.statics.signup = async function(name,email,password)
{
    if(!email || !password || !name)
    {
        throw Error("يجب ملأ جميع الحقول")
    }
    if(!validator.isEmail(email))
    {
        throw Error("الرجاء التاكد من الايميل ")
    }
    if(!validator.isStrongPassword(password))
    {
        throw Error("يجب ان تتكون كلمة المرور من  8 حروف او اكثر و يجب ان تحتوي على ارقام و رموز")
    }
    const exiset = await this.findOne({email})
    
    if(exiset)
    {
        throw Error('الايميل مستخدم  ')
    }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password,salt);
  const user = await this.create({name,email,password: hash});
  return user;

}
userSchema.statics.login = async function(email,password)
{
    if(!email || !password)
    {
        throw Error("all feilds must be filled")
    }
   
    const user = await this.findOne({email})
    
    if(!user)
    {
        throw Error('Wrong Email or Password !')
    }
    const match = await bcrypt.compare(password,user.password);
    if(!match)
    {
        throw Error('Wrong Email or Password !')
    }
  return user;

}
  module.exports=mongoose.model('User',userSchema);