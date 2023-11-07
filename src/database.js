const mongose =require('mongoose');
//require('dotenv').config();
//mongose.connect('mongodb://localhost/GetJobTing')
function Conecetar(){
    try {
        mongose.connect(process.env.MONGODB_URL)
    .then(db=> console.log('DB is conected'))  
    .catch(err=>console.error(err));
    } catch (error) {
        Conecetar();
    }
}
Conecetar();