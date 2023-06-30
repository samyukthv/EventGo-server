const User = require("../model/userModel");
const Event = require("../model/event");
const Booking = require("../model/booking");
const Organizer = require("../model/organizerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendMail");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});




// user register

const registerUser = async (req, res) => {
  try {
 
    const userdata = req.body;
    console.log(userdata.email);
    const userFind = await User.findOne({ email: userdata.email });
    if (userFind) {
      console.log("if");
      return res
        .status(200)
        .json({ message: "Email already exists", status: false });
    } else if (req.body.otp) {
      console.log("there is otp");
      let password = await bcrypt.hash(req.body.password, 10);
      User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: password,
        mobile: req.body.mobile,
      }).then((response) => {
        const token = jwt.sign(
          { id: response._id, email: response.email },
          process.env.JWT_SECRET,
          { expiresIn: "24hr" }
        );

        console.log("yyeyye");
        res.status(200).json({
          userData: response,
          message: "registered successfully..!",
          token,
          status: true,
        });
      });
    } else if (req.body.image) {
      userdata.password = await bcrypt.hash(userdata.password, 10);
      const newUser = new User(userdata);
      newUser.save();
      const token = jwt.sign(
        { id: userdata._id, email: userdata.email },
        process.env.JWT_SECRET,
        { expiresIn: "24hr" }
      );
      res.status(200).json({ google: true, token, userdata });
    } else {
      res.json({ ready: "done" });
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: userController.js:23 ~ registerUser ~ error:",
      error
    );
    console.log("brooooooooooooooooooooooooooooo");

    return res.status(500).json({ error });
  }
};

//user login

