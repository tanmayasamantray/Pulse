import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { encryptMessage, decryptMessage } from "../utils/encryption.js";

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		// Check if either user has blocked the other
		const sender = await User.findById(senderId);
		const receiver = await User.findById(receiverId);

		if (!receiver) {
			return res.status(404).json({ error: "Receiver not found" });
		}

		// Check if the sender has blocked the receiver
		if (sender.blockedUsers.includes(receiverId)) {
			return res.status(403).json({ error: "You have blocked this user. Unblock to send messages." });
		}

		// Check if the receiver has blocked the sender
		if (receiver.blockedUsers.includes(senderId)) {
			return res.status(403).json({ error: "You cannot send messages to this user." });
		}

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		// Encrypt the message before saving to database
		const encryptedMessage = encryptMessage(message);

		const newMessage = new Message({
			senderId,
			receiverId,
			message: encryptedMessage,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// For socket.io, we send a message object with the original unencrypted text
		// This way the real-time communication works without requiring decryption on client
		const messageForSocket = {
			...newMessage._doc,
			message: message // Use original message for real-time delivery
		};

		// SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", messageForSocket);
		}

		// Return unencrypted message in response
		res.status(201).json({
			...newMessage._doc,
			message
		});
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		// Check if either user has blocked the other
		const currentUser = await User.findById(senderId);
		const otherUser = await User.findById(userToChatId);

		if (!otherUser) {
			return res.status(404).json({ error: "User not found" });
		}

		// Check if the current user has blocked the other user
		if (currentUser.blockedUsers.includes(userToChatId)) {
			return res.status(403).json({ error: "You have blocked this user. Unblock to see messages." });
		}

		// Check if the other user has blocked the current user
		if (otherUser.blockedUsers.includes(senderId)) {
			return res.status(403).json({ error: "You cannot view messages from this user." });
		}

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		// Decrypt messages before sending to client
		const decryptedMessages = conversation.messages.map(msg => {
			return {
				...msg._doc,
				message: decryptMessage(msg.message)
			};
		});

		res.status(200).json(decryptedMessages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
