const express=require("express");
const router=express.Router();
const {isAuthenticated}=require('../helpers/auth');
const Controller=require("../controllers/location");

router.route("/")
.get(Controller.getLocations)    
.post(Controller.create);

module.exports=router