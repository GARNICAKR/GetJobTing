const mongose =require('mongoose');
mongose.connect('mongodb://localhost/GetJobTing')
    .then(db=> console.log('DB is conected'))  
    .catch(err=>console.error(err));