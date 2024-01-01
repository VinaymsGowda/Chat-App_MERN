import express from "express"
import { authorization } from "../middlewares/authUser.js";
import {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup} from "../controllers/chatControllers.js";

const chatRouter=express.Router();

//access a chat 
chatRouter.post("/create",authorization,accessChat)
//get all chats in db of that user
chatRouter.get("/allchats",authorization,fetchChats)

//create group
chatRouter.post("/group/create",authorization,createGroupChat)

//rename group
chatRouter.put("/group/rename",authorization,renameGroup);

//remove from group
chatRouter.put("/group/remove",authorization,removeFromGroup);

//add to Group

chatRouter.put("/group/add",authorization,addToGroup)


export default chatRouter;