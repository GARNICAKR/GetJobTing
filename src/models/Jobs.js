const mongoose=require("mongoose");
const {Schema}=mongoose;
const JobsSchema=new Schema({
    idUserCompany: { type: Schema.ObjectId, ref: "usersCompany" },
    title: {type: String,required:true},
    about_job: {type: Array,required:true},
    pay: {type: Number,required:true},
    vacancies:{type:Number,required:true},
    location: { type: Object, required: true },
},{timestamps:true});
module.exports=mongoose.model('Jobs',JobsSchema);