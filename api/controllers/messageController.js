import Chat from "../models/ChatModel.js";
import { Message } from "../models/MessageModel.js";
import { UserModel } from "../models/UserModel.js";

async function sendMessage(req,res){
    //chatid -chat
    //sender -who is sending
    //message

    const {content,chatid}=req.body;

    if(!chatid || !content){
        console.log("Invalid Data passed");
        return res.sendStatus(400)
    }

    var newmessage={
        sender:req.user._id,
        content:content,
        chat:chatid,
    };

    try {
        var message=await Message.create(newmessage);
        message=await message.populate("sender","username profile")
        message=await message.populate("chat")
        
        message=await UserModel.populate(message,{
            path:'chat.users',
            select:'username profile email'
        })

        await Chat.findByIdAndUpdate(req.body.chatid,{
            latestMessage:message,
        })

        res.json(message);

    } catch (error) {
        res.status(400);
        console.log(error);
    }
}


async function allMessages(req,res){
    try {
        const messages=await Message.find({chat:req.params.chatid}).populate("sender","username profile email").
        populate("chat")
        res.json(messages);
    } catch (error) {
        res.sendStatus(400);
        console.log(error);
    }
}   
export {sendMessage,allMessages}

