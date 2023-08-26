const mongoose = require('mongoose');
const {Schema}=mongoose;
const LocationSchema=new Schema({
    country: {type: String,required:true},
    state: {type: String,required:true},
    cities:{type: Array,required:true}
});
module.exports=mongoose.model('location',LocationSchema);