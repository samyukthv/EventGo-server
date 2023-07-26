const Organizer = require("../model/organizerModel");
const Event = require("../model/event");
const Booking = require("../model/booking");
const Chat = require("../model/chat");
const User = require("../model/userModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../utils/sendMail");

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
          { id: response._id, email: response.email,role:"organizer" },
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
    const organizerDetails = req.body;
    console.log(organizerDetails);

    let organizer = await Organizer.findOne({ email: organizerDetails.email });

    if (organizer) {
    
      if(organizer.isBlocked===true){
        res.json({ blocked: true });
      }else{


        bcrypt
          .compare(organizerDetails.password, organizer.password)
          .then((data) => {
            if (data) {
              console.log("one");
              console.log("compareddd");
              const token = jwt.sign(
                { id: organizer._id, email: organizer.email ,role:"organizer"},
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
      }

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
    console.log(req.body);

    const event = req.body.eventDetails;
    const image = req.body.image;
    const coverImage = req.body.coverImage;
  
    const location = {
      street: event.street,
      city: event.city,
      state: event.state,
      country: event.country,
    };
    event.image = image;
    event.coverImage = coverImage;
    event.location = location;
    event.addedOn = new Date();
    const newEvent = Event(event);
    newEvent.save();


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
    const { coverImage, organizerId } = req.body;
    const upload = await Organizer.updateOne(
      { _id: organizerId },
      { $set: { coverImage: coverImage } }
    );
    const organizer = await Organizer.findOne({ _id: organizerId });
    res.status(200).json({ success: true, organizer });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const organizerImageUpdate = async (req, res) => {
  try {
    const { image, organizerId } = req.body;
    const upload = await Organizer.updateOne(
      { _id: organizerId },
      { $set: { image: image } }
    );
    const organizer = await Organizer.findOne({ _id: organizerId });
    res.status(200).json({ success: true, organizer });
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
   console.log(req.body);

    // console.log("organizerPost reached");
    // const value = JSON.parse(req.body.value);
    // const id = JSON.parse(req.body.id);
    // const newImage = req.file.filename;

    await Organizer.updateOne(
      { _id: req.body.organizerId },
      {
        $push: {
          post: {
            title:req.body.details.title ,
            description:req.body.details.description ,
            image:req.body.image,
          },
        },
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const organizerPosts = async (req, res) => {
  try {
    const { organizerId } = req.query;
    const organizerPosts = await Organizer.findOne({ _id: organizerId }).select(
      "post"
    );
    res.status(200).json({ organizerPosts });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ error });
  }
};

const eventDetails = async (req, res) => {
  try {
    const { eventId } = req.query;
    const details = await Event.findById({ _id: eventId });
    const street = details?.location[0].street;
    const city = details.location[0].city;
    const state = details.location[0].state;
    const country = details.location[0].country;
    const placeName = `${street}, ${city}, ${state}, ${country}`;

    res.json({ details, success: true, placeName });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const chartdetails = async (req, res) => {
  try {
    const { eventId } = req.query;
    const ticketQuantityPerDay = await Booking.aggregate([
      { $match: { event: new mongoose.Types.ObjectId(eventId) } }, // Match bookings with the specified event ID
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$bookedDate" } }, // Group by the bookedDate field formatted as YYYY-MM-DD
          totalTicketQuantity: { $sum: "$ticketQuantity" }, // Calculate the sum of ticketQuantity per day
        },
      },
      { $sort: { _id: 1 } }, // Sort the results by date in ascending order
    ]);
    const date = ticketQuantityPerDay.map((entry) => entry._id);
    const count = ticketQuantityPerDay.map(
      (entry) => entry.totalTicketQuantity
    );

    res.json({ date, count });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const tableDetails = async (req, res) => {
  try {
    const { eventId } = req.query;
    const event = await Event.findOne({ _id: eventId });

    const userDetails = await Booking.find({ event: eventId }).populate("user");
    res.json({ userDetails });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const { organizerId } = req.query;
    Chat.distinct("sender").then((res) => {
      senderIds = res
        .map((sender) => sender.toString())
        .filter((x) => x !== organizerId);
    });
    User.find({ _id: { $in: senderIds } }, { firstName: 1, image: 1 }).then(
      (users) => {
        res.status(200).json({ success: true, users });
      }
    );
  } catch (error) {}
};

const conformEventEdit = async (req, res) => {
  try {
    console.log(req.body);
    const image = req.body.image;
    const coverImage = req.body.coverImage;
    const details = req.body.event;

    await Event.updateOne(
      { _id: details._id },
      {
        $set: {
          eventName: details.eventName,
          about: details.about,
          description: details.description,
          ticketPrice: details.ticketPrice,
          ticketQuantity: details.ticketQuantity,
          startDate: details.startDate,
          endDate: details.endDate,
          endTime: details.endDate,
          startTime: details.startTime,
          image: image,
          coverImage: coverImage,
        },
      }
    );

    const bookedUsers = await Booking.find({ event: details._id });
    const bookingEmails = bookedUsers.map((booking) => booking.bookingEmail);

    for (const booking of bookedUsers) {
      const { bookingEmail, userFirstName } = booking;
      const emailMessage = `Dear ${userFirstName},\n\nWe apologize for any inconvenience caused. The event details have been changed, and here are the new details:\n\nEvent Name: ${details.eventName}\nAbout: ${details.about}\nDescription: ${details.description}\nTicket Price: ${details.ticketPrice}\nTicket Quantity: ${details.ticketQuantity}\nStart Date: ${details.startDate}\nEnd Date: ${details.endDate}\nStart Time: ${details.startTime}\nEnd Time: ${details.endTime}\n\nThank you for your understanding.\n\nBest Regards,\nThe EventGo Team`;

      await sendEmail(bookingEmail, "Information regarding your event", emailMessage);
    }

    res.status(200).json({ success: true });
  } catch (error) {}
};



const deletePost= async(req,res)=>{
  try {
    const {postId,organizerId}= req.query
    console.log(organizerId,789);
    await Organizer.updateOne({_id:organizerId},{ $pull: { post: { _id: postId } } });
      console.log("hy");
      res.json({success:true})
  } catch (error) {
    
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
  tableDetails,
  getAllContacts,
  conformEventEdit,
  deletePost
};
