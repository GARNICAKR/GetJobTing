const UserEmployee = require("../models/UsersEmployee");
const UserCompany = require("../models/userCompany");
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
    id: job._id,
    sector: job.about_job[0].sector,
    skills:  eliminarPalabrasIguales(eliminarStopWordsEnArreglo(skillsP)),
    palabrasClave : eliminarPalabrasIguales(cleanArray(eliminarStopWordsEnArreglo([job.about_job[0].responsabilidades])).concat(palabrasSkills)),
    title: eliminarPalabrasIguales(cleanArray(eliminarStopWordsEnArreglo([job.title])))
  };
})
// console.log(datajobsFilter)

//sector skills perfil
let skillsEmployee = cleanArray(employee.skills)
let sector = cleanArray(eliminarStopWordsEnArreglo([employee.sector]))
let palabrasClave = eliminarStopWordsEnArreglo(skillsEmployee).concat(sector)
let dataEmployeeFilter = {
  sector: employee.sector,
  skills: eliminarPalabrasIguales(eliminarStopWordsEnArreglo(skillsEmployee)),
  palabrasClave: eliminarPalabrasIguales(palabrasClave),
  intereses: []
}

//intereses es un array de objetos que contienen los datos de los empleos pasados
employee.intereses.forEach((intereses)=>{
  let title = cleanArray(eliminarStopWordsEnArreglo([intereses.title]))
  let conocimientos = cleanArray(eliminarStopWordsEnArreglo([intereses.conocimientos])).concat(title)
  dataEmployeeFilter.intereses = eliminarPalabrasIguales(dataEmployeeFilter.intereses.concat(conocimientos))
})

// console.log(dataEmployeeFilter.intereses)
let dataMatch = datajobsFilter.map((job)=>{
  var matchPC;
  matchPC = contarPalabrasIguales(dataEmployeeFilter.palabrasClave,job.palabrasClave) / (job.palabrasClave.length-1);
  let matchSkills = contarPalabrasIguales(dataEmployeeFilter.skills,job.skills) / job.skills.length;
  let matchSector = cleanArray([dataEmployeeFilter.sector])[0]===cleanArray([dataEmployeeFilter.sector])[0];
  let matchTitle = contarPalabrasIguales(dataEmployeeFilter.palabrasClave, job.title) / job.title;
  if(dataEmployeeFilter.intereses.length>0){
    var matchIntereses = contarPalabrasIguales(dataEmployeeFilter.intereses, job.palabrasClave) / dataEmployeeFilter.intereses.length;
  }
  if(matchPC>0.05 && matchSector && matchTitle>0.2){
    matchPC = matchPC + .15;
  }
  if(matchPC>0.075 && matchSkills>.19 && matchTitle>0.2){
    matchPC = matchPC + .15;
  }
  if(matchPC>0.075 && matchSector && matchIntereses>0.2){
    matchPC = matchPC + .15;
  }
  return {
    id: job.id,
    match: matchPC,
    sector: job.sector,
  }
})
// console.log(dataMatch)
// const jsonString = JSON.stringify(dataMatch);
// fs.writeFileSync('archivoComunicacionMedios', jsonString);

let count = 0;
let scatterplot = jobs.filter((job)=>{
  if(job._id == dataMatch[count].id && dataMatch[count].match>.1){
    job.match = dataMatch[count].match; 
    count++;
    return job
    }
  count++;
})

if (scatterplot.length > 1) {//algoritmo ordenar elementos
  var orderJobs = scatterplot.slice(); // Clona el array original para no modificarlo
  orderJobs.sort((a, b) => b.match - a.match);
} else {
  orderJobs = scatterplot;
}


orderJobs.forEach((job) => {
if (!checkID(job.idUserCompany._id)) {

  job.idUserCompany.logo =
    job.idUserCompany.logo.buffer.toString("base64");
}
});

return orderJobs; 
}

treeCART.MakeDecisionJob= async (id)=>{
  let job = await Jobs.findById(id); 
  let sector = job.about_job[0].sector;
  let skills = cleanArray(eliminarStopWordsEnArreglo([job.about_job[0].conocimientos]));
  let title = cleanArray(eliminarStopWordsEnArreglo([job.title]));
  const keywords = eliminarPalabrasIguales(skills.concat(title));

  let employees = await UserEmployee.find().lean();

  let dataEmployees = employees.map(employee => {
    return{
      id: employee._id ,
      skills: eliminarPalabrasIguales(eliminarStopWordsEnArreglo(cleanArray(employee.skills))),
      sector: employee.sector,
      name: employee.name + ' ' + employee.last_name,
      intereses: employee.intereses,
    }
  });
  //algoritmo match
  let dataMatch = dataEmployees.map((employee)=>{
    var matchPC;
    matchPC = contarPalabrasIguales(employee.skills, keywords) / (keywords.length-1);
    let matchSector = cleanArray([sector])[0]===cleanArray([employee.sector])[0];
    let matchTitle = contarPalabrasIguales(title, employee.skills) / title.length;
    if(matchSector && matchPC>.2){
      console.log(1)
      if(matchPC<.7){
        matchPC = matchPC + .17;
      }
    }   
    return {
      id: employee.id,
      match: matchPC,
      sector: employee.sector,
      name: employee.name,
      matchTitle: matchTitle
    }
  })

  const filteredEmployees = dataMatch.filter(employee => employee.match > 0.2);

  if (filteredEmployees.length > 1) {
    var orderJobs = filteredEmployees.slice(); // Clona el array original para no modificarlo
    orderJobs.sort((a, b) => b.match - a.match);
  } else {
    orderJobs = filteredEmployees;
  }

  let employeeComplete = [];

  orderJobs.forEach((employee)=>{
    employees.forEach((user)=>{
      if(user._id==employee.id){
        user.match = employee.match;
        employeeComplete.push(user);
      }
    })
  })

  const aplicantesConDetalles = employeeComplete.map((empleado) => {
    empleado.photo = empleado.photo.toString("base64");
    empleado.CV = empleado.CV.buffer.toString("base64");
    return {
      ...empleado
    };
  });

  return aplicantesConDetalles
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
  const stopWords = ['al', 'tus','(a', 'a', 'i', 'e' ,'el', 'la','eres','tienes','traves', 'tiene','tienen', 'soy','nuestro','tuyo','mio', 'de', 'los','traves', 'las', 'y', 'en', 'con', 'por', 'para', 'o', 'u', 'del', 'te' ,'si', 'como', 'un','estar' ];

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

function eliminarPalabrasIguales(array){
  const conjuntoPalabras = new Set(array);
  return Array.from(conjuntoPalabras);
}
