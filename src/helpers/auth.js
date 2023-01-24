const helpers={};
const multer  = require('multer');
//La funcion de abajo permite bloqueras las vistas 
//a usuario no autorizados
helpers.isAuthenticated=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error_msg', 'Not Autorized');
        res.redirect('/signin')
    }
};
helpers.Upload=()=>{
    const storage=multer.diskStorage({
        destination:function(req,file,cb){
               cb(null,'uploads');
           },
           filename:function(req,file,cb){
               cb(null,file.originalname)
           }
       })
     return multer({storage})
};
module.exports=helpers;
