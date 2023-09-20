const UserEmployee = require("../models/UsersEmployee");
const User = require("../models/Users");
const Jobs = require("../models/Jobs");
const { userValidation, emptydatas, files } = require("../helpers/validations");
const mongoose = require('mongoose');

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
        sector,
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
          sector,

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
                sector,
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
  Show: async (req, res) => {
    if (mongoose.isValidObjectId(req.params.id)) {
      try {
        const employee = await UserEmployee.findById(req.params.id)
          .populate({ path: "idUser", select: "mail" })
          .lean();
    
        if (employee) {
          employee.photo = employee.photo.toString("base64");
          employee.CV = employee.CV.buffer.toString("base64");
          res.json(employee);
        } else {
          let data = {
            error: "Usuario no Encontrado",
          };
          res.send(data);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // req.params.id no es un ID válido de MongoDB
      let data = {
        error: "ID no válido ",
      };
      // res.status(400).json(data); // Puedes usar el código de estado 400 para indicar una solicitud incorrecta
      res.send(data);
    }  

  },
  Edit: async (req, res) => {
 
    const { name, last_name, phone_number, country, state, city,university,carrera,introduction,skills,sector } =
      req.body;
    const datavalid = [
      name,
      last_name,
      phone_number,
      country,
      state,
      city,
      sector,
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
          sector,
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

    if (!Employee.postulations) {
      return res.json({ error: "No hay postulaciones" });
    }
    
    const postulationPromises = Employee.postulations.map(async (postulation) => {
      const job1 = await Jobs.findById(postulation.idJob)
        .populate({ path: "idUserCompany", select: "nameCompany logo" })
        .lean();
    
      job1.status = postulation.status;
      job1.fecha = postulation.fecha;
      job1.idUserCompany.logo = job1.idUserCompany.logo.buffer.toString("base64");
    
      return job1;
    });
    
    const postulaciones = await Promise.all(postulationPromises);
    
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

  getNotify:async (req,res)=>{
    try {
      if (mongoose.isValidObjectId(req.params.id)) {
        const Employee = await UserEmployee.findById(req.params.id).lean();
        let groupNotifySee=[];
        let groupNotifyUnSee=[];
        let bandSee=false;
        let bandUnSee=false;
        Employee.notifications.forEach(notify => {
          groupNotifyUnSee.forEach(group => {
             if(group.idJob==notify.idJob ){
              bandUnSee=true
               if(notify.state=="No Visto"){
                group.numNotify++;
               }
             }
           });
           groupNotifySee.forEach(group => {
            if(group.idJob==notify.idJob ){
              bandSee=true
              if(notify.state=="Visto"){
               group.numNotify++;
              }
            }
          });

           if(bandSee==false){
            if(notify.state=="Visto"){
              let auxNotify=notify;
              auxNotify.numNotify=1;
              groupNotifySee.push(auxNotify)
             }
           }
           if(bandUnSee==false){
            if(notify.state=="No Visto"){
              let auxNotify=notify;
              auxNotify.numNotify=1;
              groupNotifyUnSee.push(auxNotify)
             }
           }
           bandUnSee=false;
           bandSee=false;
         });   
        let groupNotify={
          groupNotifySee,
          groupNotifyUnSee
        }     

        res.json(groupNotify);
      }else{
        let data={
          error:"Id Invalido"
        }
        res.send(data);
      }
    } catch (error) {
      console.error(error);
    }
  },
  SeeNotify:async (req,res)=>{
    try {
      if (mongoose.isValidObjectId(req.params.id)) {
        const  headers={
          tabla:"UserEmployee",
          peticion:"SeeNotifyE",
          'x-match':'all'
        };
        Publish(headers,{
          _id:req.params.id,
        });
        let data={
          ok:"Modificado"
        }
        res.send(data);
      }else{
        let data={
          error:"Id Invalido"
        }
        res.send(data);
      }
    } catch (error) {
      console.error(error);
    }
  },
};
