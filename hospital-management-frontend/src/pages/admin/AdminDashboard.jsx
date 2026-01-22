import React, { useState, useEffect } from 'react';
import { Grid, Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import {
    People as PeopleIcon,
    EventAvailable as AppointmentIcon,
    MonetizationOn as RevenueIcon,
    PendingActions as PendingIcon
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend
} from 'recharts';

import PageContainer from '../../components/common/PageContainer';
import StatCard from '../../components/common/StatCard';
import dashboardAPI from '../../api/dashboardAPI';

/**
 * AdminDashboard component
 */
const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const dashboardStats = await dashboardAPI.getAdminDashboard();
            setData(dashboardStats);
            setError('');
        } catch (err) {
            console.error('Error fetching admin dashboard:', err);
            setError('Failed to load dashboard statistics. Please try again later.');
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

    if (error) {
        return (
            <PageContainer title="Admin Dashboard">
                <Alert severity="error">{error}</Alert>
            </PageContainer>
        );
    }

    // Mock chart data (since the backend logic for historical trends might be simple for now)
    // In a real app, we'd have another API call for this.
    const appointmentTrend = [
        { name: 'Mon', count: 12 },
        { name: 'Tue', count: 18 },
        { name: 'Wed', count: 15 },
        { name: 'Thu', count: 22 },
        { name: 'Fri', count: 30 },
        { name: 'Sat', count: 10 },
        { name: 'Sun', count: 5 },
    ];

    const revenueTrend = [
        { name: 'Jul', revenue: 4000 },
        { name: 'Aug', revenue: 3000 },
        { name: 'Sep', revenue: 2000 },
        { name: 'Oct', revenue: 2780 },
        { name: 'Nov', revenue: 1890 },
        { name: 'Dec', revenue: 2390 },
        { name: 'Jan', revenue: data?.totalRevenue || 3490 },
    ];

    return (
        <PageContainer
            title="Hospital Overview"
            subtitle="Welcome back, Administrator. Here's what's happening today."
        >
            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Patients"
                        value={data?.totalPatients || 0}
                        icon={<PeopleIcon />}
                        color="primary"
                        trend={{ value: 12, isPositive: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Today's Appointments"
                        value={data?.todayAppointments || 0}
                        icon={<AppointmentIcon />}
                        color="secondary"
                        trend={{ value: 5, isPositive: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Revenue"
                        value={`₹${data?.totalRevenue?.toLocaleString() || 0}`}
                        icon={<RevenueIcon />}
                        color="success"
                        trend={{ value: 8, isPositive: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pending Bills"
                        value={data?.pendingBills || 0}
                        icon={<PendingIcon />}
                        color="warning"
                        trend={{ value: 2, isPositive: false }}
                    />
                </Grid>

                {/* Charts Section */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, height: '400px' }}>
                        <Typography variant="h6" gutterBottom fontWeight="600">
                            Revenue Trend (Last 7 Months)
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={revenueTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#1976d2"
                                    strokeWidth={3}
                                    dot={{ r: 6, fill: '#1976d2', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: '400px' }}>
                        <Typography variant="h6" gutterBottom fontWeight="600">
                            Appointments by Weekday
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={appointmentTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#4caf50"
                                    radius={[4, 4, 0, 0]}
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Staff Breakdown Summary */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="600">
                            Staff Breakdown
                        </Typography>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 2 }}>
                                    <Typography variant="h4" color="primary.main" fontWeight="700">
                                        {data?.totalDoctors || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                                        Doctors
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(76, 175, 80, 0.04)', borderRadius: 2 }}>
                                    <Typography variant="h4" color="secondary.main" fontWeight="700">
                                        {data?.totalNurses || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                                        Nurses
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(237, 108, 2, 0.04)', borderRadius: 2 }}>
                                    <Typography variant="h4" color="warning.main" fontWeight="700">
                                        {data?.totalBillingStaff || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                                        Billing Staff
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default AdminDashboard;
