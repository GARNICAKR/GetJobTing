const express=require("express");
const router=express.Router();
const {isAuthenticated}=require('../helpers/auth');
const Controller=require("../controllers/jobs");

router.route("/")
    .get(Controller.Fcreate)
    .post(Controller.create);
router.get("/oferta",Controller.showJobs);
router.post("/search",Controller.searchJobs);
router.get("/prueba",Controller.pruebaRabbit);
router.route("/:id")
    .get(Controller.Fedit)
    .put(Controller.edit)
    .delete(Controller.delete);

module.exports=router