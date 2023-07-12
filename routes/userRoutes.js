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
router_user.patch('/updateProfile',Auth, userController.updateProfile)
router_user.patch("/saveImage",userController.userImageUpdate)

router_user.get("/eventDetails/:id",userController.eventDetails)
router_user.get('/organizerDetails/:id',userController.organizerDetails)


router_user.get("/config",Auth, userController.config); 
router_user.post("/create-payment-intent",Auth,userController.createPayment);


router_user.post('/confirmBooking',Auth,Auth,userController.confirmBooking)
router_user.get("/getBillingDetails",Auth,userController.getBillingDetails)

// to check weather the user is following the organizer
router_user.get("/isFollowingOrganizer",Auth,userController.isFollowingOrganizer)
router_user.post("/followOrganizer",Auth,userController.followOrganizer)
router_user.post("/unFollowOrganizer",Auth,userController.unFollowOrganizer)

router_user.get("/organizerEvent",userController.organizerEvent)
router_user.get("/organizerPosts",userController.organizerPosts)


router_user.get("/personalChoice",userController.personalChoice)
router_user.get("/allEvents",userController.allEvents)


router_user.get("/senderDetails",Auth,userController.senderDetails)


router_user.post("/addMessage",Auth,userController.addMessage)
router_user.get("/getAllMessages",Auth,userController.getAllMessages)
router_user.post("/setReview",Auth,userController.submitReview)
router_user.get("/allReview",userController.allReview)

router_user.get("/listenPosts",userController.getPosts)
router_user.get("/getUserProfileDetails",Auth,userController.getUserProfileDetails)

module.exports=router_user;