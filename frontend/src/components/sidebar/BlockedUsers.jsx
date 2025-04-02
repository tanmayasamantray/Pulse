import { useState } from "react";
import useGetBlockedUsers from "../../hooks/useGetBlockedUsers";
import useBlockUser from "../../hooks/useBlockUser";
import { MdPersonRemoveAlt1 } from "react-icons/md";

const BlockedUsers = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { blockedUsers, loading, refetch } = useGetBlockedUsers();
    const { unblockUser, loading: blockActionLoading } = useBlockUser();

    const handleUnblock = async (userId) => {
        const success = await unblockUser(userId);
        if (success) {
            refetch();
        }
    };

    return (
        <div className="mt-4">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-sm btn-outline w-full text-gray-200 mb-2"
            >
                {isOpen ? "Hide Blocked Users" : "Show Blocked Users"}
            </button>

            {isOpen && (
                <div className="bg-gray-800 rounded-lg p-2 max-h-40 overflow-auto">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Blocked Users</h3>
                    
                    {loading ? (
                        <div className="flex justify-center">
                            <span className="loading loading-spinner"></span>
                        </div>
                    ) : blockedUsers.length === 0 ? (
                        <p className="text-xs text-gray-400">No blocked users</p>
                    ) : (
                        <ul>
                            {blockedUsers.map(user => (
                                <li key={user._id} className="flex items-center justify-between p-1 hover:bg-gray-700 rounded">
                                    <div className="flex items-center gap-2">
                                        <div className="avatar">
                                            <div className="w-8 rounded-full">
                                                <img src={user.profilePic} alt={user.username} />
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-300">{user.username}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleUnblock(user._id)}
                                        className="btn btn-ghost btn-xs text-red-500"
                                        disabled={blockActionLoading}
                                    >
                                        <MdPersonRemoveAlt1 size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default BlockedUsers; 