const UserEmployee=require("../models/UsersEmployee");
const fs=require("fs");

module.exports={
    archivo:async(req,res)=>{
        newUserEmployee= new UserEmployee({CV:fs.readFileSync(`uploads/${req.file.filename}`)});
        await newUserEmployee.save();
        res.send('OK');
    },
    formulario:(req,res)=>{
        res.render('users/userEmployee');
    },
    mostrar:async(req,res)=>{
        const imagenes=await UserEmployee.find();
        const String64=btoa(String.fromCharCode(...new Uint8Array(imagenes[0].CV.buffer)));
        res.render('users/PruebaImg',{String64});
    }
}