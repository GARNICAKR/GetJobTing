const Aplicants=require("../models/Aplicants");
const Jobs = require("../models/Jobs");
const UserEmployee = require("../models/UsersEmployee");
const { Publish } = require("../helpers/rabbitMQ");
module.exports={
    newAplicante:async(req,res)=>{
        try {
            const {idJob,idEmployee}=req.body;
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

                const  headers={
                    tabla:"Aplicant",
                    peticion:"Edit",
                    'x-match':'all'
                    };
                    const _id=aplicants._id;

                    Publish(headers,{
                        _id,
                        idEmployee
                    });
                    const  headers1={
                        tabla:"UserEmployee",
                        peticion:"AddPostulation",
                        'x-match':'all'
                        };
                        const currentDate = new Date();
                        const formattedDate = currentDate.toISOString();
                        let idJobs={
                            idJob:idJob,
                            status:"Enviado",
                            fecha:formattedDate
                        }
                        
                        Publish(headers1,{
                            idEmployee,
                            idJobs
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
        const aplicants=await Aplicants.findOne({idJobs:req.params.id}).lean();
        let aplicantes=[]
        if(aplicants.idsEmployee.length==0){
            let data={
                error:"No hay aplicantes"
              }
          res.send(data);                
        }else{
            for (let i = 0; i < aplicants.idsEmployee.length; i++) {
                let user = aplicants.idsEmployee[i];
                let aplicante = await UserEmployee.findById(user);
                aplicantes.push(aplicante);
              }
              res.json(aplicantes);
        }

    }
}