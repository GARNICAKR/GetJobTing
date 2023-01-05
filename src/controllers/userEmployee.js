const multer  = require('multer');
const upload = multer({ dest: 'uploads/' })
        const storage=multer.diskStorage({
         destination:function(req,file,cb){
                cb(null,'uploads');
            },
            filename:function(req,file,cb){
                console.log("Archivo"+file);
                //console.log(req.body);
                cb(null,`${Date.now}-${file.originalname}`)
            }
        })
      
const upload=multer({storage});
exports.upload=upload.single("myFile");
/*
exports.uploadFile=(req,res)=>{
    res.send({data:'Enviar un Archivo'});
}*/

exports.vista=(req,res)=>{
    res.render('users/userEmployee');
}
  /*
module.exports={
    archivo:(req,file,cb)=>{
        console.log(file);
        console.log(req.body);
        cb(null,`${Date.now}-${file.originalname}`)
        //res.send("Ok");
    },
    
}*/