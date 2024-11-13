import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMogoDB from "./db/connectToMongoDB.js";

const app = express();
config();
const PORT = process.env.PORT || 5000


app.use(express.json()); // To parse incoming request with json payloads

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    connectToMogoDB();
    console.log(`Server active on PORT ${PORT}.`);
});