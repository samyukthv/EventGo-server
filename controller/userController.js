const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



// user register  

const registerUser = async (req, res) => {
  try {
    console.log("register reached");
    console.log(req.body);
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
      });
      const token = jwt.sign(
        { id: userdata._id, email: userdata.email },
        process.env.JWT_SECRET,
        { expiresIn: "24hr" }
      );

      console.log("yyeyye");
      res.status(200).json({
        userData: req.body,
        message: "registered successfully..!",
        token,
        status: true,
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
      res.status(200).json({ google: true,token });
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
      bcrypt.compare(userDetails.password,user.password ).then((data) => {
        if (data) {
          console.log("one");
          console.log("compareddd");
          const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24hr" }
          );
          console.log(token);
          res
            .status(200)
            .json({
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

module.exports = {
  registerUser,
  loginUser,
};
