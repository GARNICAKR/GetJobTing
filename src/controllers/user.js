const User = require("../models/Users");
const passport = require("passport");
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
  verify: passport.authenticate("local", {
    failureRedirect: "/signin",
    successRedirect: "/",
    failureFlash: true,
  }),
};
