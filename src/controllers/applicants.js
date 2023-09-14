const Aplicants=require("../models/Aplicants");
const Jobs = require("../models/Jobs");
const UserEmployee = require("../models/UsersEmployee");
const { Publish } = require("../helpers/rabbitMQ");
const mongoose = require('mongoose');
module.exports={
    newAplicante:async(req,res)=>{
        try {
            const {idJob,idEmployee,sendJob}=req.body;
        const aplicants =await Aplicants.findOne({idJobs:idJob}).lean();
            let bandPost=false;
        if(!aplicants){
            let data={
                error:"Trabajo no encontrado"
              }
            res.send(data)
        }else{
            aplicants.idsEmployee.forEach(idEmp => {
  
                if(idEmp===idEmployee)
                bandPost=true
            });

            if(bandPost){
                let data={
                    error:"Ya te has Postulado"
                  }
                res.send(data)
            }else{
                const job=await Jobs.findById(idJob);
                const currentDate = new Date();
                const formattedDate = currentDate.toISOString();
                const  headers={
                    tabla:"Aplicant",
                    peticion:"Edit",
                    'x-match':'all'
                    };
                    const _id=aplicants._id;
                    let Employee={
                        idEmployee:idEmployee,
                        status:"Recibido",
                        fecha:formattedDate
                    }
                    Publish(headers,{
                        _id,
                        Employee
                    });
                    const  headers1={
                        tabla:"UserEmployee",
                        peticion:"AddPostulation",
                        'x-match':'all'
                        };
                        
                        let idJobs={
                            idJob:idJob,
                            status:"Enviado",
                            fecha:formattedDate
                        }
                        
                        Publish(headers1,{
                            idEmployee,
                            idJobs,
                            job:JSON.parse(sendJob)
                        });
                        const  headers2={
                            tabla:"UserCompany",
                            peticion:"AddNotifyC",
                            'x-match':'all'
                            };
                            Publish(headers2,{
                                _id:job.idUserCompany,
                                notification:"Se postulo alguien nuevo"
                            }); 
                        let data={
                            ok:"Postulado Correctamente"
                        }
                res.send(data);

            }

        }
        } catch (error) {
            console.error(error);
        }
        
    },
    
    deleteAplicante:async(req,res)=>{
        const {idJob,idEmployee}=req.body;
        const  headers={
            tabla:"Aplicant",
            peticion:"DeleteEmployee",
            'x-match':'all'
            };
            Publish(headers,{
                idJob,
                idEmployee
            });
        res.send("OK")
    },

    showAplicants:async(req,res)=>{
        // if (mongoose.isValidObjectId(req.params.id)) {
        //     try {
        //       const aplicants = await Aplicants.findOne({ idJobs: req.params.id }).lean();
          
        //       if (!aplicants || aplicants.idsEmployee.length === 0) {
        //         const data = {
        //           error: "No hay aplicantes",
        //         };
        //         return res.send(data);
        //       }
          
        //       // Obtén todos los aplicantes en una sola consulta
        //       const aplicantesIds = aplicants.idsEmployee;
        //       const aplicantes = await UserEmployee.find({ _id: { $in: aplicantesIds } }).lean();
          
        //       res.json(aplicantes);
        //     } catch (error) {
        //       console.error(error);
        //     }
        //   }
        if (mongoose.isValidObjectId(req.params.id)) {
            try {
              const aplicants = await Aplicants.findOne({ idJobs: req.params.id }).lean();
          
              if (!aplicants || aplicants.idsEmployee.length === 0) {
                const data = {
                  error: "No hay aplicantes",
                };
                return res.send(data);
              }
          
              // Obtén todos los aplicantes en una sola consulta
              const aplicantesIds = aplicants.idsEmployee.map((aplicante) => aplicante.idEmployee);
              const aplicantes = await UserEmployee.find({ _id: { $in: aplicantesIds } }).lean();
          
              // Agregar los campos de status y fecha a los detalles del empleado
              const aplicantesConDetalles = aplicantes.map((empleado) => {
                empleado.photo = empleado.photo.toString("base64");
                empleado.CV = empleado.CV.buffer.toString("base64");
                const detalle = aplicants.idsEmployee.find((aplicante) => aplicante.idEmployee === empleado._id.toString());
                return {
                  ...empleado,
                  status: detalle.status,
                  fecha: detalle.fecha,
                };
              });
         
          
              res.json(aplicantesConDetalles);
            } catch (error) {
              console.error(error);
            }
          }

    }
}