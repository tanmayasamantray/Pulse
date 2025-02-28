import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";
import { AuthContext } from "../context/AuthContext";

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const { setMessages } = useConversation();
    const {authUser} = AuthContext()

    useEffect(() => {
        const handleNewMessage = (newMessage) => {
            newMessage.shouldShake = true;
            const sound = new Audio(notificationSound);
            sound.play();
            setMessages(prev => [...prev, newMessage]);
        };

        socket?.on("newMessage", handleNewMessage);

        return () => socket?.off("newMessage", handleNewMessage);
    }, [socket, setMessages, authUser._id]);
};

export default useListenMessages;