const Organizer = require("../model/organizerModel");
const Event=require('../model/event')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const organizer_register = async (req, res) => {
  try {
    console.log(" organizer register reached");
    console.log(req.body);
    const organizerData = req.body;
    console.log(organizerData.email);
    const organizerFind = await Organizer.findOne({ email: organizerData.email });
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
      });
      const token = jwt.sign(
        { id: organizerData._id, email: organizerData.email },
        process.env.JWT_SECRET,
        { expiresIn: "24hr" }
      );


     

      console.log("yyeyye");
      res.status(200).json({
        organizerData:organizerFind,
        message: "registered successfully..!",
        token,
        status: true,
      });
    } else if (req.body.image) {
      organizerData.password = await bcrypt.hash(organizerData.password, 10);
      const newOrganizer = new Organizer(organizerData);
      newOrganizer.save();
      const token = jwt.sign(
        { id: organizerData._id, email: organizerData.email },
        process.env.JWT_SECRET,
        { expiresIn: "24hr" }
      );
      res.status(200).json({ google: true,token,organizerData:organizerFind });
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
      bcrypt.compare(organizerDetails.password,organizer.password ).then((data) => {
        if (data) {
          console.log("one");
          console.log("compareddd");
          const token = jwt.sign(
            { id: organizer._id, email: organizer.email },
            process.env.JWT_SECRET,
            { expiresIn: "24hr" }
          );
          console.log(token);
          res
            .status(200)
            .json({
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



const addEvent=(req,res)=>{
  try {
    console.log("reached addEvent ");
 
  

    const event = JSON.parse(req.body.event);
 
    event.image=req.files.image[0].filename

    event.coverImage=req.files.coverImage[0].filename
  
   const location={
    street:event.street,
    city:event.city,
    district:event.district,
    state:event.state
   }
    console.log(event)
  event.location=location
    const newEvent= Event(event)
    newEvent.save()
     
    console.log("hello")
      
    


  } catch (error) {
    
  }
}






module.exports={
    organizer_register,
    organizer_login,
    addEvent

}