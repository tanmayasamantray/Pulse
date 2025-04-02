import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Encrypts a message using AES-256-CBC encryption
 * @param {string} text - The plain text to be encrypted
 * @returns {string} - The encrypted text or original text if encryption fails
 */
export const encryptMessage = (text) => {
  try {
    if (!text) return text;
    
    // If already encrypted, return as is
    if (isEncrypted(text)) return text;
    
    // Create a unique initialization vector for each encryption
    const iv = crypto.randomBytes(16);
    
    // Use both JWT_SECRET and ENCRYPTION_KEY for enhanced security
    const combinedKey = crypto.createHash('sha256')
      .update(ENCRYPTION_KEY + JWT_SECRET)
      .digest('hex')
      .slice(0, 32); // Use first 32 bytes for AES-256
    
    const cipher = crypto.createCipheriv('aes-256-cbc', combinedKey, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Prepend the IV to the encrypted text (will be needed for decryption)
    // Format: iv:encryptedText
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Return original text if encryption fails
  }
};

/**
 * Decrypts an encrypted message
 * @param {string} encryptedText - The encrypted text to be decrypted
 * @returns {string} - The decrypted text or original text if decryption fails
 */
export const decryptMessage = (encryptedText) => {
  try {
    if (!encryptedText) return encryptedText;
    
    // If not encrypted or in wrong format, return as is
    if (!isEncrypted(encryptedText)) return encryptedText;
    
    // Split the IV and encrypted text
    const [ivHex, encrypted] = encryptedText.split(':');
    
    if (!ivHex || !encrypted) return encryptedText;
    
    const iv = Buffer.from(ivHex, 'hex');
    
    // Recreate the combined key used for encryption
    const combinedKey = crypto.createHash('sha256')
      .update(ENCRYPTION_KEY + JWT_SECRET)
      .digest('hex')
      .slice(0, 32);
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', combinedKey, iv);
    
    // Decrypt the text
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedText; // Return original text if decryption fails
  }
};

/**
 * Checks if a message is already encrypted
 * @param {string} text - The text to check
 * @returns {boolean} - True if the text appears to be encrypted
 */
export const isEncrypted = (text) => {
  try {
    if (!text || typeof text !== 'string') return false;
    
    // Check if text follows the expected IV:encrypted format
    const parts = text.split(':');
    if (parts.length !== 2) return false;
    
    const [ivHex, encrypted] = parts;
    
    // IV should be exactly 32 characters (16 bytes in hex)
    if (ivHex.length !== 32) return false;
    
    // Check if both parts are valid hex strings
    return /^[0-9a-f]+$/i.test(ivHex) && /^[0-9a-f]+$/i.test(encrypted);
  } catch (error) {
    return false;
  }
}; 