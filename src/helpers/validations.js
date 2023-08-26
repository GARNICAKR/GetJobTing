const User = require("../models/Users");
const fs = require("fs");
let Validations = {};
Validations.emptydatas = (body) => {
  let band = true;
  body.forEach((element) => {
    if (!element) {
      band = false;
    }
  });
  return band;
};
Validations.userValidation = async (mail, password, type_user) => {
  let band = false;
  const dataValid = [mail, password];
  if (type_user == "Seleccione un Usuario") {
    band = "Selecione un tipo de Cuenta";
  } else if (!Validations.emptydatas(dataValid)) {
    band = "No deje Espacios en blanco";
  } else if (await User.findOne({ mail })) {
    band = "El Correo ya Existe";
  } else if (password.length < 8) {
    band = "La contraseña debe tener mas de 8 caracteres";
  }
  return band;
};
Validations.files = (files, type) => {
  const maxSize = 1024 * 1024;
  if (type === "photo") {
    if (files.mimetype.split("/")[0] != "image") {
        fs.unlinkSync(`uploads/${files.filename}`);  
      return("No es una imagen");
    } else if (files.size > maxSize) {
        fs.unlinkSync(`uploads/${files.filename}`); 
      return("La imagen es muy grande");
    } 
  } else {
    if (files.mimetype != "application/pdf") {
        fs.unlinkSync(`uploads/${files.filename}`); 
      return "Tiene que ser PDF";
    } else if (files.size > maxSize) {
        fs.unlinkSync(`uploads/${files.filename}`); 
      return "El pdf es muy grande";
    } 
  }
  return false;
};
module.exports = Validations;
