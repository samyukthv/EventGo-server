const userController=require("../controller/userController")
const organizerController=require('../controller/organizerController')
const express=require("express")
const router_user=express.Router()
const Auth =require( "../middleware/auth")
const upload = require('../middleware/multer')

////////////////////////////USER ROUTERS//////////////////////////

router_user.post('/register',userController.registerUser)
router_user.post('/login',userController.loginUser)
router_user.get("/events",userController.listEvent)
router_user.get("/userProfile",Auth,userController.userProfile)
router_user.post('/sendMail',userController.sendMail)
router_user.post('/resetPass',userController.resetPassword)
router_user.post("/setNewPassword/:id",userController.resetPassword)
router_user.get('/getOrganizerDetails',userController.getOrganizerDetails)
router_user.patch('/updateProfile', userController.updateProfile)
router_user.patch("/userImageUpdate",upload.single('profileImage'),userController.userImageUpdate)

router_user.get("/eventDetails/:id",userController.eventDetails)
router_user.get('/organizerDetails/:id',userController.organizerDetails)


router_user.get("/config", userController.config); 
router_user.post("/create-payment-intent",userController.createPayment);


router_user.post('/confirmBooking',Auth,userController.confirmBooking)
router_user.get("/getBillingDetails",userController.getBillingDetails)

// to check weather the user is following the organizer
router_user.get("/isFollowingOrganizer",userController.isFollowingOrganizer)
router_user.post("/followOrganizer",userController.followOrganizer)
router_user.post("/unFollowOrganizer",userController.unFollowOrganizer)

router_user.get("/organizerEvent",userController.organizerEvent)
router_user.get("/organizerPosts",userController.organizerPosts)

module.exports=router_user;