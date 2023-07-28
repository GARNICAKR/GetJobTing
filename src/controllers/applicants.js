const Aplicants=require("../models/Aplicants");
const Jobs = require("../models/Jobs");
const UserEmployee = require("../models/UsersEmployee");
const { Publish } = require("../helpers/rabbitMQ");
module.exports={
    newAplicante:async(req,res)=>{
        const {idJob,idEmployee}=req.body;
        const aplicants =await Aplicants.findOne({idJobs:idJob})
        if(!aplicants){
            res.send("ERROR")
        }else{
            const employee = await UserEmployee.findOne({
                _id: idEmployee,
                postulations: { $elemMatch: { $eq: idJob } }
              });
            if(employee){
                //Encontrar una manera de manejar errores
                res.send("ERROR")
            }else{
                const  headers={
                    tabla:"Aplicant",
                    peticion:"Edit",
                    'x-match':'all'
                    };
                    const _id=aplicants._id;
                    let idsEmployee={
                        idEmployee,
                        status:"Enviado"
                    }
                    Publish(headers,{
                        _id,
                        idsEmployee
                    });
                    const  headers1={
                        tabla:"UserEmployee",
                        peticion:"AddPostulation",
                        'x-match':'all'
                        };
                        Publish(headers1,{
                            idEmployee,
                            idJob
                        });
                res.send("OK");

            }

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
    changeStatus:async(req,res)=>{
        const {idJob,idEmployee,status}=req.body;
        const  headers={
            tabla:"Aplicant",
            peticion:"EditStatus",
            'x-match':'all'
            };
            Publish(headers,{
                idJob,
                idEmployee,
                status
            });
        res.send("OK")
    },
    showAplicants:async(req,res)=>{
        const aplicants=await Aplicants.findOne({idJobs:req.params.id});
        let aplicantes=[]
        if(!aplicants.idsEmployee){
          res.send("err")                
        }
        for (let i = 0; i < aplicants.idsEmployee.length; i++) {
          let user = aplicants.idsEmployee[i];
          let aplicante = await UserEmployee.findById(user);
          aplicantes.push(aplicante);
        }
        res.json(aplicantes);
    }
}