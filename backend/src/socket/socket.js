import {Server} from "socket.io"
import http from "http"
import express from "express"
import Message from "../models/messageModel.js"
import Conversation from "../models/conversationModel.js";

const app = express();
const server = http.createServer(app);

// socket server
const io = new Server(server, {  // handle multiple connections for each user
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
}); 


export const getRecipientSocketId = (recipientId) => { // userId
	return userSocketMap[recipientId];
};


const userSocketMap = {}; // userId: socketId

io.on("connection", (socket) =>{
    console.log("user connected", socket.id);

    const userId = socket.handshake.query.userId;

    if(userId != "undefined"){
        userSocketMap[userId] = socket.id;
    }

    // create events
    io.emit("getOnlineUsers", Object.keys(userSocketMap)) // key = userId -> online

    // handle mark messages when we seen
    socket.on("markMessagesAsSeen", async({conversationId, userId }) =>{
        
        try {
            //update seen boolean
            await Message.updateMany( {conversationId: conversationId, seen: false}, {
                $set:{seen: true}
            })

            await Conversation.updateOne( {_id: conversationId}, {
                $set:{"lastMessage.seen": true}
            })

            // send to the user
            io.to(userSocketMap[userId]).emit("messagesSeen", {conversationId} )

        } catch (error) {
            console.log(error)
        }
    })


    socket.on("disconnect", () =>{ 
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        
        // send events
        io.emit("getOnlineUsers", Object.keys(userSocketMap)) // key = userId -> offline
    })
})

export {io, server, app};

