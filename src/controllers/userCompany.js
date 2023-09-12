const UserCompany = require("../models/userCompany");
const Jobs = require("../models/Jobs");
const { userValidation, emptydatas,files } = require("../helpers/validations");
const { Publish } = require("../helpers/rabbitMQ");
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
