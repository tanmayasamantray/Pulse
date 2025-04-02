import { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { MdBlock } from "react-icons/md";
import { useAuthContext } from "../../context/AuthContext";
import useBlockUser from "../../hooks/useBlockUser";
import toast from "react-hot-toast";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { blockUser, loading: blockLoading } = useBlockUser();
	const [showConfirmation, setShowConfirmation] = useState(false);

	useEffect(() => {
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	const handleBlockUser = async () => {
		if (!selectedConversation) return;
		
		const success = await blockUser(selectedConversation._id);
		if (success) {
			// Reset selected conversation and hide confirmation dialog
			setSelectedConversation(null);
			setShowConfirmation(false);
			toast.success(`You have blocked ${selectedConversation.username}`);
		}
	};

	return (
		<div className='md:min-w-[450px] flex flex-col'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='bg-purple-900 px-4 py-2 mb-2 flex justify-between items-center'>
						<div>
							<span className='label-text'>To:</span>{" "}
							<span className='text-gray-100 font-bold'>{selectedConversation.username}</span>
						</div>
						<button 
							onClick={() => setShowConfirmation(true)}
							className='btn btn-sm btn-ghost text-red-500'
							title="Block User"
						>
							<MdBlock size={20} />
						</button>
					</div>
					
					{/* Block User Confirmation Modal */}
					{showConfirmation && (
						<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
							<div className='bg-gray-800 p-4 rounded-lg max-w-sm w-full'>
								<h3 className='text-lg font-bold text-white mb-4'>Block User</h3>
								<p className='text-gray-300 mb-6'>
									Are you sure you want to block {selectedConversation.username}? 
									You won't be able to send or receive messages from them.
								</p>
								<div className='flex justify-end gap-2'>
									<button 
										onClick={() => setShowConfirmation(false)}
										className='btn btn-sm'
										disabled={blockLoading}
									>
										Cancel
									</button>
									<button 
										onClick={handleBlockUser}
										className='btn btn-sm btn-error'
										disabled={blockLoading}
									>
										{blockLoading ? <span className="loading loading-spinner loading-xs"></span> : "Block User"}
									</button>
								</div>
							</div>
						</div>
					)}
					
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {authUser.username} ❄</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};
