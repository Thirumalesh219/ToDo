const {Router}=require('express');
const User=require("../models/user");
const Tasks=require('../models/tasks');
const authMiddleware=require("../middleware/authMiddleware");

const router=Router();


router.post('/addtodo',authMiddleware,async(req,res)=>{
    try{
        const {task}=req.body;
        const item=await Tasks.create({user_id:req.user.user,task:task});
        item.save();
        return res.status(200).send({message:"Success"});
    } catch(err) {
        return res.status(400).send({message:"Failed to create Task"});
    }
});

router.get("/todo", authMiddleware, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const status = req.query.status || "all";

    const skip = (page - 1) * limit;

    const filter = {
      user_id: req.user.user,
    };

    if (status === "completed") {
      filter.isdone = true;
    }

    if (status === "pending") {
      filter.isdone = false;
    }

    const totalTasks = await Tasks.countDocuments({
      user_id: req.user.user,
    });

    const completedTasks = await Tasks.countDocuments({
      user_id: req.user.user,
      isdone: true,
    });

    const pendingTasks = await Tasks.countDocuments({
      user_id: req.user.user,
      isdone: false,
    });

    const tasks = await Tasks.find(filter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const filteredCount = await Tasks.countDocuments(filter);

    res.json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(filteredCount / limit),
      counts: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

router.put('/updatetodo/:id',authMiddleware,async(req,res)=>{
    try{
        const task=await Tasks.findOneAndUpdate({_id:req.params.id},{isdone:req.body.isdone});
        res.status(200).send({message:"Success"});
    } catch(err){
        res.status(400).send({message:"Error occured"});
    }
});

router.delete("/deletetodo/:id",authMiddleware,async(req,res)=>{
    try{
        const task=await Tasks.deleteOne({_id:req.params.id});
        res.status(200).send({message:"Success"});
    } catch(err){
        res.status(400).send({message:"Cannot delete"});
    }
});

module.exports=router;