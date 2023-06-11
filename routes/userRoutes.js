const userController=require("../controller/userController")
const organizerController=require('../controller/organizerController')
const express=require("express")
const router_user=express.Router()
const Auth =require( "../middleware/auth")


////////////////////////////USER ROUTERS//////////////////////////

router_user.post('/register',userController.registerUser)
router_user.post('/login',userController.loginUser)
router_user.get("/events",userController.listEvent)
router_user.get("/userProfile",Auth,userController.userProfile)
router_user.post('/sendMail',userController.sendMail)
router_user.post('/resetPass',userController.resetPassword)
router_user.post("/setNewPassword/:id",userController.resetPassword)
router_user.get('/getOrganizerDetails',userController.getOrganizerDetails)










module.exports=router_user;