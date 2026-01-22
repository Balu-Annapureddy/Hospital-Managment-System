import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Avatar,
    Chip,
    Button,
    Tooltip
} from '@mui/material';
import {
    Menu as MenuIcon,
    Logout as LogoutIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';

/**
 * Topbar component for the application shell
 */
const Topbar = ({ onDrawerToggle }) => {
    const { user, logout } = useAuth();

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        MediConnect
                    </Typography>
                    <Typography variant="subtitle2" sx={{ ml: 1, display: { xs: 'none', sm: 'block' }, color: 'text.secondary' }}>
                        | Hospital Management System
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Notifications">
                        <IconButton color="inherit" sx={{ mr: 1 }}>
                            <NotificationsIcon />
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right', mr: 1.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {user?.fullName}
                            </Typography>
                            <Chip
                                label={user?.role}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ height: 20, fontSize: '0.625rem', fontWeight: 700 }}
                            />
                        </Box>
                        <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                            <PersonIcon />
                        </Avatar>
                    </Box>

                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<LogoutIcon />}
                        onClick={logout}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;
