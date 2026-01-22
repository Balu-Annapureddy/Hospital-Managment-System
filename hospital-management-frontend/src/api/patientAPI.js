import api from './axios';

/**
 * Patient API service
 */
const patientAPI = {
    /**
     * Register new patient
     */
    registerPatient: async (patientData) => {
        const response = await api.post('/patients', patientData);
        return response.data;
    },

    /**
     * Update patient
     */
    updatePatient: async (id, patientData) => {
        const response = await api.put(`/patients/${id}`, patientData);
        return response.data;
    },

    /**
     * Get patient profile with full details
     */
    getPatientProfile: async (id) => {
        const response = await api.get(`/patients/${id}`);
        return response.data;
    },

    /**
     * Get patient by patient ID
     */
    getPatientByPatientId: async (patientId) => {
        const response = await api.get(`/patients/by-patient-id/${patientId}`);
        return response.data;
    },

    /**
     * Get all patients with pagination
     */
    getAllPatients: async (page = 0, size = 10) => {
        const response = await api.get(`/patients?page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Search patients
     */
    searchPatients: async (query, page = 0, size = 10) => {
        const response = await api.get(`/patients/search?query=${query}&page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Delete patient
     */
    deletePatient: async (id) => {
        const response = await api.delete(`/patients/${id}`);
        return response.data;
    },
};

export default patientAPI;
