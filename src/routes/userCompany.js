
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
router.put("/editLogo/:id",upload.single("logo"),Controller.editLogo);
router.get('/jobs/:id',Controller.showJobs)
router.route("/edit/:id")
  .get(Controller.Fedit)
  .put(Controller.Edit)
  router.get("/show",Controller.showCompanies);
module.exports=router;