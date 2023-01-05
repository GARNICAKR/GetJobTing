const mongoose = require('mongoose');
const {Schema}=mongoose;
const UserEmployeeSchema=new Schema({
   // idUser:{type:Schema.ObjectId,ref:"users"},
    //name: {type: String,required:true},
    //last_name: {type: String,required:true},
    //phone_number: {type: String,required:true},
    CV:{type: String ,required:false},
    //location:{type:Object,required:true},
    //postulations:{type:Array,required:true},
    //level_studies:{type:String,required:true},
    //location:{type:String,required:true},
    ///area:{type:String,required:true},
    ///certificates:{type:String,required:true},
    ///status:{type:Boolean,required:true},
    //RFC:{type:String,required:true},
    //location:{type:Arrayz,required:true},
    ///keys:{type:String,required:true},
    //photo:{type:BinData,required:false},
});

module.exports=mongoose.model('usersEmployee',UserEmployeeSchema);