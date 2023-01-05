const User=require("../models/Users");
const passport=require('passport');
module.exports={
    index:async(req,res)=>{
        const Users=await User.find();
        //console.log(user);
        res.render("mostrar",{Users});
    },
    formulario:(req,res)=>{
        res.render("users/signup");
    },
    create:async (req,res)=>{
        const {mail,password,type_user}=req.body;
        const newUser=new User({mail,password,type_user});
        newUser.password=await newUser.encryptPassword(password);
     await newUser.save();
     req.flash('success_msg','Se ha Registrado Correctamente')
      res.redirect('/signin')
    },
    edit:async(req,res)=>{
        const user=User.findById(req.params.id);
        res.json(user);
    },
    update:async(req,res)=>{
       const {mail,password,type_user}=req.body;
        req.flash('success_msg', 'Editado Correctamente');
        await User.findByIdAndUpdate(req.params.id, {mail,password,type_user});
        res.redirect('/');
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