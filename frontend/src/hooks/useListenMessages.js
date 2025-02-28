import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";
import { decryptMessage } from "../utils/encryption";
import { useAuthContext } from "../context/AuthContext";

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const { setMessages } = useConversation();
    const { authUser } = useAuthContext();

    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            newMessage.shouldShake = true;
            const sound = new Audio(notificationSound);
            sound.play();

            // Decrypt the message before adding it to the messages array
            const decryptedMessage = {
                ...newMessage,
                message: decryptMessage(
                    newMessage.message,
                    newMessage.senderId,
                    authUser._id
                )
            };
            
            setMessages(prev => [...prev, decryptedMessage]);
        };

        socket?.on("newMessage", handleNewMessage);

        return () => socket?.off("newMessage", handleNewMessage);
    }, [socket, setMessages, authUser._id]);
};

export default useListenMessages;