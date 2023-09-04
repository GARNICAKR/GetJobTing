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
 
    const { name, last_name, phone_number, country, state, city,university,carrera,introduction,skills } =
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
      let data = {
        error: fileValidation,
      };
      res.json(data);
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
      let auxSkills=JSON.parse(skills)
      Publish(headers, {
        _id: req.params.id,
        Employee: {
          name,
          last_name,
          phone_number,
          location,
          university,
          carrera,
          introduction,
          skills:auxSkills
        },
      });
      let data = {
        ok:"ok"
      };
      res.json(data);
    }
  },
  showPostulations: async (req, res) => {

    const Employee = await UserEmployee.findById(req.params.id);
    let postulaciones = [];
    let job;
    if (!Employee.postulations) {
      let data = {
        error: "No hay postulaciones",
      };
      res.send(data);
    }
    for (let i = 0; i < Employee.postulations.length; i++) {
      let postulation = Employee.postulations[i];
      let job1 = await Jobs.findById(postulation.idJob).populate({ path: "idUserCompany", select: "nameCompany logo" })
      .lean();
      job1.status=postulation.status;
      job1.fecha=postulation.fecha;
      job1.idUserCompany.logo =
      job1.idUserCompany.logo.buffer.toString("base64");
      postulaciones.push(job1);
    }
    res.json(postulaciones);
  },
  deletePostulation: async (req,res)=>{

    const {idEmployee,idJob}=req.body;
    const  headers={
      tabla:"UserEmployee",
      peticion:"DeletePostulation",
      'x-match':'all'
    };
    Publish(headers,{
      idEmployee,
      idJob,
    });     
    let data={
      ok:"ok"
    }
    res.send(data);   
  },
  editPhoto:async(req,res)=>{
    let fileValidation=files(req.file,"photo");
          if(fileValidation){
            let data={
              error:fileValidation
            }
            res.send(data)
          }else{
            const photo = fs.readFileSync(`uploads/${req.file.filename}`);
              fs.unlinkSync(`uploads/${req.file.filename}`);  
              const  headers={
                tabla:"UserEmployee",
                peticion:"EditPhoto",
                'x-match':'all'
              };
              let auxPhoto= photo.toString("base64");   
            
              Publish(headers,{
                _id:req.params.id,
                photo
              });
              let data = {
                photo:auxPhoto
              };
              res.json(data);
          }
  },
  editCV:async(req,res)=>{
    let fileValidation=files(req.file,"pdf");
          if(fileValidation){
            let data={
              error:fileValidation
            }
            res.send(data)
          }else{
            const CV = fs.readFileSync(`uploads/${req.file.filename}`);
              fs.unlinkSync(`uploads/${req.file.filename}`);  
              let auxCV= CV.toString("base64");   
              const  headers={
                tabla:"UserEmployee",
                peticion:"EditCV",
                'x-match':'all'
              };
              Publish(headers,{
                _id:req.params.id,
                CV
              });
              let data = {
                CV:auxCV
              };
              res.json(data);
          }

  },
  pruba: async (req, res) => {
    const userid = "63e6e7b454f40c62e23587ec";
    const user = await UserEmployee.findOne({ idUser: userid });
    res.json(user);
  },
};
