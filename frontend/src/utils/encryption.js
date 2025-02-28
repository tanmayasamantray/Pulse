import CryptoJS from 'crypto-js';
const SECRET_KEY  = import.meta.env.VITE_SECRET_KEY;
export const encrptMessage = (message) => {
    try{
        return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
    }catch(error){
        console.log('Encryption Error', error);
        return message;
    }
};

export const decryptMessage = (encryptedMessage) => {
    try{
        const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    }catch(error){
        console.log('Decryption Error', error);
        return encryptedMessage;
    }
};