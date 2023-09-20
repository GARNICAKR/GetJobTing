const DataFrame = require('dataframe-js').DataFrame;
const UserEmployee = require("../models/UsersEmployee");
const { DecisionTreeClassifier } = require('ml-cart');
const User = require("../models/Users");
//const { OneHotEncoder } = require('one-hot-encoder');
let treeCART={}

treeCART.MakeDecision= async ()=>{
  

//   let data = [[0, 0], [0, 1], [1, 0], [1, 1]]; // Tus vectores de características
// let predictions = [0, 1, 1, 0]; // Las etiquetas de tus datos

// let classifier = new DecisionTreeClassifier();
// classifier.train(data, predictions);

// let prediction = classifier.predict([0, 0]);

  let employee = await UserEmployee.findOne();
  conocimientosSalud="Consulta de primer nivel, atención al cliente, excelente actitud de servicio.";
  let cleanConocimientosInteres=[]
  let conocimientos=[]
  let cleanJobInteres=[]
  let sectorInteres=[]
  employee.intereses.forEach((interes) => {
    cleanConocimientosInteres=cleanConocimientosInteres.concat(interes.conocimientos.split(/[,\n]+/));
    cleanJobInteres.push(interes.title);
    sectorInteres.push(interes.sector);
});
cleanConocimientosInteres=cleanArray(cleanConocimientosInteres)
cleanJobInteres=cleanArray(cleanJobInteres)
conocimientos=cleanArray(employee.skills)
cleanConocimientosInteres=cleanConocimientosInteres.concat(conocimientos)
cleanConocimientosInteres=new Set(cleanConocimientosInteres);
cleanConocimientosInteres=[...cleanConocimientosInteres]

console.log(cleanConocimientosInteres);
console.log(cleanJobInteres);
console.log(conocimientos);

  //console.log(employee.intereses[0].conocimientos);
  let categories = ['Salud', 'Economía y Finanzas', 'Tecnología e Informática', 'Educación', 'Ingeniería', 'Arte y Cultura', 'Servicios al Cliente', 'Construcción y Oficios', 'Ciencias Naturales', 'Comunicación y Medios'];


  // Crear un objeto para almacenar las categorías codificadas64f7f3cf6d8f594f8a80ec42
  let encodedCategories = {};
  
  // Para cada categoría, crear un nuevo array con una longitud igual a la cantidad de categorías
  for (let i = 0; i < categories.length; i++) {
      let category = categories[i];
  
      // Crear un nuevo array on todos los valores establecidos en 0
      let encodedCategory = Array(categories.length).fill(0);
  
      // Establecer el valor en el índice actual en 1
      encodedCategory[i] = 1;
  
      // Agregar la categoría codificada al objeto
      encodedCategories[category] = encodedCategory;
  }
  
  //console.log(encodedCategories);
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
