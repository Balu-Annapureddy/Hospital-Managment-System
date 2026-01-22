import api from './axios';

/**
 * Dashboard API service
 */
const dashboardAPI = {
    /**
     * Get admin dashboard statistics
     */
    getAdminDashboard: async () => {
        const response = await api.get('/dashboard/admin');
        return response.data;
    },

    /**
     * Get doctor dashboard statistics
     */
    getDoctorDashboard: async (doctorId) => {
        const response = await api.get(`/dashboard/doctor/${doctorId}`);
        return response.data;
    },

    /**
     * Get current doctor's dashboard
     */
    getMyDoctorDashboard: async () => {
        const response = await api.get('/dashboard/doctor/me');
        return response.data;
    },

    /**
     * Get billing dashboard statistics
     */
    getBillingDashboard: async () => {
        const response = await api.get('/dashboard/billing');
        return response.data;
    },
};

export default dashboardAPI;
