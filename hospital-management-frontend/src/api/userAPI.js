import api from './axios';

/**
 * User Management API service
 */
const userAPI = {
    /**
     * Get all doctors
     */
    getDoctors: async () => {
        const response = await api.get('/auth/users/role/DOCTOR');
        return response.data;
    },

    /**
     * Get user by ID
     */
    getUserById: async (id) => {
        const response = await api.get(`/auth/users/${id}`);
        return response.data;
    }
};

export default userAPI;
