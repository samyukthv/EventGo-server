const { response } = require("express");
const Admin=require("../model/admin")
const User= require("../model/userModel")
const Bookings= require("../model/booking")
const Organizer= require("../model/organizerModel")
const Banner= require("../model/banner")

const jwt = require("jsonwebtoken");


const adminLogin = async(req,res)=>{
    try {
        const {email,password}=req.body
        
      let admin = await Admin.findOne({ email:email });
      if(admin){
        if(password==admin.password){
          const token= jwt.sign({id:response._id,email:response.email},process.env.JWT_SECRET,{expiresIn:"24h"});
          res.status(200).json({token,success:true})
        }else{
            res.status(400).json({message:"invalid password"})
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



module.exports={
    adminLogin,
    allUsers,
    allOrganizers,
    editBanner,
    addBanner,
    bannerOne,
    getBanner,
    editBanner
}


























































































