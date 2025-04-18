import { useState } from "react";
import toast from "react-hot-toast";
import { userApi } from "../utils/apiService";

const useBlockUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const blockUser = async (userId) => {
        if (!userId) {
            toast.error("User ID is required");
            return false;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            await userApi.blockUser(userId);
            
            toast.success("User blocked successfully");
            
            // Dispatch an event to notify other components
            window.dispatchEvent(new CustomEvent("user-blocked", { detail: { userId } }));
            
            return true;
        } catch (error) {
            setError(error.message);
            
            // Display a user-friendly error message
            if (error.message.includes("401")) {
                toast.error("You need to be logged in to block users");
            } else if (error.message.includes("404")) {
                toast.error("User not found");
            } else {
                toast.error(error.message || "Failed to block user");
            }
            
            return false;
        } finally {
            setLoading(false);
        }
    };
    
    const unblockUser = async (userId) => {
        if (!userId) {
            toast.error("User ID is required");
            return false;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            await userApi.unblockUser(userId);
            
            toast.success("User unblocked successfully");
            
            // Dispatch an event to notify other components
            window.dispatchEvent(new CustomEvent("user-unblocked", { detail: { userId } }));
            
            return true;
        } catch (error) {
            setError(error.message);
            
            // Display a user-friendly error message
            if (error.message.includes("401")) {
                toast.error("You need to be logged in to unblock users");
            } else if (error.message.includes("404")) {
                toast.error("User not found");
            } else {
                toast.error(error.message || "Failed to unblock user");
            }
            
            return false;
        } finally {
            setLoading(false);
        }
    };
    
    return { blockUser, unblockUser, loading, error };
};

export default useBlockUser; 