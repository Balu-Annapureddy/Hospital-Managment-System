import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * ProtectedRoute component to handle authentication and role-based access
 */
const ProtectedRoute = ({ children, roles }) => {
    const { user, loading, isAuthenticated, hasAnyRole } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated()) {
        // Redirect to login but save the current location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !hasAnyRole(roles)) {
        // Role not authorized, redirect to appropriate dashboard
        const dashboardPath = `/${user?.role.toLowerCase()}/dashboard`;
        return <Navigate to={dashboardPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
