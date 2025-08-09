const {Router}=require('express');
const User=require("../models/user");
const Tasks=require('../models/tasks');
const authMiddleware=require("../middleware/authMiddleware");

const router=Router();


router.post('/addtodo',authMiddleware,async(req,res)=>{
    const {task}=req.body;
    const item=await Tasks.create({user_id:req.user.user,task:task});
    item.save();
    return res.send({message:"Success"});
});

router.get("/todo",authMiddleware,async(req,res)=>{
    const tasks=await Tasks.find({user_id:req.user.user},{task:1, isdone:1})
    const user=await User.find({_id:req.user.user},{username:1,_id:0});
    res.json({user:user,tasks:tasks});
});

router.put('/updatetodo/:id',authMiddleware,async(req,res)=>{
    try{
    const task=await Tasks.findOne({_id:req.params.id});
    task.isdone=req.body.isdone;
    await task.save();
        res.send({message:"Success"});
    }catch(err){
        res.send({message:"Error occured"});
    }
});

router.delete("/deletetodo/:id",authMiddleware,async(req,res)=>{
    try{
        const task=await Tasks.deleteOne({_id:req.params.id});
        res.send({message:"Success"});
    }catch(err){
        res.send({message:"Cannot delete"});
    }
});

module.exports=router;