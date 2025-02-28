import { useState } from "react";
import useConversation from "../zustand/useConversation";
import { encryptMessage } from "../utils/encryption";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const { authUser } = useAuthContext();

    const sendMessage = async (message) => {
        setLoading(true);
        try {
            // Encrypt message before sending
            const encryptedMessage = encryptMessage(
                message,
                authUser._id,
                selectedConversation._id
            );

            const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: encryptedMessage }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setMessages([...messages, data]);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
};
export default useSendMessage;