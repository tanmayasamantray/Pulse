import useGetConversation from "../../hooks/useGetConversation";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation"

const Conversations = () => {
  const {loading, conversations} = useGetConversation();
  console.log("CONVERSATIONS: ", conversations)
  return (
    <div className='py-2 flex flex-col'>
      {conversations.map((conversation, Idx) => (
        <Conversation 
        key={conversation._id} 
        conversation={conversation} 
        emoji = {getRandomEmoji()}
        lastIdx = {Idx === conversations.length -1}
        />
      ))}
      {loading ? <span className='loading loading-spinner mx-auto'></span> : null}
    </div>
  )
}

export default Conversations
