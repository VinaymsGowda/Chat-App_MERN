import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";

async function authorization(req,res,next){
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){ 
        // Bearer token=Bearer afhafoahifafnaif
        //so token=afhafoahifafnaif when split and taken 1st index

        try {
            token=req.headers.authorization.split(" ")[1]

        const decoded=jwt.verify(token,process.env.JWT_secret);
        // console.log("token ",decoded);

        req.user=await UserModel.findById(decoded.id);
        // console.log("At authorization");
        // console.log(req.user);
        next();
        } catch (error) {
            res.status(401);
            throw new Error("Not Authorized  token failed");
        }
    }
    if(!token){
        res.status(401);
        throw new Error("Not Authorized No  token ");
    }
}

export {authorization}