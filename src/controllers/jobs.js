const Jobs=require("../models/Jobs");
const {emptydatas}=require('../helpers/validations');
module.exports={
    Fcreate:(req,res)=>{
        res.render("jobs/Fcreate");
    },
    create:async(req,res)=>{
        const{title,about_job,pay,location,perfil_employer,vacancies}=req.body;
        const newJob=new Jobs({title,about_job,pay,location,perfil_employer,vacancies});
        const datasValid=[title,about_job,pay,location,perfil_employer,vacancies]
          if(!emptydatas(datasValid)){
            req.flash("error_msg","No deje espacios vacios")
            res.render("jobs/Fcreate",{newJob});
          }else{
        
        await newJob.save();
        res.send("OK");
       }
    },
    Fedit:async(req,res)=>{
        const job=await Jobs.findById(req.params.id);
        res.render("jobs/fedit.hbs",{job});
    },
    edit:async(req,res)=>{
        const  {_id,title,about_job,pay,location,perfil_employer,vacancies}=req.body;
        const updatingJob= new Jobs({_id,title,about_job,location,perfil_employer,vacancies})
        const datasValid=[title,about_job,pay,location,perfil_employer,vacancies]
        if(!emptydatas(datasValid)){
          req.flash("error_msg","No deje espacios vacios")
          res.render("/jobs/fedit.hbs",{updatingJob});
        }else{
            await Task.findByIdAndUpdate(_id, { title, about_job, pay,location,perfil_employer,vacancies});
            res.send("OK");
            }
       
    },
    delete:async(req,res)=>{
        await User.findByIdAndDelete(req.params.id);
        res.send("OK");
    }

}