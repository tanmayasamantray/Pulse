import mongoose from "mongoose";
import {config} from "dotenv"

config();
const connectToMongoDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log("Error connecting to database", error.message);
    }
};

export default connectToMongoDB;