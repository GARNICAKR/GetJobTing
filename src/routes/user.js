 const express=require('express');
 const router=express.Router();
 const {isAuthenticated}=require('../helpers/auth');
 const Controller=require('../controllers/user');
 router.get("/",Controller.index);
 router.route('/signup')
    .get(Controller.Fcreate)
    .post(Controller.create);
router.delete('/userDelete/:id',Controller.delete)
router.route('/signin')
    .get(Controller.iniciarSesion)
    .post(Controller.Logearse);
/*
router.route('/user/:id')
 .put(Controller.editUser)
 .delete(Controller.delete);*/
 module.exports=router