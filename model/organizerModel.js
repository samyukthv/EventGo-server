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
    image:{
        type:String,
        
    },
    about:{
        type:String,
    },
    instagram:{
        type:String
    },
    linkedin:{
        type:String
    },
    facebook:{
        type:String
    },
    coverImage:{
        type:String
    },
    post:[
        {
            title:String,
            description:String,
            image:String,
        }
    ],
 

})


const organizer = mongoose.model("Organizer",organizerSchema);
module.exports=organizer