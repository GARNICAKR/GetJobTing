
const express=require('express');
const router=express.Router();
const fs=require("fs");
const Controller=require('../controllers/userCompany');
const userCompany=require("../models/userCompany");
const {Upload,isAuthenticated}=require('../helpers/auth');
const upload=Upload();

router.route("/")
  .post(upload.single("logo"),Controller.Create)
  .get(Controller.Fcreate);
  
router.get('/jobs/:id',Controller.showJobs)
router.route("/edit/:id")
  .get(Controller.Fedit)
  .put(Controller.Edit)
module.exports=router;