const Organizer = require("../model/organizerModel");
const Event = require("../model/event");
const Booking=require("../model/booking")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


const organizer_register = async (req, res) => {
  try {
    console.log(" organizer register reached");
    console.log(req.body);
    const organizerData = req.body;
    console.log(organizerData.email);
    console.log(organizerData);
    const organizerFind = await Organizer.findOne({
      email: organizerData.email,
    });
    if (organizerFind) {
      console.log("if");
      return res
        .status(200)
        .json({ message: "Email already exists", status: false });
    } else if (req.body.otp) {
      console.log("there is otp");
      let password = await bcrypt.hash(req.body.password, 10);
      Organizer.create({
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
          organizerData: response,
          message: "registered successfully..!",
          token,
          status: true,
        });
      });
    } else if (req.body.image) {
      organizerData.password = await bcrypt.hash(organizerData.password, 10);
      const newOrganizer = new Organizer(organizerData);
      newOrganizer.save().then((response) => {
        console.log(response, 123);
        const token = jwt.sign(
          { id: response._id, email: response.email },
          process.env.JWT_SECRET,
          { expiresIn: "24hr" }
        );

        res.status(200).json({ google: true, token, organizerData: response });
      });
    } else {
      res.json({ ready: "done" });
    }
  } catch (error) {
    console.log(
      "🚀 ~ file: userController.js:23 ~ registerUser ~ error:",
      error
    );

    return res.status(500).json({ error });
  }
};

const organizer_login = async (req, res) => {
  try {
    console.log("loginnnnnn");
    const organizerDetails = req.body;
    console.log(organizerDetails);

    let organizer = await Organizer.findOne({ email: organizerDetails.email });

    if (organizer) {
      bcrypt
        .compare(organizerDetails.password, organizer.password)
        .then((data) => {
          if (data) {
            console.log("one");
            console.log("compareddd");
            const token = jwt.sign(
              { id: organizer._id, email: organizer.email },
              process.env.JWT_SECRET,
              { expiresIn: "24hr" }
            );
            console.log(token, 212121);
            res.status(200).json({
              login: true,
              token,
              organizer,
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

const addEvent = (req, res) => {
  try {
    console.log("reached addEvent ");

    const event = JSON.parse(req.body.event);
    console.log(event);
    event.image = req.files.image[0].filename;

    event.coverImage = req.files.coverImage[0].filename;

    const location = {
      street: event.street,
      city: event.city,
      state: event.state,
      country: event.country,
    };
    console.log(event);
    event.location = location;
    const newEvent = Event(event);
    newEvent.save();

    console.log("hello");

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log(req.body);
    const updated = await Organizer.updateOne(
      { email: req.body.email },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          mobile: req.body.mobile,
          about: req.body.about,
          instagram: req.body.instagram,
          facebook: req.body.facebook,
          linkedin: req.body.linkedin,
        },
      }
    );

    const organizer = await Organizer.findOne({ email: req.body.email });
    console.log(organizer);
    res.status(200).json({ updated: true, organizer });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const organizerCoverImageUpload = async (req, res) => {
  try {
    console.log("helelele");
    const id = JSON.parse(req.body.id);

    const newImage = req.file.filename;
    const updated = await Organizer.updateOne(
      { _id: id },
      { $set: { coverImage: newImage } }
    );
    const organizer = await Organizer.findOne({ _id: id });
    res.status(200).json({ organizer, success: true });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const organizerImageUpdate = async (req, res) => {
  try {
    const id = JSON.parse(req.body.id);

    const newImage = req.file.filename;
    const updated = await Organizer.updateOne(
      { _id: id },
      { $set: { image: newImage } }
    );
    const organizer = await Organizer.findOne({ _id: id });
    res.status(200).json({ organizer, success: true });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const organizerEvents = async (req, res) => {
  try {
    const { organizerId } = req.query;
    const events = await Event.find({ eventOrganizer: organizerId });
    res.status(200).json({ events });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const organizerAddPost = async (req, res) => {
  try {
    console.log("organizerPost reached");
    const value = JSON.parse(req.body.value);
    const id = JSON.parse(req.body.id);
    const newImage = req.file.filename;
    
    await Organizer.updateOne(
      { _id: id },
      {
        $push: {
          post: {
            title: value.title,
            description: value.description,
            image: newImage,
          },
        },
      }
    );
    res.status(200).json({success:true})
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const organizerPosts = async (req, res) => {
  try {
    const { organizerId } = req.query;
    const organizerPosts = await Organizer.findOne({ _id: organizerId }).select('post');
    res.status(200).json({organizerPosts})

  } catch (error) {

    console.log(error.message);

    return res.status(500).json({ error });
  }
};


const eventDetails=async(req,res)=>{
  try {
    const {eventId}= req.query
    const details=await Event.findById({_id:eventId})
    const street = details?.location[0].street;
    const city = details.location[0].city;
    const state = details.location[0].state;
    const country = details.location[0].country;
    const placeName = `${street}, ${city}, ${state}, ${country}`;
    res.json({details,success:true,placeName})
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
}

const chartdetails=async(req,res)=>{
  try {
   const {eventId}=req.query
   const ticketQuantityPerDay = await Booking.aggregate([
    { $match: { event:new mongoose.Types.ObjectId(eventId) } }, // Match bookings with the specified event ID
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$bookedDate" } }, // Group by the bookedDate field formatted as YYYY-MM-DD
        totalTicketQuantity: { $sum: "$ticketQuantity" }, // Calculate the sum of ticketQuantity per day
      },
    },
    { $sort: { _id: 1 } }, // Sort the results by date in ascending order
  ]);
 const date = ticketQuantityPerDay.map(entry=>entry._id)
 const count = ticketQuantityPerDay.map(entry=>entry.totalTicketQuantity)

res.json({date,count})
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
}


const tableDetails=async(req,res)=>{
  try {
    const {eventId}=req.query
    console.log(eventId);
const event =await Event.findOne({_id:eventId})


    const userDetails = await Booking.find({event:eventId}).populate("user")
    console.log(userDetails);
res.json({userDetails})
  
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
}


module.exports = {
  organizer_register,
  organizer_login,
  addEvent,
  updateProfile,
  organizerEvents,
  organizerCoverImageUpload,
  organizerImageUpdate,
  organizerAddPost,
  organizerPosts,
  eventDetails,
  chartdetails,
  tableDetails
};
