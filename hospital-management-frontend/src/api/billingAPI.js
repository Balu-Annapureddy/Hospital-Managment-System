import api from './axios';

/**
 * Billing API service
 */
const billingAPI = {
    /**
     * Generate new bill
     */
    generateBill: async (billData) => {
        const response = await api.post('/bills', billData);
        return response.data;
    },

    /**
     * Process payment
     */
    processPayment: async (billId, paymentData) => {
        const response = await api.post(`/bills/${billId}/payment`, paymentData);
        return response.data;
    },

    /**
     * Get bill by ID
     */
    getBillById: async (id) => {
        const response = await api.get(`/bills/${id}`);
        return response.data;
    },

    /**
     * Get all bills
     */
    getAllBills: async (page = 0, size = 10) => {
        const response = await api.get(`/bills?page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Get bills by patient
     */
    getBillsByPatient: async (patientId, page = 0, size = 10) => {
        const response = await api.get(`/bills/by-patient/${patientId}?page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Get unpaid bills
     */
    getUnpaidBills: async () => {
        const response = await api.get('/bills/unpaid');
        return response.data;
    },

    /**
     * Get revenue statistics
     */
    getRevenueStats: async () => {
        const response = await api.get('/bills/revenue/stats');
        return response.data;
    },
};

export default billingAPI;
