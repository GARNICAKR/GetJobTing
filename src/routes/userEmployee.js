const express=require('express');
const router=express.Router();
//const Controller=require('../controllers/userEmployee');
const UserEmployee=require("../models/UsersEmployee");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' })
router.get("/archivos",(req,res)=>{
   res.render("users/userEmployee");
});
router.post('/archivos',upload.single("avatar"),(req,res)=>{
   
   res.send('OK');
 });

 module.exports=router;