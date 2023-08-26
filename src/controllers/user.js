const User = require("../models/Users");
const UserCompany = require("../models/userCompany");
const passport = require("passport");
const bcrypt= require('bcryptjs');
const UserEmployee = require("../models/UsersEmployee");
const { userValidation } = require("../helpers/validations");
const { Publish } = require("../helpers/rabbitMQ");

module.exports = {
  index: (req, res) => {
    res.render("home");
  },
  Fcreate: (req, res) => {
    res.render("users/signup");
  },
  create: async (req, res) => {
    const { mail, password, type_user } = req.body;
  
    let validacion = await userValidation(mail, password, type_user);
     if (validacion) {
      req.flash("error_msg", validacion);
     // res.render("users/signup", { mail, password });
      res.send(validacion);
    } else {
      const headers={
        tabla:"User",
        peticion:"New",
        'x-match':'all'
      };
      Publish(headers,{
        mail,
        password,
        type_user
      });
      // const newUser = new User({ mail, password, type_user });
      // newUser.password = await newUser.encryptPassword(password);
      // await newUser.save();
      //res.redirect("/signin");
      res.send("OK")
    }
  },
  delete: async (req, res) => {
    const  headers={
      tabla:"User",
      peticion:"Delete",
      'x-match':'all'
    };
    const idUser=req.params.id
    Publish(headers,{
      _id:idUser
    });
    // req.flash("success_msg", "Signo Eliminado Correctamente");
    // await User.findByIdAndDelete(req.params.id);
    res.send("OK");
  },
  iniciarSesion: (req, res) => {
    req.flash("success_msg", "Ha INICIADO SESION");

    res.render("users/signin");
  },
  Logearse: async (req,res)=>{
    const { mail, password } = req.body;
      const user=  await User.findOne({mail: mail});
      let data;
      if(!user){
          data={
            error:"Usuario Incorrecto"
          }
          res.send(data)
      }else{
          const match = await bcrypt.compare(password, user.password);
            if(match){
              if(user.type_user=="company"){
                const userCompany = await UserCompany.findOne({ idUser: user._id }).lean();
                userCompany.logo =userCompany.logo.buffer.toString("base64");
                userCompany.mail=user.mail;
                res.json({userCompany});
              }else{
                const userEmployee = await UserEmployee.findOne({ idUser: user._id }).lean();
                userEmployee.photo = userEmployee.photo.toString("base64");   
                userEmployee.CV =userEmployee.CV.buffer.toString("base64");
                userEmployee.mail=user.mail;
               res.json({userEmployee});
              }
            }else{
              data={
                error:"Contraseña Incorrecta"
              }
              res.send(data)
            }
        }

  }
  // verify: passport.authenticate("local", {
  //   failureRedirect: "/signin",
  //   successRedirect: "/",
  //   failureFlash: true,
  // }),
};
