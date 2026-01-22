import api from './axios';

/**
 * Appointment API service
 */
const appointmentAPI = {
    /**
     * Schedule new appointment
     */
    scheduleAppointment: async (appointmentData) => {
        const response = await api.post('/appointments', appointmentData);
        return response.data;
    },

    /**
     * Update appointment status
     */
    updateAppointmentStatus: async (id, statusData) => {
        const response = await api.put(`/appointments/${id}/status`, statusData);
        return response.data;
    },

    /**
     * Get appointment by ID
     */
    getAppointmentById: async (id) => {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
    },

    /**
     * Get all appointments
     */
    getAllAppointments: async (page = 0, size = 10) => {
        const response = await api.get(`/appointments?page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Get appointments by date
     */
    getAppointmentsByDate: async (date) => {
        const response = await api.get(`/appointments/by-date?date=${date}`);
        return response.data;
    },

    /**
     * Get today's appointments
     */
    getTodaysAppointments: async () => {
        const response = await api.get('/appointments/today');
        return response.data;
    },

    /**
     * Get appointments by doctor
     */
    getAppointmentsByDoctor: async (doctorId, page = 0, size = 10) => {
        const response = await api.get(`/appointments/by-doctor/${doctorId}?page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Get today's appointments by doctor
     */
    getTodaysAppointmentsByDoctor: async (doctorId) => {
        const response = await api.get(`/appointments/today/by-doctor/${doctorId}`);
        return response.data;
    },

    /**
     * Get appointments by patient
     */
    getAppointmentsByPatient: async (patientId, page = 0, size = 10) => {
        const response = await api.get(`/appointments/by-patient/${patientId}?page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Get appointments by status
     */
    getAppointmentsByStatus: async (status, page = 0, size = 10) => {
        const response = await api.get(`/appointments/by-status/${status}?page=${page}&size=${size}`);
        return response.data;
    },
};

export default appointmentAPI;
