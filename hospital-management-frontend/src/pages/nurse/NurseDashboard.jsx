import React, { useState, useEffect } from 'react';
import { Grid, Box, Paper, Typography, CircularProgress, Alert, Button, Divider, Stack } from '@mui/material';
import {
    People as PatientIcon,
    EventAvailable as AppointmentIcon,
    AddCircle as RegisterIcon,
    CalendarMonth as ScheduleIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import PageContainer from '../../components/common/PageContainer';
import StatCard from '../../components/common/StatCard';
import appointmentAPI from '../../api/appointmentAPI';
import patientAPI from '../../api/patientAPI';

/**
 * NurseDashboard component
 */
const NurseDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [patientCount, setPatientCount] = useState(0);
    const [todayApts, setTodayApts] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [patientsData, appointmentsData] = await Promise.all([
                patientAPI.getAllPatients(0, 1), // Just for total count
                appointmentAPI.getTodaysAppointments()
            ]);
            setPatientCount(patientsData.totalElements);
            setTodayApts(appointmentsData.length);
            setError('');
        } catch (err) {
            console.error('Error fetching nurse dashboard:', err);
            setError('Failed to load dashboard statistics.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <PageContainer
            title="Nurse Dashboard"
            subtitle="Care management and patient coordination hub."
        >
            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12} sm={4}>
                    <StatCard
                        title="Total Registered Patients"
                        value={patientCount}
                        icon={<PatientIcon />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard
                        title="Today's Appointments"
                        value={todayApts}
                        icon={<AppointmentIcon />}
                        color="secondary"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            variant="text"
                            startIcon={<RefreshIcon />}
                            onClick={fetchDashboardData}
                        >
                            Refresh Data
                        </Button>
                    </Paper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Coordination Tasks
                        </Typography>
                        <Divider sx={{ mb: 4 }} />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    startIcon={<RegisterIcon />}
                                    onClick={() => navigate('/patients/new')}
                                    sx={{ height: 100, borderRadius: 3, bgcolor: 'primary.main' }}
                                >
                                    Register New Patient
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    startIcon={<ScheduleIcon />}
                                    onClick={() => navigate('/appointments/new')}
                                    sx={{ height: 100, borderRadius: 3, bgcolor: 'secondary.main' }}
                                >
                                    Schedule Appointment
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="large"
                                    startIcon={<PatientIcon />}
                                    onClick={() => navigate('/patients')}
                                    sx={{ height: 100, borderRadius: 3 }}
                                >
                                    Manage Patients
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="large"
                                    startIcon={<AppointmentIcon />}
                                    onClick={() => navigate('/appointments')}
                                    sx={{ height: 100, borderRadius: 3 }}
                                >
                                    Appointment List
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default NurseDashboard;
