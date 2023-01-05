const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');
const {Schema}=mongoose;
const UserSchema=new Schema({
    mail: {type: String,required:true},
    password: {type: String,required:true},
    type_user: {type: String,required:true},

});
UserSchema.methods.encryptPassword = async(password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};
module.exports=mongoose.model('users',UserSchema);