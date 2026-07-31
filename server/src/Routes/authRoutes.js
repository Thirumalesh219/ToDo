const {Router}=require('express');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require("../models/user");

const router=Router();

router.post('/signup',async(req,res)=>{
    const {username,email,password1,password2}=req.body;
    if(password1!==password2){
        return res.json({message:"Password Does Not Match"});
    }
    const ispresent=await User.findOne({email:email});
    if(ispresent){
        return res.json({message:"Email Already Exists"});
    }
    const ispresen=await User.findOne({username:username});
    if(ispresen){
        return res.json({message:"Username Already Exists"});
    }
    const password=await bcrypt.hash(password1,10);
    const user=await User.create({username,email,password});
    user.save();
    return res.json({message:`Success`});
})

router.post("/login", async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email:email});
    if(user)
    {
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch)
            return res.json({message:"Invalid Crendentials"});
    }
    else
        return res.json({message:"Invalid Crendentials"});
    const token=jwt.sign({user:user._id},process.env.JWT_SECRET);
    return res.json({token:token,message:"Success"});
})

module.exports=router;