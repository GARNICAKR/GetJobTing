const express=require("express");
const router=express.Router();
const {isAuthenticated}=require('../helpers/auth');
const Controller=require("../controllers/applicants");

router.route("/")
    .put(Controller.newAplicante)
    .delete(Controller.deleteAplicante);

router.get("/show/:id",Controller.showAplicants)
    module.exports=router