const loginUser = async (req, res) => {
  try {
    console.log("loginnnnnn");
    const userDetails = req.body;
    console.log(userDetails);

    let user = await User.findOne({ email: userDetails.email });

    if (user) {
      bcrypt.compare(userDetails.password, user.password).then((data) => {
        if (data) {
          console.log("one");
          console.log("compareddd");
          const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24hr" }
          );
          console.log(token, 234567);
          res.status(200).json({
            login: true,
            token,
            user,
            message: "logged in successfully",
          });
        } else {
          res.status(200).json({ login: false, message: "invalid password" });
        }
      });
    } else {
      res.status(200).json({ login: false, message: "invalid Email" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

//list events

const listEvent = async (req, res) => {
  try {
    console.log("list events");
    const events = await Event.find({}).limit(4);
    console.log(events);
    res.json({ success: true, events });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const userProfile = async (req, res) => {
  try {
    console.log( req.body.userId,89);
    const find = await User.findOne({ _id: req.body.userId });
    if (!find) {
      res.json({ user: false, message: "unauthenticated user" });
    } else {
      res.json({ userData: find, user: true });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const sendMail = async (req, res) => {
  try {
    console.log(req.body.email);
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(200).json({ status: false, message: "email dose not exist" });
    }

    const url = `http://localhost:5173/reset-password/${user._id}`;
    await sendEmail(email, "change password link", url);
    res
      .status(200)
      .json({
        status: true,
        message: "verification email send successfully",
        verify: true,
      });
  } catch (error) {
    console.log("error");
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    let password = req.body.password;
    console.log(password);
    const user = await User.findOne({ _id: userId });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        console.log("iff");
        res.json({
          updated: false,
          message: "New password can't be old password",
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
       
        await User.updateOne(
          { _id: userId },
          { $set: { password: hashedPassword } }
        );
        res
          .status(200)
          .json({ updated: true, message: "Password updated successfully" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const getOrganizerDetails = async (req, res) => {
  try {
    const organizerFind = await Organizer.find({}).limit(4);
    res.status(200).json({ organizerFind, success: true });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updated = await User.updateOne(
      { email: req.body.email },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          mobile: req.body.mobile,
        },
      }
    );

    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    res.status(200).json({ updated: true, user });
  } catch (error) {}
};

const userImageUpdate = async(req,res)=>{
  try {
    const id = JSON.parse(req.body.id);
 
   const newImage=req.file.filename
    const updated= await User.updateOne({_id:id},{$set:{image:newImage}})
    const user = await User.findOne({_id:id})
    res.status(200).json({user,success:true})
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
}


const eventDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const eventDetails = await Event.findOne({ _id: id }).populate(
      "eventOrganizer"
    );

     const street = eventDetails?.location[0].street;
        const city = eventDetails.location[0].city;
        const state = eventDetails.location[0].state;
        const country = eventDetails.location[0].country;
        const placeName = `${street}, ${city}, ${state}, ${country}`;
        console.log(placeName);
    res.status(200).json({ eventDetails ,placeName });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const organizerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const organizerDetails = await Organizer.findOne({ _id: id });

    res.status(200).json({ organizerDetails });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

/// STRIP PAYMENT

const config = async (req, res) => {
  try {
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    res.json({
      publishableKey: publishableKey,
    });
  } catch (error) {
    console.log(message.error);
  }
};

const createPayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "Inr",
      amount: amount * 100,
      automatic_payment_methods: { enabled: true },
    });
    const clientSecret = paymentIntent.client_secret;
    // Send publishable key and PaymentIntent details to client
    res.json({
      clientSecret: clientSecret,
      amount,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};

const confirmBooking = async (req, res) => {
  try {
    const booking = {
      event: req.body.eventId,
      user: req.body.userId,
      organizer: req.body.organizerId,
      bookedDate: new Date(),
      totalBill: req.body.totalBill,
      ticketQuantity: req.body.ticketQuantity,
      userFirstName:req.body.userFirstName,
      userLastName:req.body.userLastName,
      bookingEmail:req.body.bookingEmail,
      bookingMobile:req.body.bookingMobile
    };
    const newBooking = new Booking(booking);
    newBooking.save();
    
    await Event.updateOne(
      { _id: req.body.eventId },
      { $inc: { ticketQuantity: -req.body.ticketQuantity } }
    );
  } catch (error) {
    return res.status(400).json({
      error: {
        message: e.message,
      },
    })
  }
};


const getBillingDetails=async(req,res)=>{
  try {
    const latestBooking = await Booking.findOne({})
    .sort({ bookedDate: -1 })
    .populate('user')
    .populate('event');

    
    const street = latestBooking?.event.location[0].street;
    const city = latestBooking?.event.location[0].city;
    const state = latestBooking?.event.location[0].state;
    const country = latestBooking?.event.location[0].country;
    const placeName = `${street}, ${city}, ${state}, ${country}`;
    res.json({latestBooking,success:true,placeName})
  } catch (error) {
    
  }
}


// to check if the user is following the organizer

const isFollowingOrganizer = async(req,res)=>{
  try {
    const {organizerId}=req.query
    const {userId}=req.query
    const organizerFind =await User.findOne({_id:userId,following:organizerId},{})
    if(organizerFind===null){
      res.json({organizer:false})
    }else{
      res.json({organizer:true})
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
}


const followOrganizer= async(req,res)=>{
  try {    const {userId}=req.body
    const {organizerId}=req.body
    const follow= await User.findOneAndUpdate({_id:userId},{$push:{following:organizerId}})
    const organizer= await Organizer.findOneAndUpdate({_id:organizerId},{$push:{followers:userId}})

    res.json({followed:true})
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
}
const unFollowOrganizer= async(req,res)=>{
  try {
    const {userId}=req.body
    const {organizerId}=req.body
    const unFollow= await User.findOneAndUpdate({_id:userId},{$pull:{following:organizerId}})
    const organizer= await Organizer.findOneAndUpdate({_id:organizerId},{$pull:{followers:userId}})
    res.json({unFollowed:true})
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
}


const organizerEvent= async(req,res)=>{
  try {
    const {organizerId}= req.query
    const eventDetails= await Event.find({ eventOrganizer: organizerId });
    res.json({eventDetails})
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
}
const organizerPosts= async(req,res)=>{
  try {
    const {organizerId}= req.query
    const resp=await Organizer.findOne({_id:organizerId})
  const postDetails=resp.post
    res.json({postDetails})
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
}




module.exports = {
  registerUser,
  loginUser,
  listEvent,
  userProfile,
  sendMail,
  resetPassword,
  getOrganizerDetails,
  updateProfile,
  eventDetails,
  organizerDetails,
  config,
  createPayment,
  confirmBooking,
  getBillingDetails,
  userImageUpdate,
  isFollowingOrganizer,
  followOrganizer,
  unFollowOrganizer,
  organizerEvent,
  organizerPosts
};
