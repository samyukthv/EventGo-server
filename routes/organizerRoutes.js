const organizerController= require("../controller/organizerController")
const express=require("express")
const router_organizer=express.Router()
const Auth =require( "../middleware/auth")
const upload = require("../middleware/multer")


//////////////////////////ORGANIZER ROUTES////////////////////////


router_organizer.post('/register',organizerController.organizer_register)
router_organizer.post('/login',organizerController.organizer_login)
router_organizer.post('/add-event', upload.fields([{name:'coverImage',maxCount:1},{name:'image',maxCount:1}]),organizerController.addEvent)







module.exports=router_organizer;