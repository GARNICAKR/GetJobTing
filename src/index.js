const express=require("express");
const path=require("path")
const exphbs=require("express-handlebars");
const methodOverride=require('method-override');
const session=require('express-session');
const passport =require('passport');
const flash=require('connect-flash');
//Paquetes a Instalar
// npm i express express-handlebars express-session method-override moongose nodemon bcryptjs passport passport-local connect-flash
//#region Initializations
const app=express();
require('./database');
require('./config/passport');
//#endregion

//#region  Settings

app.set('port',process.env.PORT||3000);
app.set('views',path.join(__dirname,'views'));
app.engine('hbs',exphbs.engine({
    defaultLayout:'main',
    layoutsDir:path.join(app.get("views"),'layaouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    runtimeOptions:{
        allowProtoPropertiesByDefault:true
    },
    extname:'.hbs'
}));
app.set('view engine','.hbs');
//#endregion

//#region Middelawres
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
    secret:'PlantillaSecret',
    resave:true,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//#endregion
//#region Global Variables
app.use((req,res,next)=>{
    res.locals.success_msg =req.flash('success_msg');
    res.locals.error_msg =req.flash('error_msg');
    res.locals.error =req.flash('error');
    res.locals.user=req.user||null;
    next();
});
//#endregion

//#region Routes
app.use(require('./routes/index'));
app.use(require('./routes/userEmployee'));
//#endregion


//#region Static Files 
app.use(express.static(path.join(__dirname,'public')));
//#endregion
//#region Server is Listenning 
app.listen(app.get('port'),()=>{
    console.log('Server on port ',app.get('port'));
});
//#endregion