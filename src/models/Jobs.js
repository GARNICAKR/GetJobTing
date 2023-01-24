const mongoose=require("mongoose");
const {Schema}=mongoose;
const JobsSchema=new Schema({
    title: {type: String,required:true},
    about_job: {type: String,required:true},
    pay: {type: Number,required:true},
    location:{type:Array,required:true},
    perfil_employer:{type:mongoose.Types.ObjectId,required:true},
    vacancies:{type:Number,required:true},
},{timestamps:true});
module.exports=mongoose.model('Jobs',JobsSchema);