import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Divider,
    CircularProgress,
    Alert,
    Stack
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Description as RecordIcon,
    Person as PersonIcon,
    Science as LabIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

import PageContainer from '../../components/common/PageContainer';
import medicalRecordAPI from '../../api/medicalRecordAPI';
import appointmentAPI from '../../api/appointmentAPI';
import patientAPI from '../../api/patientAPI';
import { useAuth } from '../../auth/AuthContext';

/**
 * MedicalRecordForm component for clinical documentation
 */
const MedicalRecordForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const appointmentId = queryParams.get('appointmentId');
    const patientId = queryParams.get('patientId');

    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [patient, setPatient] = useState(null);
    const [formData, setFormData] = useState({
        patientId: patientId || '',
        appointmentId: appointmentId || '',
        doctorId: user?.id || '',
        diagnosis: '',
        prescription: '',
        treatmentNotes: '',
        labResults: '',
        visitDate: new Date().toISOString().slice(0, 16) // Current local time for form
    });

    useEffect(() => {
        if (!patientId) {
            setError('Patient ID is required to create a medical record.');
            setLoading(false);
            return;
        }
        fetchPatientInfo();
    }, [patientId]);

    const fetchPatientInfo = async () => {
        try {
            const data = await patientAPI.getPatientProfile(patientId);
            setPatient(data);
            setError('');
        } catch (err) {
            console.error('Error fetching patient info:', err);
            setError('Failed to load patient information.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            // API expects ISO string
            const dataToSubmit = {
                ...formData,
                visitDate: new Date(formData.visitDate).toISOString()
            };

            await medicalRecordAPI.addMedicalRecord(dataToSubmit);
            setSuccess('Medical record saved successfully!');

            // If linked to appointment, we might want to refresh its status or redirect
            setTimeout(() => navigate(`/patients/${patientId}`), 1500);
        } catch (err) {
            console.error('Error saving medical record:', err);
            setError(err.response?.data?.message || 'Failed to save medical record.');
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

    if (error && !patient) {
        return (
            <PageContainer title="Add Medical Record">
                <Alert severity="error">{error}</Alert>
                <Button sx={{ mt: 2 }} onClick={() => navigate('/patients')}>Back to Patients</Button>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title="Add Medical Record"
            subtitle={`Documenting visit for ${patient?.fullName}`}
            breadcrumbs={[
                { label: 'Dashboard', path: '/' },
                { label: 'Patients', path: '/patients' },
                { label: patient?.fullName, path: `/patients/${patientId}` },
                { label: 'Add Record' }
            ]}
        >
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(`/patients/${patientId}`)}
                    sx={{ color: 'text.secondary' }}
                >
                    Back to Profile
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <RecordIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6" fontWeight="600">Clinical Documentation</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Visit Date & Time"
                            name="visitDate"
                            type="datetime-local"
                            value={formData.visitDate}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Diagnosing Physician"
                            value={`Dr. ${user?.fullName}`}
                            disabled
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Diagnosis"
                            name="diagnosis"
                            placeholder="Primary diagnosis findings"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            required
                            multiline
                            rows={3}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Prescription"
                            name="prescription"
                            placeholder="List medicines, dosage, and duration"
                            value={formData.prescription}
                            onChange={handleChange}
                            multiline
                            rows={4}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Treatment Notes"
                            name="treatmentNotes"
                            placeholder="Additional clinical remarks or instructions"
                            value={formData.treatmentNotes}
                            onChange={handleChange}
                            multiline
                            rows={4}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Lab Results / Investigations"
                            name="labResults"
                            placeholder="Details of laboratory tests or reports"
                            value={formData.labResults}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LabIcon color="primary" sx={{ alignSelf: 'flex-start', mt: 1, mr: 1 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate(`/patients/${patientId}`)}
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
                                Save Record
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </PageContainer>
    );
};

// Internal Import for InputAdornment
import { InputAdornment } from '@mui/material';

export default MedicalRecordForm;
