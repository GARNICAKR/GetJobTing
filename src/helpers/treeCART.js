const UserEmployee = require("../models/UsersEmployee");
const Jobs = require("../models/Jobs");
const User = require("../models/Users");
const dataJobs = require('./data.json');
const fs = require('fs');
//const { OneHotEncoder } = require('one-hot-encoder');
let treeCART={}

treeCART.MakeDecision= async ()=>{

let employee = await UserEmployee.findOne();
let jobs = await Jobs.find().lean();
let categories = ['Salud', 'Economia y Finanzas', 'Tecnologia e Informatica', 'Educacion', 'Ingenieria', 'Arte y Cultura', 'Servicios al Cliente', 'Construccion y Oficios', 'Ciencias Naturales', 'Comunicacion y Medios'];

//sector y skills trabajo
let datajobsFilter = dataJobs.map((job)=>{
  let skillsP = cleanArray(job.conocimientos);
  let sector = cleanArray(eliminarStopWordsEnArreglo([job.sector]))
  let description = cleanArray(eliminarStopWordsEnArreglo([job.description])).concat(sector)
  let palabrasReq = cleanArray(eliminarStopWordsEnArreglo([job.requisitos])).concat(description)
  let palabrasSkills = eliminarStopWordsEnArreglo(skillsP).concat(palabrasReq);
  return {
    sector: job.sector,
    skills:  skillsP,
    palabrasClave : cleanArray(eliminarStopWordsEnArreglo([job.responsabilidades])).concat(palabrasSkills)
  };
})
// console.log(datajobsFilter)

//sector skills perfil
let skillsEmployee = cleanArray(employee.skills)
let sector = cleanArray(eliminarStopWordsEnArreglo([employee.sector]))
let palabrasClave = eliminarStopWordsEnArreglo(skillsEmployee).concat(sector)
let dataEmployeeFilter = {
  sector: employee.sector,
  skills: skillsEmployee,
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
console.log(dataEmployeeFilter)
let archivoJson = datajobsFilter.map((job)=>{

  let match = contarPalabrasIguales(dataEmployeeFilter.palabrasClave,job.palabrasClave)
  return {
    match: match,
    sector: job.sector
  }
})
const jsonString = JSON.stringify(archivoJson);
// fs.writeFileSync('archivoSalud', jsonString);

}
module.exports = treeCART;

function cleanArray(array){
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

function eliminarStopWordsEnArreglo(arreglo) {
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

function contarPalabrasIguales(arreglo1, arreglo2) {
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

