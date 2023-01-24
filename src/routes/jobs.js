const express=require("express");
const router=express.Router();
const {isAuthenticated}=require('../helpers/auth');
const Controller=require("../controllers/jobs");

router.route("/jobs")
    .get(Controller.Fcreate)
    .post(Controller.create);
router.route("/jobs/:id")
    .get(Controller.Fedit)
    .post(Controller.edit)
    .delete(Controller.delete);