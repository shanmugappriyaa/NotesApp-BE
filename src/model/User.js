const mongoose = require('./index');

// const validateEmail = (e)=>{
//     var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//     return emailPattern.test(e); 
// }

const userSchema = new mongoose.Schema({
    userName:{type:String,unique:true,required:[true,"User Name is Required"]},
    email:{type:String,required:[true,"Email is Required"]},
    password:{type:String,required:[true,"Password is Required"]}
},{timestamps:true, versionKey:false})

 const  userModel = mongoose.model('User',userSchema)
 module.exports =userModel