const organizerController= require("../controller/organizerController")
const userController= require("../controller/userController")

const express=require("express")
const router_organizer=express.Router()
const Auth =require( "../middleware/auth")
const upload = require("../middleware/multer")


//////////////////////////ORGANIZER ROUTES////////////////////////


router_organizer.post('/register',organizerController.organizer_register)
router_organizer.post('/login',organizerController.organizer_login)
router_organizer.post('/add-event', upload.fields([{name:'coverImage',maxCount:1},{name:'image',maxCount:1}]),organizerController.addEvent)
router_organizer.post('/updateProfile', organizerController.updateProfile)
router_organizer.patch("/organizerCoverImageUpdate",upload.single('organizerCoverImage'),organizerController.organizerCoverImageUpload)
router_organizer.patch("/organizerImageUpdate",upload.single('organizerProfileImage'),organizerController.organizerImageUpdate)
router_organizer.post("/organizerAddPost",upload.single('postImage'),organizerController.organizerAddPost)

router_organizer.get('/organizerEvents',organizerController.organizerEvents)
router_organizer.get("/organizerPosts",organizerController.organizerPosts)


router_organizer.get("/eventDetails",organizerController.eventDetails)
router_organizer.get('/chartdetails',organizerController.chartdetails)
router_organizer.get('/tableDetails',organizerController.tableDetails)

router_organizer.get("/getAllContacts",organizerController.getAllContacts)
router_organizer.get("/getAllMessages",userController.getAllMessages)
router_organizer.post("/addMessage",userController.addMessage)


module.exports=router_organizer;