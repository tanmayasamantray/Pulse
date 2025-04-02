import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
	try {
		console.log('Checking authentication for:', req.path);
		const token = req.cookies.jwt;

		if (!token) {
			console.log('No token found in cookies');
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		console.log('Token found, verifying...');
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			console.log('Invalid token');
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		console.log('Token verified, finding user:', decoded.userId);
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			console.log('User not found:', decoded.userId);
			return res.status(404).json({ error: "User not found" });
		}

		console.log('User authenticated:', user.username);
		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		
		// Handle JWT specific errors
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ error: "Invalid token format" });
		} else if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ error: "Token has expired" });
		}
		
		res.status(500).json({ error: "Internal server error" });
	}
};

export default protectRoute;
