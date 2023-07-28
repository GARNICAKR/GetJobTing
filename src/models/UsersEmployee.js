const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserEmployeeSchema = new Schema({
    idUser: { type: Schema.ObjectId, ref: "users" },
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    location: { type: Object, required: true },
    postulations: { type: Array, required: true },
    ///area:{type:String,required:true},
    ///certificates:{type:String,required:true},
    ///keys:{type:String,required:true},
    CV: { type: Buffer, required: false },
    photo: { type: Buffer, required: false },
});
module.exports = mongoose.model('usersEmployee', UserEmployeeSchema);