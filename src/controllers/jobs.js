const Jobs = require("../models/Jobs");
const Aplicants = require("../models/Aplicants");
const { emptydatas } = require("../helpers/validations");
const { Publish } = require("../helpers/rabbitMQ");
module.exports = {
  Fcreate: (req, res) => {
    res.render("jobs/Fcreate");
  },
  create: async (req, res) => {
    const {
      idUserCompany,
      title,
      description,
      sector,
      schedule,
      modality,
      pay,
      conocimientos,
      requisitos,
      responsabilidades,
      vacancies,
    } = req.body;

    const datasValid = [
      idUserCompany,
      title,
      description,
      sector,
      schedule,
      modality,
      pay,
      conocimientos,
      requisitos,
      responsabilidades,
      vacancies,
    ];
    if (!emptydatas(datasValid)) {
      req.flash("error_msg", "No deje espacios vacios");
      res.send("ERROR");
    } else {
      const about_job = {
        description: description,
        sector: sector,
        schedule: schedule,
        modality: modality,
        conocimientos: conocimientos,
        requisitos: requisitos,
        responsabilidades: responsabilidades,
      };
      const  headers={
        tabla:"Jobs",
        peticion:"New",
        'x-match':'all'
      };
      Publish(headers,{
        idUserCompany,
        title,
        about_job,
        pay,
        vacancies,
      });
      

      res.send("OK");
    }
  },
  Fedit: async (req, res) => {
    let job;
    try {
     job = await Jobs.findById(req.params.id);
     
    } catch (error) {
      console.error(error);
    }
    res.render("jobs/fedit.hbs", { job });
  },
  edit: async (req, res) => {
    const _id=req.params.id;
    const {
      title,
      description,
      sector,
      schedule,
      modality,
      pay,
      conocimientos,
      requisitos,
      responsabilidades,
      vacancies,
    } = req.body;
    const datasValid = [
      title,
      description,
      sector,
      schedule,
      modality,
      pay,
      conocimientos,
      requisitos,
      responsabilidades,
      vacancies,
    ];
    if (!emptydatas(datasValid)) {
      res.send("ERROR");
    } else {
      const about_job = { 
        description: description,
        sector: sector,
        schedule: schedule,
        modality: modality,
        conocimientos: conocimientos,
        requisitos: requisitos,
        responsabilidades: responsabilidades,
      };
      const  headers={
        tabla:"Jobs",
        peticion:"Edit",
        'x-match':'all'
      };
      Publish(headers,{
        _id,
        job:{ 
          title,
          about_job,
          pay,
          vacancies,
        }

      });
      
      
      res.send("OK");
    }
  },
  delete: async (req, res) => {
    const  headers={
      tabla:"Jobs",
      peticion:"Delete",
      'x-match':'all'
    };
    Publish(headers,{
      _id:req.params.id
    });
    const aplicants = await Aplicants.findOne({ idJobs: req.params.id });
    const  headers1={
      tabla:"Aplicant",
      peticion:"Delete",
      'x-match':'all'
    };
    let idAplicants=aplicants._id;
    Publish(headers1,{
      _id:idAplicants
    });
    res.send("OK");
  },
  showJobs: async (req, res) => {
    try {
      const jobs = await Jobs.find().lean();
      res.json(jobs);
    } catch (error) {
      console.log(error);
    }
  },
  searchJobs: async (req, res) => {
    const { busqueda } = req.body;
    const jobs = await Jobs.find().lean();
    let filterjobs = jobs.filter(
      (job) => job.title.toLowerCase() == busqueda.toLowerCase()
    );
    res.json(filterjobs);
  },
  pruebaRabbit:async(req,res)=>{
    const  headers={
      tabla:"Prueba",
      peticion:"Delete",
      'x-match':'all'
    };
    function sendRequests(index) {
      if (index >= 6) {
        return; // Terminar si hemos alcanzado el límite
      }
    
      sent(index).then((res) => {
        Publish(headers, {
          res
        });
    
        // Programar la siguiente petición después de 8 segundos
        setTimeout(() => {
          sendRequests(index + 1);
        }, 3000);
      });
    }
    
    function sent(i) {
      return new Promise(async (resolve, reject) => {
        try {
          resolve(i);
        } catch (error) {
          reject(error);
        }
      });
    }
    
    // Iniciar el envío progresivo de las peticiones
    sendRequests(0)
    res.send("OK")
  }
};