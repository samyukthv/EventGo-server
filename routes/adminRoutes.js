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







module.exports=router_admin;