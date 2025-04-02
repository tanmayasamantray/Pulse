import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { userApi } from "../utils/apiService";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	const getConversations = useCallback(async () => {
		setLoading(true);
		try {
			const data = await userApi.getUsers();
			setConversations(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		getConversations();
	}, [getConversations]);

	return { loading, conversations, refetchConversations: getConversations };
};
export default useGetConversations;
