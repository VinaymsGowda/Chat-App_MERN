import mongoose from "mongoose";
//name,email,password,picture of user
const UserSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    profile:{
        type:String,
        // default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
},{timestamps:true});


export const UserModel=mongoose.model('User',UserSchema);