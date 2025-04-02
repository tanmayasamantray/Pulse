import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	// Check environment
	const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
		httpOnly: true, // Prevent XSS attacks (cross-site scripting)
		sameSite: isDevelopment ? 'lax' : 'strict', // Relaxed in development to allow easier testing
		secure: !isDevelopment, // Only use HTTPS in production
		path: '/', // Make cookie available for all paths
	});

};

export default generateTokenAndSetCookie;
