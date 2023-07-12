const organizerController= require("../controller/organizerController")
const userController= require("../controller/userController")

const express=require("express")
const router_organizer=express.Router()
const {organizerAuth} =require( "../middleware/auth")
const upload = require("../middleware/multer")


//////////////////////////ORGANIZER ROUTES////////////////////////


router_organizer.post('/register',organizerController.organizer_register)
router_organizer.post('/login',organizerController.organizer_login)
router_organizer.post('/add-event',organizerAuth, organizerController.addEvent)
router_organizer.post('/updateProfile',organizerAuth, organizerController.updateProfile)
router_organizer.post("/organizerAddPost",organizerAuth,upload.single('postImage'),organizerController.organizerAddPost)
router_organizer.delete("/postDelete",organizerAuth,organizerController.deletePost)

router_organizer.patch("/saveImage",organizerAuth,organizerController.organizerImageUpdate)
router_organizer.patch("/saveCoverImage",organizerAuth,organizerController.organizerCoverImageUpload)



router_organizer.get('/organizerEvents',organizerAuth,organizerController.organizerEvents)
router_organizer.get("/organizerPosts",organizerAuth,organizerController.organizerPosts)


router_organizer.get("/eventDetails",organizerAuth,organizerController.eventDetails)
router_organizer.get('/chartdetails',organizerController.chartdetails)
router_organizer.get('/tableDetails',organizerController.tableDetails)

router_organizer.get("/getAllContacts",organizerAuth,organizerController.getAllContacts)
router_organizer.get("/getAllMessages",organizerAuth,userController.getAllMessages)
router_organizer.post("/addMessage",organizerAuth,userController.addMessage)


router_organizer.patch("/editEvent",organizerAuth,organizerController.conformEventEdit)

module.exports=router_organizer;