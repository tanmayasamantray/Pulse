import CryptoJS from 'crypto-js';

export const generateEncryptionKey = (senderId, receiverId) => {
    const combinedIds = [senderId, receiverId].sort().join('_');
    return CryptoJS.SHA256(combinedIds).toString();
};

export const encryptMessage = (message, senderId, receiverId) => {
    try {
        const encryptionKey = generateEncryptionKey(senderId, receiverId);
        return CryptoJS.AES.encrypt(message, encryptionKey).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        return message;
    }
};

export const decryptMessage = (encryptedMessage, senderId, receiverId) => {
    try {
        const encryptionKey = generateEncryptionKey(senderId, receiverId);
        const bytes = CryptoJS.AES.decrypt(encryptedMessage, encryptionKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption error:', error);
        return encryptedMessage;
    }
};