import api from './axios';

/**
 * Medical Record API service
 */
const medicalRecordAPI = {
    /**
     * Add medical record
     */
    addMedicalRecord: async (recordData) => {
        const response = await api.post('/medical-records', recordData);
        return response.data;
    },

    /**
     * Update medical record
     */
    updateMedicalRecord: async (id, recordData) => {
        const response = await api.put(`/medical-records/${id}`, recordData);
        return response.data;
    },

    /**
     * Get medical record by ID
     */
    getMedicalRecordById: async (id) => {
        const response = await api.get(`/medical-records/${id}`);
        return response.data;
    },

    /**
     * Get patient medical history timeline
     */
    getPatientMedicalHistory: async (patientId) => {
        const response = await api.get(`/medical-records/patient/${patientId}`);
        return response.data;
    },

    /**
     * Get medical records by doctor
     */
    getMedicalRecordsByDoctor: async (doctorId, page = 0, size = 10) => {
        const response = await api.get(`/medical-records/by-doctor/${doctorId}?page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Get all medical records with pagination
     */
    getAllMedicalRecords: async (page = 0, size = 10) => {
        const response = await api.get(`/medical-records?page=${page}&size=${size}`);
        return response.data;
    },
};

export default medicalRecordAPI;
