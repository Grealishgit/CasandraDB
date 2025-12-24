import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authAPI = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/users/create', userData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/users/login', credentials);
        return response.data;
    },

    // Logout user
    logout: async () => {
        const response = await api.post('/users/logout');
        return response.data;
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },

    // Forgot password
    forgotPassword: async (email) => {
        const response = await api.post('/users/forgot-password', { email });
        return response.data;
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        const response = await api.post('/users/reset-password', { token, newPassword });
        return response.data;
    },
};