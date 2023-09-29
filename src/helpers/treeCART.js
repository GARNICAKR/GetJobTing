const UserEmployee = require("../models/UsersEmployee");
const Jobs = require("../models/Jobs");
const User = require("../models/Users");
const dataJobs = require('./data.json');
const fs = require('fs');
//const { OneHotEncoder } = require('one-hot-encoder');
let treeCART={}

treeCART.MakeDecision= async (id)=>{

let employee = await UserEmployee.findById(id);
let jobs = await Jobs.find().populate({ path: "idUserCompany", select: "nameCompany logo description" }).lean();

//sector y skills trabajo
let datajobsFilter = jobs.map((job)=>{
  let skillsP = cleanArray([job.about_job[0].conocimientos]);
  let sector = cleanArray(eliminarStopWordsEnArreglo([job.about_job[0].sector]));
  let description = cleanArray(eliminarStopWordsEnArreglo([job.about_job[0].description])).concat(sector);
  let palabrasReq = cleanArray(eliminarStopWordsEnArreglo([job.about_job[0].requisitos])).concat(description);
  let palabrasSkills = eliminarStopWordsEnArreglo(skillsP).concat(palabrasReq);
  return {
    sector: job.about_job[0].sector,
    skills:  eliminarStopWordsEnArreglo(skillsP),
    palabrasClave : cleanArray(eliminarStopWordsEnArreglo([job.about_job[0].responsabilidades])).concat(palabrasSkills)
  };
})
// console.log(datajobsFilter)

//sector skills perfil
let skillsEmployee = cleanArray(employee.skills)
let sector = cleanArray(eliminarStopWordsEnArreglo([employee.sector]))
let palabrasClave = eliminarStopWordsEnArreglo(skillsEmployee).concat(sector)
let dataEmployeeFilter = {
  sector: employee.sector,
  skills: eliminarStopWordsEnArreglo(skillsEmployee),
  palabrasClave: palabrasClave,
  intereses: []
}
// console.log(dataEmployeeFilter)
// console.log(employee.intereses)
//intereses es un array de objetos que contienen los datos de los empleos pasados

// employee.intereses.forEach((job)=>{
//   let title = cleanArray(eliminarStopWordsEnArreglo([job.title]))
//   let conocimientos = cleanArray(eliminarStopWordsEnArreglo([job.conocimientos])).concat(title)
//   dataEmployeeFilter.intereses = dataEmployeeFilter.intereses.concat(conocimientos)
// })
let dataMatch = datajobsFilter.map((job)=>{
  var matchPC;
  if(job.palabrasClave.length>20){
   matchPC = contarPalabrasIguales(dataEmployeeFilter.palabrasClave,job.palabrasClave) / job.palabrasClave.length;
  }else{
    matchPC = contarPalabrasIguales(dataEmployeeFilter.palabrasClave,job.palabrasClave) / 30;
  }
  let matchSkills = contarPalabrasIguales(dataEmployeeFilter.skills,job.skills) / job.skills.length;
  let matchSector = cleanArray([dataEmployeeFilter.sector])==cleanArray([job.sector]);
  if(matchPC>0.05 && matchSector){

    matchPC = matchPC + .25;
  }
  if(matchPC>0.075 && matchSkills>.19){
    matchPC = matchPC + .25;
  }
  return {
    match: matchPC,
    sector: job.sector,
  }
})
// console.log(dataMatch)
// const jsonString = JSON.stringify(dataMatch);
// fs.writeFileSync('archivoComunicacionMedios', jsonString);

let ids = [];
let scatterplot = jobs.filter((job,index)=>{
  if(numToCategory(job.about_job[0].sector)>=5){
    if(numToCategory(job.about_job[0].sector)>7){
      if(numToCategory(job.about_job[0].sector)==9){//==9
        if(dataMatch[index].match>.1){
          ids.push(index);
          return job
        }else{
          return
        }
      }else{//==8
        if(dataMatch[index].match>.1){
          ids.push(index);
          return job
        }else{
          return
        }
      }
    }else{
      if(numToCategory(job.about_job[0].sector)==7){//==7
        if(dataMatch[index].match>.1){
          ids.push(index);
          return job
        }else{
          return
        }
      }else{
        if(numToCategory(job.about_job[0].sector)==6){//==6
          if(dataMatch[index].match>.1){
            ids.push(index);
            return job
          }else{
            return
          }
        }else{//5
          if(dataMatch[index].match>.1){
            ids.push(index);
            return job
          }else{
            return
          }
        }
      }
    }
  }else{//menor a 5
    if(numToCategory(job.about_job[0].sector)<=2){//menor a 2
      if(numToCategory(job.about_job[0].sector)==0){//==0
        if(dataMatch[index].match>.1){
          ids.push(index);
          return job
        }else{
          return
        }
      }else{
        if(numToCategory(job.about_job[0].sector)==1){//==1
          if(dataMatch[index].match>.1){
            ids.push(index);
            return job
          }else{
            return
          }
        }else{//==2
          if(dataMatch[index].match>.1){
            ids.push(index);
            return job
          }else{
            return
          }
        }
      }
    }else{//mayor a 2
      if(numToCategory(job.about_job[0].sector)==3){//==3
        if(dataMatch[index].match>.1){
          ids.push(index);
          return job
        }else{
          return
        }
      }else{//==4
        if(dataMatch[index].match>.1){
          ids.push(index);
          return job
        }else{
          return
        }
      }
    }
  }
})
// console.log(scatterplot);
let jobsProb = [];
if(scatterplot.length<6){
  console.log(scatterplot.length)
  jobs.forEach((job,index)=>{
    if(cleanArray([job.about_job[0].sector])[0]==cleanArray([dataEmployeeFilter.sector])[0]){
      let band = false;
      ids.forEach((id)=>{
        if(id == index){
          band = true;
        }
      })
      if(band == false){        
        jobsProb.push(job);
      }
    }
  });

  for(let i=0; i<jobsProb.length;i++){
    if(scatterplot.length<8){
      scatterplot.push(jobsProb[i])
    }
  }

}




scatterplot.forEach((job) => {
if (!checkID(job.idUserCompany._id)) {

  job.idUserCompany.logo =
    job.idUserCompany.logo.buffer.toString("base64");
}
});

return scatterplot;
}
module.exports = treeCART;

