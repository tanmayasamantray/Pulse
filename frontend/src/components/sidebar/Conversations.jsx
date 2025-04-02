import { useEffect } from "react";
import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";

const Conversations = () => {
	const { loading, conversations, refetchConversations } = useGetConversations();
	
	// Create an event handler for user block/unblock events
	useEffect(() => {
		// Custom event for when a user is blocked or unblocked
		const handleUserBlockChange = () => {
			refetchConversations();
		};
		
		// Listen for the block/unblock event
		window.addEventListener("user-blocked", handleUserBlockChange);
		window.addEventListener("user-unblocked", handleUserBlockChange);
		
		return () => {
			window.removeEventListener("user-blocked", handleUserBlockChange);
			window.removeEventListener("user-unblocked", handleUserBlockChange);
		};
	}, [refetchConversations]);
	
	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{conversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === conversations.length - 1}
				/>
			))}

			{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
		</div>
	);
};
export default Conversations;

