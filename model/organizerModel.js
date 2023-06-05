const mongoose= require("mongoose")


const organizerSchema= new mongoose.Schema({
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


const organizer = mongoose.model("Organizer",organizerSchema);
module.exports=organizer