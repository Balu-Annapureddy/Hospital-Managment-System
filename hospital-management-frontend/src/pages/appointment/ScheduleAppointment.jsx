import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    TextField,
    Button,
    MenuItem,
    Typography,
    Box,
    Divider,
    CircularProgress,
    Alert,
    Autocomplete,
    InputAdornment
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    EventNote as CalendarIcon,
    Person as PersonIcon,
    MedicalServices as DoctorIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

import PageContainer from '../../components/common/PageContainer';
import appointmentAPI from '../../api/appointmentAPI';
import patientAPI from '../../api/patientAPI';
import userAPI from '../../api/userAPI';

/**
 * ScheduleAppointment component form
 */
const ScheduleAppointment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialPatientId = queryParams.get('patientId');

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [formData, setFormData] = useState({
        patientId: initialPatientId || '',
        doctorId: '',
        appointmentDate: '',
        reason: '',
        notes: ''
    });

    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [patientsData, doctorsData] = await Promise.all([
                patientAPI.getAllPatients(0, 100), // Get first 100 for search
                userAPI.getDoctors()
            ]);

            setPatients(patientsData.content);
            setDoctors(doctorsData);

            if (initialPatientId) {
                const patient = patientsData.content.find(p => p.id.toString() === initialPatientId);
                if (patient) setSelectedPatient(patient);
            }

            setError('');
        } catch (err) {
            console.error('Error fetching initial data:', err);
            setError('Failed to load dependency data.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePatientChange = (event, newValue) => {
        setSelectedPatient(newValue);
        setFormData(prev => ({ ...prev, patientId: newValue ? newValue.id : '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            // API expects ISO string format for date
            const dataToSubmit = {
                ...formData,
                appointmentDate: new Date(formData.appointmentDate).toISOString()
            };

            await appointmentAPI.scheduleAppointment(dataToSubmit);
            setSuccess('Appointment scheduled successfully!');
            setTimeout(() => navigate('/appointments'), 1500);
        } catch (err) {
            console.error('Error scheduling appointment:', err);
            setError(err.response?.data?.message || 'Failed to schedule appointment.');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <PageContainer
            title="Schedule Appointment"
            subtitle="Book a consultation with a specialist"
            breadcrumbs={[
                { label: 'Dashboard', path: '/' },
                { label: 'Appointments', path: '/appointments' },
                { label: 'Schedule' }
            ]}
        >
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/appointments')}
                    sx={{ color: 'text.secondary' }}
                >
                    Back to List
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Appointment Details
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={patients}
                            getOptionLabel={(option) => `${option.fullName} (${option.patientId})`}
                            value={selectedPatient}
                            onChange={handlePatientChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Patient"
                                    required
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon color="primary" />
                                                {params.InputProps.startAdornment}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Select Doctor"
                            name="doctorId"
                            value={formData.doctorId}
                            onChange={handleChange}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DoctorIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            {doctors.map((doctor) => (
                                <MenuItem key={doctor.id} value={doctor.id}>
                                    Dr. {doctor.fullName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Appointment Date & Time"
                            name="appointmentDate"
                            type="datetime-local"
                            value={formData.appointmentDate}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Reason for Visit"
                            name="reason"
                            placeholder="Primary symptoms or purpose of checkup"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                            multiline
                            rows={2}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Notes (Internal)"
                            name="notes"
                            placeholder="Additional information for the clinical staff"
                            value={formData.notes}
                            onChange={handleChange}
                            multiline
                            rows={3}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/appointments')}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                type="submit"
                                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                disabled={submitting}
                            >
                                Schedule Appointment
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </PageContainer>
    );
};

export default ScheduleAppointment;
