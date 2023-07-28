const UserCompany = require("../models/userCompany");
const Jobs = require("../models/Jobs");
const { userValidation, emptydatas } = require("../helpers/validations");
const { Publish } = require("../helpers/rabbitMQ");
/*!!!!!!ME FALTA AGREGAR LA VALIDACION DEL ARCHIVO!!!!!!!*/
const fs = require("fs");
module.exports = {
  Create: async (req, res) => {
    const {
      mail,
      password,
      type_user,
      nameCompany,
      description,
      rfc,
      sat,
      country,
      state,
      city,
      address,
    } = req.body;
    let validacion = await userValidation(mail, password, type_user);

    if (validacion) {
      req.flash("error_msg", validacion);
      res.send("Error USER");
    } else {
      
      const datavalid = [
        nameCompany,
        description,
        rfc,
        sat,
        country,
        state,
        city,
        address,
      ];
      if (!emptydatas(datavalid)) {
        req.flash("error_msg", "No deje espacios vacios");
        res.send("Error");
      } else {

          const location = {
            country: country,
            state: state,
            city: city,
            address: address,
          };
          const logo = fs.readFileSync(`uploads/${req.file.filename}`);
          const  headers={
            tabla:"UserCompany",
            peticion:"New",
            'x-match':'all'
          };
          Publish(headers,{
           user:{
            mail,
            password,
            type_user
           },
            nameCompany,
            description,
            rfc,
            sat,
            location,
            logo,
          });
        req.flash("success_msg", "Se ha Registrado Correctamente");
        res.send("OK");
      }
    }
  },
  Fcreate: (req, res) => {
    res.render("users/userEmployee");
  },

  Fedit: async (req, res) => {
    const Company = await UserCompany.findById(req.params.id);
    const String64 = btoa(
      String.fromCharCode(...new Uint8Array(Company[0].CV.buffer))
    );
    res.json(Company);
  },
  Edit: async (req, res) => {
    const {
      nameCompany,
      description,
      rfc,
      sat,
      country,
      state,
      city,
      address,
    } = req.body;
    const datavalid = [
      nameCompany,
      description,
      rfc,
      sat,
      country,
      state,
      city,
      address,
    ];
    if (!emptydatas(datavalid)) {
        console.log("Entro",datavalid);
      req.flash("error_msg", "No deje espacios vacios");
      res.send("Error");
    } else {
        const location = {
            country: country,
            state: state,
            city: city,
            address: address,
          };
        const  headers={
            tabla:"UserCompany",
            peticion:"Edit",
            'x-match':'all'
          };
          Publish(headers,{
            _id:req.params.id,
            nameCompany,
            description,
            rfc,
            sat,
            location
          });

      req.flash("success_msg", "Se ha Editado Correctamente");
      res.send("OK");
    }
   
  },
  showJobs: async (req, res) => {
    const jobs = await Jobs.find({ idUserCompany: req.params.id });
    if (!jobs) {
      res.send("ERROR");
    }
    res.json(jobs);
  },
  pruba: async (req, res) => {
    const userid = "63e6e7b454f40c62e23587ec";
    const user = await UserCompany.findOne({ idUser: userid });
    res.json(user);
  },
};
