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
    IconButton
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Person as PersonIcon,
    ContactPhone as ContactIcon,
    MedicalInformation as MedicalIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

import PageContainer from '../../components/common/PageContainer';
import patientAPI from '../../api/patientAPI';

const GENDERS = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' }
];

/**
 * PatientForm component for registration and editing
 */
const PatientForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        phone: '',
        email: '',
        address: '',
        bloodGroup: '',
        medicalHistory: '',
        allergies: '',
        emergencyContact: '',
        emergencyPhone: ''
    });

    useEffect(() => {
        if (isEdit) {
            fetchPatient();
        }
    }, [id]);

    const fetchPatient = async () => {
        try {
            const data = await patientAPI.getPatientProfile(id);
            setFormData({
                firstName: data.firstName,
                lastName: data.lastName,
                dateOfBirth: data.dateOfBirth,
                gender: data.gender,
                phone: data.phone,
                email: data.email || '',
                address: data.address || '',
                bloodGroup: data.bloodGroup || '',
                medicalHistory: data.medicalHistory || '',
                allergies: data.allergies || '',
                emergencyContact: data.emergencyContact || '',
                emergencyPhone: data.emergencyPhone || ''
            });
        } catch (err) {
            console.error('Error fetching patient:', err);
            setError('Failed to load patient data.');
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
            if (isEdit) {
                await patientAPI.updatePatient(id, formData);
                setSuccess('Patient updated successfully!');
            } else {
                const response = await patientAPI.registerPatient(formData);
                setSuccess('Patient registered successfully!');
                // Small delay then redirect to profile
                setTimeout(() => navigate(`/patients/${response.id}`), 1500);
            }
        } catch (err) {
            console.error('Error saving patient:', err);
            setError(err.response?.data?.message || 'Failed to save patient information.');
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
            title={isEdit ? "Edit Patient" : "Register Patient"}
            subtitle={isEdit ? `Updating records for patient ID: ${id}` : "Initialize a new hospital record"}
            breadcrumbs={[
                { label: 'Dashboard', path: '/' },
                { label: 'Patients', path: '/patients' },
                { label: isEdit ? 'Edit' : 'Register' }
            ]}
        >
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/patients')}
                    sx={{ color: 'text.secondary' }}
                >
                    Back to List
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
                <Grid container spacing={4}>
                    {/* Basic Information */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <PersonIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6" fontWeight="600">Basic Information</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Date of Birth"
                                    name="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    {GENDERS.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Blood Group"
                                    name="bloodGroup"
                                    placeholder="e.g. A+"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Contact Information */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
                            <ContactIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6" fontWeight="600">Contact Details</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Residential Address"
                                    name="address"
                                    multiline
                                    rows={2}
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Medical History */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 2 }}>
                            <MedicalIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6" fontWeight="600">Medical Background</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Past Medical History"
                                    name="medicalHistory"
                                    multiline
                                    rows={4}
                                    placeholder="Previous conditions, surgeries, etc."
                                    value={formData.medicalHistory}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Known Allergies"
                                    name="allergies"
                                    multiline
                                    rows={4}
                                    placeholder="Drug allergies, food allergies, etc."
                                    value={formData.allergies}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Emergency Contact */}
                    <Grid item xs={12}>
                        <Divider sx={{ mb: 3, mt: 2 }} />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Emergency Contact Person"
                                    name="emergencyContact"
                                    value={formData.emergencyContact}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Emergency Contact Phone"
                                    name="emergencyPhone"
                                    value={formData.emergencyPhone}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Actions */}
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/patients')}
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
                                {isEdit ? "Update Record" : "Register Patient"}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </PageContainer>
    );
};

// Internal Import for Stack
import { Stack } from '@mui/material';

export default PatientForm;
