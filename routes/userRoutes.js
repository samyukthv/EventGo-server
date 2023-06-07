const userController=require("../controller/userController")
const organizerController=require('../controller/organizerController')
const express=require("express")
const router_user=express.Router()
const Auth =require( "../middleware/auth")


////////////////////////////USER ROUTERS//////////////////////////

router_user.post('/register',userController.registerUser)
router_user.post('/login',userController.loginUser)














module.exports=router_user;