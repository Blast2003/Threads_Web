import express from 'express';
import { sendMessage, getMessages, getConversations } from '../controllers/messageController.js';
import { protectRoutes } from '../middlewares/protectRoutes.js';

const messageRouter = express.Router();

messageRouter.post("/", protectRoutes, sendMessage)
messageRouter.get("/:otherUserId", protectRoutes, getMessages)
messageRouter.get("/", protectRoutes, getConversations)

export default messageRouter