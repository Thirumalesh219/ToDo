const mongoose=require('mongoose');

const schema=mongoose.Schema({
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    task:{type:String,required:true},
    isdone:{type:Boolean,default:false}
},{timestamps:true});

module.exports=mongoose.model("Task",schema);