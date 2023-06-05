const userController=require("../controller/userController")
const organizerController=require('../controller/organizerController')
const express=require("express")
const router_user=express.Router()
const Auth =require( "../middleware/auth")


////////////////////////////USER ROUTERS//////////////////////////

router_user.post('/register',userController.registerUser)
router_user.post('/login',userController.loginUser)







//////////////////////////ORGANIZER ROUTES////////////////////////


router_user.post('/organizer_register',organizerController.organizer_register)





module.exports=router_user;