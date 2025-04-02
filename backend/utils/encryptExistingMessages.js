import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Message from '../models/message.model.js';
import { encryptMessage, isEncrypted } from './encryption.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URI);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Main function to encrypt existing messages
const encryptExistingMessages = async () => {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Find all messages
    const messages = await Message.find({});
    let alreadyEncryptedCount = 0;
    let emptyMessageCount = 0;
    
    // Loop through each message and encrypt if not already encrypted
    for (const msg of messages) {
      if (!msg.message) {
        emptyMessageCount++;
        continue;
      }
      
      if (isEncrypted(msg.message)) {
        alreadyEncryptedCount++;
        continue;
      }
      
      // Encrypt the message
      const encryptedMessage = encryptMessage(msg.message);
      
      // Update the message in the database
      await Message.findByIdAndUpdate(msg._id, { message: encryptedMessage });
      
    }
    
    
  } catch (error) {
    console.error('Error encrypting messages:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Execute the function
encryptExistingMessages(); 