const express=require("express");
const path=require("path")
const exphbs=require("express-handlebars");
const methodOverride=require('method-override');
const session=require('express-session');
const passport =require('passport');
const flash=require('connect-flash');
const cors=require('cors');
const { Consume } = require("./helpers/rabbitMQ");
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
app.use(cors());
//#endregion
//#region Global Variables
app.use((req,res,next)=>{
    res.locals.success_msg =req.flash('success_msg');
    res.locals.error_msg =req.flash('error_msg');
    res.locals.error =req.flash('error');
    res.locals.onUser=req.user||null;
    next();
});
//#endregion

//#region Routes
app.use(require('./routes/user'));
app.use("/employee",require('./routes/userEmployee'));
app.use("/company",require("./routes/userCompany"));
app.use("/jobs",require("./routes/jobs"));
app.use("/postulaciones",require("./routes/Aplicants"));
app.use("/location",require("./routes/location"));
app.use(require('./routes/rabbitMQ'));
//#endregion


//#region Static Files 
app.use(express.static(path.join(__dirname,'public')));
//#endregion
//#region Server is Listenning 
app.listen(app.get('port'),'0.0.0.0',()=>{
    console.log('Server on port ',app.get('port'));
});
//#endregion
async function pruebaRabbitMq(wait){
    console.log("esta en Index");
    setTimeout(async() => {
        // Consume().then((result)=>{
        //     console.log("result",result);
        // })
    try {
        Consume()
        
        
    } catch (error) {
        console.log(error);
        pruebaRabbitMq(1)
    }
        
      }, 5000);
}
pruebaRabbitMq(1);