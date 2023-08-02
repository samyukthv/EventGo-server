const User = require("../model/userModel");
const Event = require("../model/event");
const Booking = require("../model/booking");
const Organizer = require("../model/organizerModel");
const Chat = require("../model/chat");
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
          { id: response._id, email: response.email, role: "user" },
          process.env.JWT_SECRET,
          { expiresIn: "24hr" }
        );

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

    return res.status(500).json({ error });
  }
};

//user login

const loginUser = async (req, res) => {
  try {
    const userDetails = req.body;

    let user = await User.findOne({ email: userDetails.email });

    if (user) {
      if (user.isBlocked === true) {
        res.json({ blocked: true });
      } else {
        bcrypt.compare(userDetails.password, user.password).then((data) => {
          if (data) {
            const token = jwt.sign(
              { id: user._id, email: user.email, role: "user" },
              process.env.JWT_SECRET,
              { expiresIn: "24hr" }
            );
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
      }
    } else {
      res.status(200).json({ login: false, message: "invalid Email" });
    }
  } catch (error) {
    console.log("nkm");
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

//list events

const listEvent = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ addedOn: -1 }).limit(4);
    res.json({ success: true, events });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const userProfile = async (req, res) => {
  try {
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
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(200).json({ status: false, message: "email dose not exist" });
    }

    const url = `https://main.d3crfbmtohnqjn.amplifyapp.com/reset-password/${user._id}`;
    await sendEmail(email, "change password link", url);
    res.status(200).json({
      status: true,
      message: "verification email send successfully",
      verify: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    let password = req.body.password;
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
    res.status(200).json({ updated: true, user });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const userImageUpdate = async (req, res) => {
  try {
    const { image, userId } = req.body;
    const upload = await User.updateOne(
      { _id: userId },
      { $set: { image: image } }
    );
    const user = await User.findOne({ _id: userId });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const eventDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const eventDetails = await Event.findOne({ _id: id })
      .populate("eventOrganizer")
      .populate("reviews.reviewerName");

    const street = eventDetails?.location[0].street;
    const city = eventDetails.location[0].city;
    const state = eventDetails.location[0].state;
    const country = eventDetails.location[0].country;
    const placeName = `${street}, ${city}, ${state}, ${country}`;

    const bookedUsers = await Booking.findOne({ event: id }, { user: 1 });

    res.status(200).json({ eventDetails, placeName, bookedUsers });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const organizerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const organizerDetails = await Organizer.findOne({ _id: id });
    const eventCount = await Event.find({eventOrganizer: id}).count()
    console.log(eventCount,"event coiunt");

    res.status(200).json({ organizerDetails ,eventCount});
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
    console.log(error.message);
    return res.status(500).json({ error });
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
      userFirstName: req.body.userFirstName,
      userLastName: req.body.userLastName,
      bookingEmail: req.body.bookingEmail,
      bookingMobile: req.body.bookingMobile,
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
    });
  }
};

const getBillingDetails = async (req, res) => {
  try {
    const latestBooking = await Booking.findOne({})
      .sort({ bookedDate: -1 })
      .populate("user")
      .populate("event");

    const street = latestBooking?.event.location[0].street;
    const city = latestBooking?.event.location[0].city;
    const state = latestBooking?.event.location[0].state;
    const country = latestBooking?.event.location[0].country;
    const placeName = `${street}, ${city}, ${state}, ${country}`;
    res.json({ latestBooking, success: true, placeName });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

// to check if the user is following the organizer

const isFollowingOrganizer = async (req, res) => {
  try {
    const { organizerId } = req.query;
    const { userId } = req.query;
    const organizerFind = await User.findOne(
      { _id: userId, following: organizerId },
      {}
    );
    if (organizerFind === null) {
      res.json({ organizer: false });
    } else {
      res.json({ organizer: true });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const followOrganizer = async (req, res) => {
  try {
    const { userId } = req.body;
    const { organizerId } = req.body;
    const follow = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { following: organizerId } }
    );
    const organizer = await Organizer.findOneAndUpdate(
      { _id: organizerId },
      { $push: { followers: userId } }
    );

    res.json({ followed: true });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};
const unFollowOrganizer = async (req, res) => {
  try {
    const { userId } = req.body;
    const { organizerId } = req.body;
    const unFollow = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { following: organizerId } }
    );
    const organizer = await Organizer.findOneAndUpdate(
      { _id: organizerId },
      { $pull: { followers: userId } }
    );
    res.json({ unFollowed: true });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const organizerEvent = async (req, res) => {
  try {
    const { organizerId } = req.query;
    const eventDetails = await Event.find({ eventOrganizer: organizerId });
    res.json({ eventDetails });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};
const organizerPosts = async (req, res) => {
  try {
    const { organizerId } = req.query;
    const resp = await Organizer.findOne({ _id: organizerId });
    const postDetails = resp.post;
    res.json({ postDetails });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const personalChoice = async (req, res) => {
  try {


    const { userId } = req.query;
    const user = await User.findOne({ _id: userId }).populate("following");
    const organizers = user.following;
    const today = new Date();
    const personal = await Event.find({
      eventOrganizer: { $in: organizers },
      
    }).limit(4);


    res.json({ personal });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const allEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ addedOn: -1 }); // Sort events by 'addedOn' in descending order (-1)
    const city = await Event.distinct("location.city");
    res.json({ events, city });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};
/// CHAT FUNCTIONS

const addMessage = async (req, res) => {
  try {
    const { from, to, msg } = req.body;
    const data = await Chat.create({
      message: { text: msg },
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.json({ msg: "Message added successfully" });
    }
    return res.json({ msg: "Failed to add message" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const { to, from } = req.query;

    const messages = await Chat.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const formattedMessages = messages.map((msg) => {
      const now = new Date();
      const timeAgo = Math.floor((now - new Date(msg.updatedAt)) / 60000); // Calculate time difference in minutes

      let timeString;
      if (timeAgo <= 0) {
        timeString = "just now";
      } else if (timeAgo === 1) {
        timeString = "1 minute ago";
      } else if (timeAgo < 60) {
        timeString = `${timeAgo} minutes ago`;
      } else if (timeAgo < 1440) {
        const updatedTime = new Date(msg.updatedAt).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });
        timeString = updatedTime.includes(":")
          ? updatedTime.replace(" ", "")
          : updatedTime;
      } else {
        const updatedTime = new Date(msg.updatedAt).toLocaleString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        timeString = updatedTime.includes(",")
          ? updatedTime.replace(",", "")
          : updatedTime;
      }

      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        time: timeString,
      };
    });

    res.status(200).json({ messages: formattedMessages });
  } catch (e) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const senderDetails = async (req, res) => {
  try {
    const { senderId } = req.query;
    const senderDetails = await Organizer.findOne({ _id: senderId });
    res.json({ senderDetails });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const submitReview = async (req, res) => {
  try {
    const { details, eventId } = req.body;
    const newReview = {
      reviewerName: details.reviewerName,
      rating: details.rating,
      comment: details.comment,
      date: new Date(),
    };

    await Event.findByIdAndUpdate(
      eventId,
      { $push: { reviews: newReview } },
      { new: true }
    )
      .then(() => {
        return res.json({ success: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const allReview = async (req, res) => {
  try {
    const { eventId } = req.query;

    const reviews = await Event.findOne(
      { _id: eventId },
      { reviews: 1 }
    ).populate("reviewerName");
    res.json({ reviews });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Organizer.aggregate([
      { $unwind: "$post" }, // Unwind the 'post' array field
      {
        $lookup: {
          from: "organizers",
          localField: "_id",
          foreignField: "_id",
          as: "organizer",
        },
      },
      { $unwind: "$organizer" }, // Unwind the 'organizer' array field
      {
        $project: {
          _id: 0,
          "organizer._id": 1,

          "organizer.firstName": 1,

          "organizer.image": 1,

          "post.title": 1,
          "post.description": 1,
          "post.image": 1,
        },
      },
    ]);
    res.json({ posts });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const getUserProfileDetails = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findOne({ _id: userId });
    res.json({ user });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

const myEvents = async (req, res) => {
  try {
    const { userId } = req.query;
    const today = new Date();
    const bookings = await Booking.find({ user: userId }).populate("event");
    const pastEvents = bookings
      .filter((booking) => booking.event.startDate < today)
      .map((booking) => booking.event);

    const futureEvents = bookings
      .filter((booking) => booking.event.startDate > today)
      .map((booking) => booking.event);

    res.json({ futureEvents, pastEvents });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};

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
  organizerPosts,
  personalChoice,
  allEvents,
  addMessage,
  getAllMessages,
  senderDetails,
  submitReview,
  allReview,
  getPosts,
  getUserProfileDetails,
  myEvents,
};
