// API service for making requests to the backend
// Using relative paths for better proxy compatibility
const API_BASE_URL = '/api';

// Default fetch options to include with all requests
const defaultOptions = {
    credentials: 'include',  // This is important for cookies
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Helper function to check if response is OK and parse JSON
const handleResponse = async (response) => {
    try {
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        const data = isJson ? await response.json() : await response.text();
        
        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText);
            const error = (isJson && data.error) ? data.error : `Error: ${response.status} ${response.statusText}`;
            throw new Error(error);
        }
        
        return data;
    } catch (error) {
        console.error('API Response Error:', error);
        throw error;
    }
};

// User related API calls
export const userApi = {
    // Get users for conversation list
    getUsers: async () => {
        try {
            console.log('Fetching users');
            const response = await fetch(`${API_BASE_URL}/users`, defaultOptions);
            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },
    
    // Get blocked users
    getBlockedUsers: async () => {
        try {
            console.log('Fetching blocked users');
            const response = await fetch(`${API_BASE_URL}/users/blocked`, defaultOptions);
            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching blocked users:', error);
            throw error;
        }
    },
    
    // Block a user
    blockUser: async (userId) => {
        try {
            console.log(`Blocking user: ${userId}`);
            const response = await fetch(`${API_BASE_URL}/users/block/${userId}`, {
                ...defaultOptions,
                method: 'POST'
            });
            console.log('Block response status:', response.status);
            return handleResponse(response);
        } catch (error) {
            console.error('Error blocking user:', error);
            throw error;
        }
    },
    
    // Unblock a user
    unblockUser: async (userId) => {
        try {
            console.log(`Unblocking user: ${userId}`);
            const response = await fetch(`${API_BASE_URL}/users/unblock/${userId}`, {
                ...defaultOptions,
                method: 'POST'
            });
            console.log('Unblock response status:', response.status);
            return handleResponse(response);
        } catch (error) {
            console.error('Error unblocking user:', error);
            throw error;
        }
    }
};

// Message related API calls
export const messageApi = {
    // Get messages for a conversation
    getMessages: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/${userId}`, defaultOptions);
            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },
    
    // Send a message to a user
    sendMessage: async (userId, message) => {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/send/${userId}`, {
                ...defaultOptions,
                method: 'POST',
                body: JSON.stringify({ message })
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
};

export default {
    userApi,
    messageApi
};