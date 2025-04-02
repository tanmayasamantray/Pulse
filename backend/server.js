import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const PORT = process.env.PORT || 8000;
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

// CORS configuration
const corsOptions = {
	// Allow both the Vite dev server and local requests
	origin: isDevelopment ? ['http://localhost:3000', 'http://127.0.0.1:3000'] : true,
	credentials: true, // Allow cookies to be sent with requests
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// Debug middleware for authentication
app.use((req, res, next) => {
	console.log('Request path:', req.path);
	console.log('Cookies:', req.cookies);
	next();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Fallback route for SPA
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Start the server
server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`🚀 Server Running on port ${PORT} in ${isDevelopment ? 'development' : 'production'} mode`);
});
