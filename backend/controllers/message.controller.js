import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let converastion = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })

        if (!converastion) {
            converastion = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })

        if (newMessage) {
            converastion.messages.push(newMessage._id);
        }

        await Promise.all(([converastion.save(), newMessage.save()]))
        // SOCKET FUNCTIONALITY HERE
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("getMessage", newMessage);
        }


        res.status(201).json({newMessage});
    } catch (error) {
        console.log("Error in message controller", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const getMessages = async (req, res) =>{
    try {
        const {id: userToChatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: {$all : [senderId, userToChatId]},
        }).populate("messages"); // Not Reference but actual messages

        if(!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages)

    } catch (error) {
        console.log("Error in message controller", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
}