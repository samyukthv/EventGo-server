const  mongoose= require("mongoose")

const  bannerSchema= new mongoose.Schema({
    image:{
        type:String
    },
    title:{
        type:String
    },
    description:{
        type:String
    }
})

const banner=mongoose.model("banner",bannerSchema)
module.exports=banner