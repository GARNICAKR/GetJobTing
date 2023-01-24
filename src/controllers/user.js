const User=require("../models/Users");
const passport=require('passport');
const {userValidation}=require('../helpers/validations');

module.exports={
    
    Fcreate:(req,res)=>{
        res.render("users/signup");
    },
    create:async (req,res)=>{
        const {mail,password,type_user}=req.body;
        let validacion=await userValidation(mail,password,type_user);
        if(validacion!=true){
        req.flash('error_msg',validacion);
        res.render("users/signup",{mail,password});
       }else{
            const newUser=new User({mail,password,type_user});
            newUser.password=await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg','Se ha Registrado Correctamente');
             res.redirect('/signin');
          }
        
    },
    delete:async (req,res)=>{
        req.flash('success_msg', 'Signo Eliminado Correctamente');
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/');
    },
    iniciarSesion:(req,res)=>{
        req.flash('success_msg','Ha INICIADO SESION')
        res.render("users/signin");
    },
    verify:passport.authenticate('local',{
            failureRedirect:'/signin',
            successRedirect:'/',
            failureFlash: true
    }),
}