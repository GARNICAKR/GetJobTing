const User=require("../models/Users");
let Validations={}
Validations.emptydatas=(body)=>{
    let band=true;
    body.forEach(element => {
        if(!element){
            band=false
        }
    });
   return band;
}
Validations.userValidation=async(mail,password,type_user)=>{
    let band=false;
    const dataValid=[mail,password];
    if(type_user=="Seleccione un Usuario"){
        band="Selecione un tipo de Cuenta";
    }else if(!Validations.emptydatas(dataValid)){
       band="No deje Espacios en blanco";
    }else if(await User.findOne({mail})){
        
        band='El Correo ya Existe';
      }else if(password.length<8){
        band='La contraseña debe tener mas de 8 caracteres';
      }
      return band;
};
module.exports=Validations;