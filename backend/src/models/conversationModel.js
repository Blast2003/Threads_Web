import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants:[
        {type: mongoose.Schema.Types.ObjectId, ref: "User"}
    ],

    // after send one message => it will be updated in lastMessage field
    lastMessage: {
        text: String,
        sender: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, 
        seen: {
            type: Boolean,
            default: false,
        },
    },

}, {
    timestamp: true,
})

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;