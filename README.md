# MERN Stack Project: Build and Deploy a Real Time Chat App | JWT, Socket.io

![Demo App](https://i.ibb.co/fXmZdnz/Screenshot-10.png)

[Video Tutorial on Youtube](https://youtu.be/HwCqsOis894)

Some Features:

-   🌟 Tech stack: MERN + Socket.io + TailwindCSS + Daisy UI
-   🎃 Authentication && Authorization with JWT
-   👾 Real-time messaging with Socket.io
-   🔒 End-to-end message encryption
-   🚀 Online user status (Socket.io and React Context)
-   👌 Global state management with Zustand
-   🐞 Error handling both on the server and on the client
-   ⭐ At the end Deployment like a pro for FREE!
-   ⏳ And much more!

### Setup .env file

```js
PORT=...
MONGO_DB_URI=...
JWT_SECRET=...
NODE_ENV=...
ENCRYPTION_KEY=... // 32 character key for message encryption
```

### Build the app

```shell
npm run build
```

### Start the app

```shell
npm start
```

### Migrate Existing Messages

If you have existing unencrypted messages in your database, you can encrypt them by running:

```shell
npm run encrypt-messages
```

## Security Information

This application implements server-side message encryption to ensure that messages stored in the database are encrypted. The encryption uses AES-256-CBC algorithm with a unique initialization vector for each message.

Key points:
- Messages are encrypted before storage and decrypted when retrieved
- Real-time socket.io communication remains unencrypted for performance
- The encryption uses both JWT_SECRET and ENCRYPTION_KEY for enhanced security
- All message encryption/decryption happens on the server side
