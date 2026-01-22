import React from 'react';
import { Card, CardContent, Typography, Box, Icon, Avatar } from '@mui/material';

/**
 * StatCard component for dashboard statistics
 */
const StatCard = ({ title, value, icon, color, trend }) => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        sx={{
                            bgcolor: `${color}.light`,
                            color: `${color}.main`,
                            width: 48,
                            height: 48,
                            mr: 2
                        }}
                    >
                        {icon}
                    </Avatar>
                    <Box>
                        <Typography color="text.secondary" variant="body2" fontWeight="500">
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight="600">
                            {value}
                        </Typography>
                    </Box>
                </Box>
                {trend && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: trend.isPositive ? 'success.main' : 'error.main',
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: '600'
                            }}
                        >
                            {trend.isPositive ? '+' : '-'}{trend.value}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            since last month
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default StatCard;
