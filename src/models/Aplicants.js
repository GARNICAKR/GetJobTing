const mongoose = require('mongoose');
const {Schema}=mongoose;
const AplicantsSchema=new Schema({
    idJobs: { type: Schema.ObjectId, ref: "Jobs" },
    idsEmployee: { type: Array, required: true },
});
module.exports=mongoose.model('aplicants',AplicantsSchema);