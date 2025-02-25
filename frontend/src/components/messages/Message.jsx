import {useAuthContext} from '../../context/AuthContext';
import { extractTime } from '../../utils/extractTime';
import useConversation from '../../zustand/useConversation';

const Message = ({message}) => {
  const {authUser}  = useAuthContext();
  const {selectedConversation} = useConversation();
  const fromMe = message.senderId === authUser._id;
  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const bubbleBgColor = fromMe ? 'chat-bubble text-white bg-blue-500' : 'chat-bubble text-black bg-gray-200';
  const profilePic = fromMe ? authUser.profilePic : selectedConversation.profilePic;
  const formattedTime = extractTime(message.createdAt);
  return (
    <div className = {`chat ${chatClassName}`}>
        <div className="chat-image avatar">
            <div className="w-10 rounded-full">
                <img alt="Tailwind css chat bubble component"
                src={profilePic}/>
            </div>
        </div>
        <div className={`pb-2 chat-bubble ${bubbleBgColor}`}>{message.message}</div>
        <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">{formattedTime}</div>
    </div>
  )
}

export default Message
