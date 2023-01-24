
const express=require('express');
const router=express.Router();
const fs=require("fs");
const Controller=require('../controllers/userEmployee');
const UserEmployee=require("../models/UsersEmployee");
const {Upload,isAuthenticated}=require('../helpers/auth');
const upload=Upload();

router.route("/archivos")
  .post(upload.single("avatar"),Controller.archivo)
  .get(Controller.formulario);
   
router.get('/mostrar',Controller.mostrar);

module.exports=router;