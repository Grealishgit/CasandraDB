import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const goalsAPI = {
    // Get all goals for current user
    getAllGoals: async () => {
        const response = await api.get('/goals');
        return response.data;
    },

    // Get goals by status
    getGoalsByStatus: async (status) => {
        const response = await api.get(`/goals/status/${status}`);
        return response.data;
    },

    // Get goals by category
    getGoalsByCategory: async (category) => {
        const response = await api.get(`/goals/category/${category}`);
        return response.data;
    },

    // Get upcoming goals
    getUpcomingGoals: async () => {
        const response = await api.get('/goals/upcoming');
        return response.data;
    },

    // Get single goal
    getGoal: async (goalId) => {
        const response = await api.get(`/goals/${goalId}`);
        return response.data;
    },

    // Create new goal
    createGoal: async (goalData) => {
        const response = await api.post('/goals', goalData);
        return response.data;
    },

    // Update goal
    updateGoal: async (goalId, goalData) => {
        const response = await api.put(`/goals/${goalId}`, goalData);
        return response.data;
    },

    // Delete goal
    deleteGoal: async (goalId) => {
        const response = await api.delete(`/goals/${goalId}`);
        return response.data;
    },

    // Upload banner image
    uploadBanner: async (file) => {
        const formData = new FormData();
        formData.append('banner', file);

        const response = await api.post('/goals/upload-banner', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get goal statistics
    getGoalStats: async () => {
        const response = await api.get('/goals/stats');
        return response.data;
    },
};
