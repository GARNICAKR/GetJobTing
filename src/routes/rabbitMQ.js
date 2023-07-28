const express=require('express');
const router=express.Router();
const Controller=require('../controllers/rabbitMQ');
router.get("/send",Controller.sendMessage);
router.get("/recibe",Controller.recibeMessage);
router.get("/P1publisher",Controller.Practica1Publisher);
router.get("/P1Subscriber",Controller.Practica1Suscriber);
router.get("/P2publisher",Controller.Practica2FanoutPublisher);
router.get("/P2Subscriber",Controller.Practica2FanoutSuscriber);
router.get("/BackOffP",Controller.BackOffPublisher);
router.get("/BackOffS",Controller.BackOffSuscriber);
router.get("/BackOffPFuncional",Controller.BackOffPublisherFuncional);
router.get("/BackOffSFuncional",Controller.BackOffSuscriberFuncional);
/*
router.route('/user/:id')
.put(Controller.editUser)
.delete(Controller.delete);*/
module.exports=router