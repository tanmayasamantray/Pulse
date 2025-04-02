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
    console.log(`MongoDB Connected: ${conn.connection.host}`);
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
    
    console.log('Starting message encryption process...');
    
    // Find all messages
    const messages = await Message.find({});
    
    console.log(`Found ${messages.length} messages in total.`);
    
    let encryptedCount = 0;
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
      
      encryptedCount++;
      
      // Log progress every 100 messages
      if (encryptedCount % 100 === 0) {
        console.log(`Encrypted ${encryptedCount} messages so far...`);
      }
    }
    
    console.log('\nEncryption process completed:');
    console.log(`- Total messages: ${messages.length}`);
    console.log(`- Already encrypted: ${alreadyEncryptedCount}`);
    console.log(`- Newly encrypted: ${encryptedCount}`);
    console.log(`- Empty messages: ${emptyMessageCount}`);
    
  } catch (error) {
    console.error('Error encrypting messages:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Execute the function
encryptExistingMessages(); 