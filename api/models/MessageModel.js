import mongoose, { Schema } from "mongoose";
//name of sender
//content
//ref to chat it belong to
const messageSchema=mongoose.Schema({
    "sender":{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    "content":{
        type:String,
        trim:true,
    },
    chat:{
        type:Schema.Types.ObjectId,
        ref:"Chat"
    },
},{
    timestamps:true,
})

export const Message=mongoose.model('Message',messageSchema);

