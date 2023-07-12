const express= require("express")
const adminController = require("../controller/adminController")
const router_admin= express.Router()

router_admin.post("/adminLogin",adminController.adminLogin)
router_admin.get("/allUsers",adminController.allUsers)
router_admin.get("/allOrganizers",adminController.allOrganizers)
router_admin.post("/banner",adminController.addBanner)
router_admin.get("/bannerOne",adminController.bannerOne)
router_admin.get("/getBanner",adminController.getBanner)
router_admin.patch("/editBanner",adminController.editBanner)
router_admin.patch("/userBlock",adminController.userBlock)
router_admin.patch("/userUnblock",adminController.userUnblock)
router_admin.patch("/organizerBlock",adminController.organizerBlock)
router_admin.patch("/organizerUnblock",adminController.organizerUnblock)






module.exports=router_admin;