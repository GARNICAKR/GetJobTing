const UserEmployee = require("../models/UsersEmployee");
const User = require("../models/Users");
const Jobs = require("../models/Jobs");
const { userValidation, emptydatas, files } = require("../helpers/validations");
const { Publish } = require("../helpers/rabbitMQ");
const fs = require("fs");
module.exports = {
  Create: async (req, res) => {


      const {
        mail,
        password,
        type_user,
        name,
        last_name,
        phone_number,
        country,
        state,
        city,
      } = req.body;

     
      let validacion = await userValidation(mail, password, type_user);
      if (validacion) {
        let data={
          error:validacion
        }
        res.send(data)
      } else {
        const datavalid = [
          name,
          last_name,
          phone_number,
          country,
          state,
          city,

        ];

        if (!emptydatas(datavalid)) {
          let data={
            error:"No deje campos vacios"
          }
          res.send(data)
        } else {
          const location = {
            country: country,
            state: state,
            city: city,
          };

          let fileValidation = files(req.files.photo[0],"photo");
          if (fileValidation) {
            let data = {
              error: fileValidation,
            };
            res.send(data);
          } else {
            fileValidation = files(req.files.CV[0],"pdf");
            if (fileValidation) {
              let data = {
                error: fileValidation,
              };
              res.send(data);
            } else {
              const CV = fs.readFileSync(`uploads/${req.files.CV[0].filename}`);
              const photo = fs.readFileSync(
                `uploads/${req.files.photo[0].filename}`
              );
              fs.unlinkSync(`uploads/${req.files.CV[0].filename}`);
              fs.unlinkSync(`uploads/${req.files.photo[0].filename}`);
              const headers = {
                tabla: "UserEmployee",
                peticion: "New",
                "x-match": "all",
              };
              Publish(headers, {
                user: {
                  mail,
                  password,
                  type_user,
                },

                name,
                last_name,
                phone_number,
                location,
           
                CV,
                photo,
              });
                let data={
                  ok:"ok"
                }            
              res.send(data);
            }

          }
        }
      }
   
  },
  Fcreate: (req, res) => {
    res.render("users/userEmployee");
  },
  Fedit: async (req, res) => {
    const employee = await UserEmployee.findById(req.params.id);
    const String64 = btoa(
      String.fromCharCode(...new Uint8Array(employee[0].CV.buffer))
    );
    res.json(employee);
  },
  Edit: async (req, res) => {
    const { name, last_name, phone_number, country, state, city } =
      req.body;
    const datavalid = [
      name,
      last_name,
      phone_number,
      country,
      state,
      city,

    ];
    if (!emptydatas(datavalid)) {
      req.flash("error_msg", "No deje espacios vacios");
      res.send("Error");
    } else {
      const location = {
        country: country,
        state: state,
        city: city,

      };
      const headers = {
        tabla: "UserEmployee",
        peticion: "Edit",
        "x-match": "all",
      };
      Publish(headers, {
        _id: req.params.id,
        Employee: {
          name,
          last_name,
          phone_number,
          location,
        },
      });
      res.send("OK");
    }
  },
  showPostulations: async (req, res) => {
    const Employee = await UserEmployee.findById(req.params.id);
    let postulaciones = [];
    let job;
    if (!Employee.postulations) {
      res.send("ERROR");
    }
    for (let i = 0; i < Employee.postulations.length; i++) {
      let postulation = Employee.postulations[i];
      let job1 = await Jobs.findById(postulation);
      postulaciones.push(job1);
    }
    res.json(postulaciones);
  },
  pruba: async (req, res) => {
    const userid = "63e6e7b454f40c62e23587ec";
    const user = await UserEmployee.findOne({ idUser: userid });
    res.json(user);
  },
};
