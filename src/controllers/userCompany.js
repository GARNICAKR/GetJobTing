const UserCompany = require("../models/userCompany");

const Jobs = require("../models/Jobs");
const { userValidation, emptydatas,files } = require("../helpers/validations");
const { Publish } = require("../helpers/rabbitMQ");
const mongoose = require('mongoose');
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
  
    } = req.body;
    let validacion = await userValidation(mail, password, type_user);

    if (validacion) {
      let data={
        error:validacion
      }
      res.send(data);
    } else {
      
      const datavalid = [
        nameCompany,
        description,
        rfc,
        sat,
        country,
        state,
        city,
      
      ];
      if (!emptydatas(datavalid)) {
        let data={
          error:"No dejar espacios vacios"
        }
        res.send(data);
      } else {

          const location = {
            country: country,
            state: state,
            city: city,
      
          };
         let fileValidation=files(req.file,"photo");
          if(fileValidation){
            let data={
              error:fileValidation
            }
            res.send(data)
          }else{
            try {
              const logo = fs.readFileSync(`uploads/${req.file.filename}`);
              fs.unlinkSync(`uploads/${req.file.filename}`);  
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
              let data={
                ok:"ok"
              }     
            res.send(data);
            } catch (error) {
              let data={
                error:error
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

  ShowCompany: async (req, res) => {
    try {
      if (mongoose.isValidObjectId(req.params.id)) {
        const Company = await UserCompany.findById(req.params.id).lean();
        Company.logo =Company.logo.buffer.toString("base64");
                   
        res.json(Company);
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
  Edit: async (req, res) => {
    const {
      nameCompany,
      description,
      rfc,
      sat,
      country,
      state,
      city,
      
    } = req.body;
    const datavalid = [
      nameCompany,
      description,
      rfc,
      sat,
      country,
      state,
      city,

    ];
    if (!emptydatas(datavalid)) {
      let data={
        error:"No dejar espacios vacios"
      }
      res.send(data);
    } else {
        const location = {
            country: country,
            state: state,
            city: city,
            
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
          let data={
            ok:"ok"
          }     
      res.send(data);
    }
   
  },
  showCompanies:async(req,res)=>{
  
    try {
      const Companies = await UserCompany.find().lean();
      //console.log("Company",Companies[0].logo);
      Companies.forEach((company) => {   
       company.logo =company.logo.buffer.toString("base64");

        });

      res.json(Companies);
    } catch (error) {
      let data = {
        error: error,
      };
      res.send(data);
    }
  },
  showJobs: async (req, res) => {
    const jobs = await Jobs.find({ idUserCompany: req.params.id });
    if (jobs.length==0) {
      let data={
        error:"No ha publicado ofertas"
      }
      res.send(data);
    }else{
      res.json(jobs);
    }
    
  },
  changeStatus:async(req,res)=>{
    try {
    const {idJob,idEmployee,status}=req.body;
    console.log(idJob,idEmployee,status);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const  headers={
      tabla:"Aplicant",
      peticion:"EditStatusAp",
      'x-match':'all'
      };

      Publish(headers,{
          idEmployee,
          idJob:idJob,
          status:status,
          fecha:formattedDate
      });
      const  headers1={
        tabla:"UserEmployee",
        peticion:"EditStatusE",
        'x-match':'all'
        };
      
        
        Publish(headers1,{
            idEmployee,
            idJob,
            status:status,
            fecha:formattedDate
        });
        const  headers2={
          tabla:"UserEmployee",
          peticion:"AddNotifyE",
          'x-match':'all'
          };
          Publish(headers2,{
              _id:idEmployee,
              notification:"Hay cambios en tus postulaciones"
          }); 
      let data={
          ok:"Modificado Correctamente"
           }
res.send(data);
      
    } catch (error) {
      console.error(error)
    }
    
    
  }, 
  editLogo:async(req,res)=>{

    let fileValidation=files(req.file,"photo");
          if(fileValidation){
            let data={
              error:fileValidation
            }
            res.send(data)
          }else{
            const logo = fs.readFileSync(`uploads/${req.file.filename}`);
              fs.unlinkSync(`uploads/${req.file.filename}`);  
              const  headers={
                tabla:"UserCompany",
                peticion:"EditLogo",
                'x-match':'all'
              };
              let auxlogo= logo.toString("base64");   
            
              Publish(headers,{
                _id:req.params.id,
                logo
              });
              let data = {
                logo:auxlogo
              };
              res.json(data);
          }
  },

};
