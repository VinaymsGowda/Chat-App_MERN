import express from "express";
import { authorization } from "../middlewares/authUser.js";
import { sendMessage, allMessages } from "../controllers/messageController.js";
const messageRouter=express.Router();

messageRouter.route('/').post(authorization,sendMessage)
messageRouter.route('/:chatid').get(authorization,allMessages)
export default messageRouter;