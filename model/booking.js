const mongoose=require("mongoose")

const BookingSchema= new mongoose.Schema({
     event:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event",
        required:true
     },
     user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
     },
     organizer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organizer",
        required:true,
     },
     bookedDate:{
        type:Date,
     },
     totalBill:{
        type:Number,
     },
     ticketQuantity:{
        type:Number
     },
     eventDate:{
        type:Date
     },
     bookingEmail:{
      type:String
     },
     bookingMobile:{
      type:Number
     },
     userFirstName:{
      type:String
     },
     userLastName:{
      type:String
     },



})

const booking= mongoose.model("booking",BookingSchema)
module.exports=booking