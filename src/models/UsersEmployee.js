const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserEmployeeSchema = new Schema({
    idUser: { type: Schema.ObjectId, ref: "users" },
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    location: { type: Object, required: true },
    postulations: { type: Array, required: true },
    university:{type:String,required:false},
    carrera:{type:String,required:false},
    intereses:{type:Array,required:false},
    introduction :{type:String,required:false},
    notifications:{type:Array,required:false},
    skills:{type:Array,required:false},
    ///certificates:{type:String,required:true},
    ///keys:{type:String,required:true},
    CV: { type: Buffer, required: false },
    photo: { type: Buffer, required: false },
});
module.exports = mongoose.model('usersEmployee', UserEmployeeSchema);