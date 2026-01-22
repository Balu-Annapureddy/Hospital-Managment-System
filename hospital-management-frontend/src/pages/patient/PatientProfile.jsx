import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Divider,
    CircularProgress,
    Alert,
    Avatar,
    Chip,
    Button,
    Tabs,
    Tab,
    Stack,
    Card,
    CardContent
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Home as HomeIcon,
    Cake as CakeIcon,
    Wc as GenderIcon,
    Bloodtype as BloodIcon,
    EventNote as AppointmentIcon,
    History as HistoryIcon,
    MedicalInformation as MedicalIcon
} from '@mui/icons-material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent
} from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';

import PageContainer from '../../components/common/PageContainer';
import patientAPI from '../../api/patientAPI';
import { useAuth } from '../../auth/AuthContext';
import { format } from 'date-fns';

/**
 * PatientProfile component for viewing 360-degree patient info
 */
const PatientProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { hasRole } = useAuth();

    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchPatientProfile();
    }, [id]);

    const fetchPatientProfile = async () => {
        try {
            setLoading(true);
            const data = await patientAPI.getPatientProfile(id);
            setPatient(data);
        } catch (err) {
            console.error('Error fetching patient profile:', err);
            setError('Failed to load patient profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !patient) {
        return (
            <PageContainer title="Patient Profile">
                <Alert severity="error">{error || 'Patient not found.'}</Alert>
            </PageContainer>
        );
    }

    const InfoItem = ({ icon, label, value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ color: 'primary.main', mr: 2, display: 'flex' }}>{icon}</Box>
            <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {label}
                </Typography>
                <Typography variant="body2" fontWeight="500">
                    {value || 'N/A'}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <PageContainer
            title={patient.fullName}
            subtitle={`Patient ID: ${patient.patientId}`}
            breadcrumbs={[
                { label: 'Dashboard', path: '/' },
                { label: 'Patients', path: '/patients' },
                { label: 'Profile' }
            ]}
        >
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/patients')}
                    sx={{ color: 'text.secondary' }}
                >
                    Back to List
                </Button>
                {(hasRole('NURSE') || hasRole('ADMIN')) && (
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/patients/edit/${patient.id}`)}
                    >
                        Edit Profile
                    </Button>
                )}
            </Box>

            <Grid container spacing={3}>
                {/* Sidebar Info */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', mb: 3 }}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                mx: 'auto',
                                mb: 2,
                                bgcolor: 'primary.light',
                                fontSize: '2.5rem'
                            }}
                        >
                            {patient.firstName[0]}{patient.lastName[0]}
                        </Avatar>
                        <Typography variant="h5" fontWeight="700" gutterBottom>
                            {patient.fullName}
                        </Typography>
                        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                            <Chip label={patient.gender} size="small" variant="outlined" />
                            <Chip label={`${patient.age} years`} size="small" variant="outlined" />
                            {patient.bloodGroup && (
                                <Chip label={patient.bloodGroup} size="small" color="error" />
                            )}
                        </Stack>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ textAlign: 'left' }}>
                            <InfoItem icon={<PhoneIcon fontSize="small" />} label="Phone" value={patient.phone} />
                            <InfoItem icon={<EmailIcon fontSize="small" />} label="Email" value={patient.email} />
                            <InfoItem icon={<HomeIcon fontSize="small" />} label="Address" value={patient.address} />
                            <InfoItem icon={<CakeIcon fontSize="small" />} label="Date of Birth" value={patient.dateOfBirth} />
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Emergency Contact
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body2" fontWeight="600">{patient.emergencyContact || 'Not provided'}</Typography>
                        <Typography variant="body2" color="text.secondary">{patient.emergencyPhone}</Typography>
                    </Paper>
                </Grid>

                {/* Content Area */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ borderRadius: 2 }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2 }}>
                                <Tab label="Overview" icon={<MedicalIcon />} iconPosition="start" />
                                <Tab label="Appointments" icon={<AppointmentIcon />} iconPosition="start" />
                                <Tab label="Medical History" icon={<HistoryIcon />} iconPosition="start" />
                            </Tabs>
                        </Box>

                        {/* Overview Tab */}
                        {tabValue === 0 && (
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" fontWeight="600" gutterBottom>Medical History</Typography>
                                        <Typography variant="body2" sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                                            {patient.medicalHistory || 'No medical history recorded.'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" fontWeight="600" gutterBottom>Known Allergies</Typography>
                                        <Typography variant="body2" sx={{ p: 2, bgcolor: 'rgba(211, 47, 47, 0.04)', color: 'error.main', borderRadius: 1 }}>
                                            {patient.allergies || 'No allergies reported.'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Appointments Tab */}
                        {tabValue === 1 && (
                            <Box sx={{ p: 3 }}>
                                {patient.recentAppointments && patient.recentAppointments.length > 0 ? (
                                    <Stack spacing={2}>
                                        {patient.recentAppointments.map((apt) => (
                                            <Card key={apt.id} variant="outlined" sx={{ borderLeft: '4px solid', borderColor: apt.status === 'COMPLETED' ? 'success.main' : 'primary.main' }}>
                                                <CardContent sx={{ py: '12px !important' }}>
                                                    <Grid container alignItems="center">
                                                        <Grid item xs={12} sm={4}>
                                                            <Typography variant="body2" fontWeight="600">
                                                                {format(new Date(apt.appointmentDate), 'MMM dd, yyyy • hh:mm a')}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <Typography variant="body2">Dr. {apt.doctorName}</Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                                                            <Chip label={apt.status} size="small" color={apt.status === 'COMPLETED' ? 'success' : 'primary'} />
                                                        </Grid>
                                                        <Grid item xs={12} sx={{ mt: 1 }}>
                                                            <Typography variant="caption" color="text.secondary">Reason: {apt.reason}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                                        No appointment history found.
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {/* Medical History (Timeline) Tab */}
                        {tabValue === 2 && (
                            <Box sx={{ p: 3 }}>
                                {patient.medicalRecords && patient.medicalRecords.length > 0 ? (
                                    <Timeline position="right" sx={{ p: 0 }}>
                                        {patient.medicalRecords.map((record, index) => (
                                            <TimelineItem key={record.id}>
                                                <TimelineOppositeContent sx={{ flex: 0.2, py: 2, px: 2 }}>
                                                    <Typography variant="caption" fontWeight="600">
                                                        {format(new Date(record.visitDate), 'MMM dd, yyyy')}
                                                    </Typography>
                                                </TimelineOppositeContent>
                                                <TimelineSeparator>
                                                    <TimelineDot color="primary" />
                                                    {index !== patient.medicalRecords.length - 1 && <TimelineConnector />}
                                                </TimelineSeparator>
                                                <TimelineContent sx={{ py: 2, px: 2 }}>
                                                    <Typography variant="body1" fontWeight="600">
                                                        {record.diagnosis}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        Physician: Dr. {record.doctorName}
                                                    </Typography>
                                                    <Box sx={{ mt: 1, p: 1.5, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                                                        <Typography variant="caption" fontWeight="600" display="block">Prescription:</Typography>
                                                        <Typography variant="body2">{record.prescription}</Typography>
                                                    </Box>
                                                </TimelineContent>
                                            </TimelineItem>
                                        ))}
                                    </Timeline>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                                        No clinical records found for this patient.
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default PatientProfile;
