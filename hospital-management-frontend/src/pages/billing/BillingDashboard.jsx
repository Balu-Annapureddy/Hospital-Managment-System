import React, { useState, useEffect } from 'react';
import { Grid, Box, Paper, Typography, CircularProgress, Alert, Button, Divider, Stack } from '@mui/material';
import {
    Receipt as BillIcon,
    Payments as PaymentIcon,
    MonetizationOn as RevenueIcon,
    PendingActions as PendingIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import PageContainer from '../../components/common/PageContainer';
import StatCard from '../../components/common/StatCard';
import dashboardAPI from '../../api/dashboardAPI';

/**
 * BillingDashboard component
 */
const BillingDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await dashboardAPI.getBillingDashboard();
            setStats(data);
            setError('');
        } catch (err) {
            console.error('Error fetching billing dashboard:', err);
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
            title="Revenue Dashboard"
            subtitle="Financial overview and billing operation metrics."
        >
            <Grid container spacing={3}>
                {/* Stats Cards Row 1: Counts */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Bills"
                        value={stats?.totalBills || 0}
                        icon={<BillIcon />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pending Payments"
                        value={stats?.pendingBills || 0}
                        icon={<PendingIcon />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Revenue today"
                        value={`₹${stats?.revenueToday?.toLocaleString() || 0}`}
                        icon={<RevenueIcon />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Outstanding"
                        value={`₹${stats?.outstandingAmount?.toLocaleString() || 0}`}
                        icon={<PaymentIcon />}
                        color="error"
                    />
                </Grid>

                {/* Financial Highlights */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Monthly Revenue Performance
                        </Typography>
                        <Divider sx={{ mb: 4 }} />
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>Cumulative Revenue (This Month)</Typography>
                                    <Typography variant="h4" fontWeight="700" color="success.main">
                                        ₹{stats?.revenueThisMonth?.toLocaleString() || 0}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>Cumulative Total Revenue (All Time)</Typography>
                                    <Typography variant="h4" fontWeight="700" color="primary.main">
                                        ₹{stats?.totalRevenue?.toLocaleString() || 0}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Billing Actions
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Stack spacing={2}>
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={<AddIcon />}
                                onClick={() => navigate('/billing/new')}
                            >
                                Generate New Bill
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                size="large"
                                startIcon={<PendingIcon />}
                                onClick={() => navigate('/billing')}
                            >
                                Track Pending Payments
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                size="large"
                                startIcon={<BillIcon />}
                                onClick={() => navigate('/billing')}
                            >
                                View Invoice Archive
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </PageContainer>
    );
};

export default BillingDashboard;
