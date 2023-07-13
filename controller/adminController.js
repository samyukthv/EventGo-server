const { response } = require("express");
const Admin=require("../model/admin")
const User= require("../model/userModel")
const Bookings= require("../model/booking")
const Organizer= require("../model/organizerModel")
const Banner= require("../model/banner")
const Event= require("../model/event")
const jwt = require("jsonwebtoken");



const adminLogin = async(req,res)=>{
    try {
        const {email,password}=req.body
        
      let admin = await Admin.findOne({ email:email });
      if(admin){

        if(admin.isBlocked===true){
          res.json({ blocked: true });
        }else{

          if(password==admin.password){
            const token= jwt.sign({id:response._id,email:response.email},process.env.JWT_SECRET,{expiresIn:"24h"});
            res.status(200).json({token,success:true})
          }else{
              res.status(400).json({message:"invalid password"})
          }
        }

      }else{
        res.status(400).json({message:"invalid email"})
      }

    } catch (error) {
        
    }
}


const allUsers= async(req,res)=>{
  try {
    const userList= await User.find({})
    res.json({userList})
  } catch (error) {
    
  }
}


const allOrganizers= async(req,res)=>{
  try {
    const organizerList= await Organizer.find({})
    res.json({organizerList})
  } catch (error) {
    
  }
}

const addBanner= async(req,res)=>{
  try {
    const banner= req.body.values
    banner.image= req.body.image
    const newBanner=Banner(banner)
    newBanner.save()
    const bannerSet= await Banner.find({})
    res.json({success:true,bannerSet})
  } catch (error) {
    
  }
}


const bannerOne=async(req,res)=>{
  try {
    const banner= await Banner.find({})
   res.json({banner})
  } catch (error) {
    
  }
}

const getBanner= async(req,res)=>{
  try {
    
    const {eventId}=req.query
    const banner= await Banner.findOne({_id:eventId})
    res.json({banner})
  } catch (error) {
    
  }
}
const editBanner= async(req,res)=>{
  try {

    const {image}=req.body
    const {banner}=req.body
     
    await Banner.updateOne({_id:banner._id},{$set:{
      title:banner.title,
      description:banner.description,
      image:image
    }})
    res.json({success:true})
  } catch (error) {
    
  }
}


const userBlock= async(req,res)=>{
  try {
    const {userId}= req.body
    await User.updateOne({_id:userId},{$set:{isBlocked:true}})
    res.json({blocked:true})
  } catch (error) {
    
  }
}

const userUnblock= async(req,res)=>{
  try {
    const {userId}= req.body
    await User.updateOne({_id:userId},{$set:{isBlocked:false}})
    res.json({unblock:true})
  } catch (error) {
    
  }
}
const organizerBlock= async(req,res)=>{
  try {
    console.log("hello");
    const {organizerId}= req.body
    await Organizer.updateOne({_id:organizerId},{$set:{isBlocked:true}})
    res.json({blocked:true})
  } catch (error) {
    
  }
}

const organizerUnblock= async(req,res)=>{
  try {
    console.log("hello");
    const {organizerId}= req.body
    await Organizer.updateOne({_id:organizerId},{$set:{isBlocked:false}})
    res.json({unblock:true})
  } catch (error) {
    
  }
}


const allUserEvents= async(req,res)=>{
  try {
    const {userId}= req.query
    console.log(userId);

    const events = await Bookings.find({ user: userId }).populate('event');
 const eventDetails = events.map((booking) => booking.event);
console.log(eventDetails);
    // const events= await Bookings.find({user:userId}).populate("event")
res.json({eventDetails})
    console.log(events);
  } catch (error) {
    
  }
}


const adminEventDetails = async(req,res)=>{
  try {
    const {eventId}= req.query
    console.log(eventId,987654);
const eventDetails= await Event.findOne({_id:eventId})
console.log(eventDetails);
const street = eventDetails?.location[0].street;
    const city = eventDetails.location[0].city;
    const state = eventDetails.location[0].state;
    const country = eventDetails.location[0].country;
    const placeName = `${street}, ${city}, ${state}, ${country}`;

    console.log(eventDetails,placeName);
    res.json({eventDetails,placeName})

  } catch (error) {
    
  }
}

const adminOrganizerEvents= async(req,res)=>{
  try {
    const {eventId}= req.query
    const events= await Event.find({eventOrganizer:eventId})
    res.json({events})
  } catch (error) {
    
  }
}



const cardDetails= async(req,res)=>{
  try {
    const userCount= await User.find({}).count()
    const organizerCount= await Organizer.find({}).count()
    const eventCount= await Event.find({}).count()

    const result = await Bookings.aggregate([
      {
        $group: {
          _id: null,
          totalBillSum: { $sum: "$totalBill" }
        }
      }
    ]);
    
    const totalBillSum = result[0]?.totalBillSum || 0;


    const tot = await Bookings.aggregate([
      {
        $group: {
          _id: { $month: "$bookedDate" },
          totalRevenue: { $sum: "$totalBill" }
        }
      }
    ]);
    
    const totalEventsByMonth = await Bookings.aggregate([
      {
        $group: {
          _id: { $month: "$bookedDate" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({totalBillSum,eventCount,organizerCount,userCount,tot,totalEventsByMonth})
  } catch (error) {
    
  }
}


module.exports={
    adminLogin,
    allUsers,
    allOrganizers,
    editBanner,
    addBanner,
    bannerOne,
    getBanner,
    editBanner,
    userBlock,
    userUnblock,
    organizerUnblock,
    organizerBlock,
    allUserEvents,
    adminEventDetails,
    adminOrganizerEvents,
    cardDetails
}


























































































