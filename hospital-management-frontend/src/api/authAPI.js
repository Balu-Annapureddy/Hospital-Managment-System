import api from './axios';

/**
 * Authentication API service
 */
const authAPI = {
    /**
     * Login user
     */
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    /**
     * Register new user
     */
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Health check
     */
    healthCheck: async () => {
        const response = await api.get('/auth/health');
        return response.data;
    },
};

export default authAPI;
