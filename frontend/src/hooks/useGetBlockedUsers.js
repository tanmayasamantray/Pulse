import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { userApi } from "../utils/apiService";

const useGetBlockedUsers = () => {
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBlockedUsers = async () => {
        setLoading(true);
        try {
            const data = await userApi.getBlockedUsers();
            setBlockedUsers(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlockedUsers();
    }, []);

    return { blockedUsers, loading, refetch: fetchBlockedUsers };
};

export default useGetBlockedUsers; 