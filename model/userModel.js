const mongoose=require('mongoose')


const userSchema= new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  firstName:{
    type:String,
    required:true
  },
    lastName:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        
    },
    password:{
        type:String,
        required:true
    },
 
})


const user=mongoose.model("User",userSchema);
module.exports=user