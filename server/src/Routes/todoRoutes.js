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
    res.json({tasks:tasks});
});

router.put('/updatetodo/:id',authMiddleware,async(req,res)=>{
    try{
        const task=await Tasks.findOneAndUpdate({_id:req.params.id},{isdone:req.body.isdone});
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