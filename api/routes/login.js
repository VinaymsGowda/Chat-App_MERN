import express from "express";
import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import genToken from "../config.js/GenToken.js";
const loginRoute=express.Router();

loginRoute.post('/',async(req,res)=>{
    const {data}=req.body;
    const {email,password}=data;

    try {
        const checkUser=await UserModel.findOne({email});
    if(checkUser){
        const passok=bcrypt.compareSync(password,checkUser.password);
        if(passok){
            res.json({
                _id:checkUser._id,
                email:checkUser.email,
                username:checkUser.username,
                profile:checkUser.profile,
                token:genToken(checkUser._id)});
                console.log("Successful login");
        }
        else{
            res.status(404).json({msg:"Wrong Password"})
        }
            
    }
    else{
        res.status(404).json({msg:"Email Not Registererd"})
    }
    } catch (error) {
        console.log(error);
    }
    

    
})

export default loginRoute;