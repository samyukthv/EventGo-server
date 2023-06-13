const mongoose = require('mongoose')
const { events } = require('./organizerModel')


const EventSchema =new mongoose.Schema({
    eventName:{
        type:String,
    },
    location:[
       {
        street:{type:String},
        city:{type:String},
        district:{type:String},
        state:{type:String},
       }
    ],

    about:{
        type:String
    },
   
    startDate:{
        type:Date
    },
    endDate:{
        type:Date
    },
    image:{
        type:String
    },

    coverImage:{
          type:String
    },
    price:{
        type:Number
    },
    eventOrganizer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organizer",
        required:true
    },
    startTime:{
        type:String
    },
    endTime:{
        type:String
    },
    description:{
        type:String
    }



    
})


const event= mongoose.model("Event",EventSchema)
module.exports=event