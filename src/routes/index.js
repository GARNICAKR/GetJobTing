 const express=require('express');
 const router=express.Router();
 const {isAuthenticated}=require('../helpers/auth');
 const Controller=require('../controllers/user');
 
 router.get("/",Controller.index);
 router.route('/signup')
    .get(Controller.formulario)
    .post(Controller.create);
router.route('/signin')
    .get(Controller.iniciarSesion)
    .post(Controller.verify);
router.route('/user/:id')
 .put(Controller.update)
 .delete(Controller.delete);
 module.exports=router