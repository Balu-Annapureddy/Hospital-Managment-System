import React, { useState, useEffect } from 'react';
import { Grid, Box, Paper, Typography, CircularProgress, Alert, Button, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import {
    EventAvailable as AppointmentIcon,
    Timeline as TimelineIcon,
    CheckCircle as SummaryIcon,
    Person as PatientIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import PageContainer from '../../components/common/PageContainer';
import StatCard from '../../components/common/StatCard';
import dashboardAPI from '../../api/dashboardAPI';
import appointmentAPI from '../../api/appointmentAPI';

/**
 * DoctorDashboard component
 */
const DoctorDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const statsData = await dashboardAPI.getMyDoctorDashboard();
            setStats(statsData);
            // Use today's appointments from the dashboard stats
            setTodayAppointments(statsData.todayAppointmentsList || []);
            setError('');
        } catch (err) {
            console.error('Error fetching doctor dashboard:', err);
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
            title="Physician Portal"
            subtitle="Your clinical summary and schedule for today."
        >
            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Today's Visits"
                        value={stats?.todayAppointments || 0}
                        icon={<AppointmentIcon />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Upcoming"
                        value={stats?.upcomingAppointments || 0}
                        icon={<TimelineIcon />}
                        color="info"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Completed"
                        value={stats?.completedAppointments || 0}
                        icon={<SummaryIcon />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Patients"
                        value={stats?.totalPatientsTreated || 0}
                        icon={<PatientIcon />}
                        color="secondary"
                    />
                </Grid>

                {/* Today's Schedule */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" fontWeight="600">
                                Today's Appointments
                            </Typography>
                            <Button size="small" onClick={() => navigate('/appointments')}>View All</Button>
                        </Box>
                        <Divider />
                        {todayAppointments.length > 0 ? (
                            <List sx={{ mt: 1 }}>
                                {todayAppointments.map((apt, index) => (
                                    <React.Fragment key={apt.id}>
                                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'primary.light' }}>
                                                    {apt.patient.name[0]}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography variant="body1" fontWeight="600">
                                                            {apt.patient.name}
                                                        </Typography>
                                                        <Typography variant="caption" fontWeight="700" color="primary">
                                                            {format(new Date(apt.appointmentDate), 'hh:mm a')}
                                                        </Typography>
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {apt.reason}
                                                        </Typography>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            startIcon={<AddIcon />}
                                                            onClick={() => navigate(`/medical-records/new?appointmentId=${apt.id}&patientId=${apt.patient.id}`)}
                                                        >
                                                            Add Record
                                                        </Button>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        {index < todayAppointments.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 5 }}>
                                <Typography color="text.secondary">No appointments scheduled for today.</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Quick Actions & Recent Activity */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Medical Statistics
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 2 }}>
                            <Typography variant="h3" color="primary.main" fontWeight="700">
                                {stats?.medicalRecordsCreated || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight="500">
                                Medical Records Authored
                            </Typography>
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Clinical Shortcuts
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                            <Button fullWidth variant="outlined" startIcon={<PatientIcon />} onClick={() => navigate('/patients')}>
                                My Patients
                            </Button>
                            <Button fullWidth variant="outlined" startIcon={<AppointmentIcon />} onClick={() => navigate('/appointments')}>
                                Check Schedule
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default DoctorDashboard;
