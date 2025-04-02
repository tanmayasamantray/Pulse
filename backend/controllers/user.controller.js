import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		// Get the current user to access their blocked list
		const currentUser = await User.findById(loggedInUserId);
		if (!currentUser) {
			return res.status(404).json({ error: "User not found" });
		}

		// Fetch users excluding:
		// 1. The current user
		// 2. Users the current user has blocked
		// 3. Users who have blocked the current user
		const filteredUsers = await User.find({ 
			$and: [
				{ _id: { $ne: loggedInUserId } },                   // Not the current user
				{ _id: { $nin: currentUser.blockedUsers } },        // Not blocked by current user
				{ blockedUsers: { $ne: loggedInUserId } }           // Has not blocked the current user
			]
		}).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const blockUser = async (req, res) => {
	try {
		const { id: userToBlockId } = req.params;
		const currentUserId = req.user._id;

		// Validate the user to block exists
		const userToBlock = await User.findById(userToBlockId);
		if (!userToBlock) {
			return res.status(404).json({ error: "User to block not found" });
		}

		// Check if already blocked
		const currentUser = await User.findById(currentUserId);
		if (currentUser.blockedUsers.includes(userToBlockId)) {
			return res.status(400).json({ error: "User is already blocked" });
		}

		// Add user to blocked list
		await User.findByIdAndUpdate(
			currentUserId, 
			{ $push: { blockedUsers: userToBlockId } }
		);

		res.status(200).json({ message: "User blocked successfully" });
	} catch (error) {
		console.error("Error in blockUser: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const unblockUser = async (req, res) => {
	try {
		const { id: userToUnblockId } = req.params;
		const currentUserId = req.user._id;

		// Validate the user to unblock exists
		const userToUnblock = await User.findById(userToUnblockId);
		if (!userToUnblock) {
			return res.status(404).json({ error: "User to unblock not found" });
		}

		// Check if actually blocked
		const currentUser = await User.findById(currentUserId);
		if (!currentUser.blockedUsers.includes(userToUnblockId)) {
			return res.status(400).json({ error: "User is not blocked" });
		}

		// Remove user from blocked list
		await User.findByIdAndUpdate(
			currentUserId, 
			{ $pull: { blockedUsers: userToUnblockId } }
		);

		res.status(200).json({ message: "User unblocked successfully" });
	} catch (error) {
		console.error("Error in unblockUser: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getBlockedUsers = async (req, res) => {
	try {
		const currentUserId = req.user._id;

		// Get the current user with populated blocked users
		const currentUser = await User.findById(currentUserId).populate("blockedUsers", "-password");
		if (!currentUser) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json(currentUser.blockedUsers);
	} catch (error) {
		console.error("Error in getBlockedUsers: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
