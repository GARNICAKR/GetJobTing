const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserCompanySchema = new Schema({
    idUser: { type: Schema.ObjectId, ref: "users" },
    nameCompany: { type: String, required: true },
    description: { type: String, required: true },
    rfc: { type: String, required: true },
    sat: { type: String, required: true },
    location: { type: Object, required: true },
    logo: { type: Buffer, required: false },
    notifications:{type:Array,required:false},
});
module.exports = mongoose.model('usersCompany', UserCompanySchema);