function cleanArray(array){//limpia un array de palabras con acentos, comas, etc
//elimina elementos vacios 
array = array.filter(skill => skill.trim() !== "")
array = array.map(skill => {
 // Eliminar espacios en blanco al inicio y al final
 skill = skill.trim();

 // Convertir a minúsculas
 skill = skill.toLowerCase();
 //Quita acentos
 skill = skill.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
 // Eliminar caracteres especiales

 skill = skill.replace(/[^a-z0-9 ]/g, "");
 skill = skill.trim();
 return skill;
});


return array;
}

function eliminarStopWordsEnArreglo(arreglo) {//retona arreglo de palabras individuales sin palabras conectores o inecesarias
  // Lista de palabras basura (stop words)
  const stopWords = ['al', 'tus','(a', 'a', 'i', 'e' ,'el', 'la','eres','tienes','traves', 'tiene','tienen', 'soy','nuestro','tuyo','mio', 'de', 'los','traves', 'las', 'y', 'en', 'con', 'por', 'para', 'o', 'u', 'del', 'te' ,'si', 'como', 'un'];

  // Función para eliminar palabras basura de una cadena
  function eliminarStopWordsDeCadena(cadena) {
    const palabras = cadena.split(' ');
    const palabrasFiltradas = palabras.filter(palabra => !stopWords.includes(palabra.toLowerCase()));
    return palabrasFiltradas;
  }

  // Aplicar la función a cada cadena en el arreglo y convertirlas en un solo arreglo
  const resultado = arreglo.flatMap(cadena => eliminarStopWordsDeCadena(cadena));

  return resultado;
}

function contarPalabrasIguales(arreglo1, arreglo2) {//comprueba 2 arreglo y retorna la cantidad de veces que palabras en el arreglo hicieron match
  let count = 0;

  // Recorre el primer arreglo
  for (const palabra1 of arreglo1) {
    // Verifica si la palabra está en el segundo arreglo
    if (arreglo2.includes(palabra1)) {
      count++;
    }
  }

  return count;
}

function numToCategory(categoria){
  let categories = ['Salud', 'Economia y Finanzas', 'Tecnologia e Informatica', 'Educacion', 'Ingenieria', 'Arte y Cultura', 'Servicios al Cliente', 'Construccion y Oficios', 'Ciencias Naturales', 'Comunicacion y Medios'];
  const indice = categories.indexOf(categoria);
  if (indice !== -1) {
    return indice;
  } else {
    return 'La categoría no se encontró en la lista.';
  }
}
let idCompanies = [];
function checkID(_id) {
  let band = false;
  idCompanies.forEach((id) => {
    if (id === _id) {
      band = true;
      return;
    }
  });

  if (band == true) {
    return band;
  }
  idCompanies.push(_id);

  return false;
}
