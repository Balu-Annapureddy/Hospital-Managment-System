import React from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    EventNote as EventNoteIcon,
    Description as DescriptionIcon,
    Receipt as ReceiptIcon,
    Assessment as AssessmentIcon,
    ManageAccounts as ManageAccountsIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const drawerWidth = 260;

/**
 * Sidebar component with role-based navigation items
 */
const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Define menu items based on roles
    const menuConfig = [
        {
            title: 'Dashboard',
            path: `/${user?.role.toLowerCase()}/dashboard`,
            icon: <DashboardIcon />,
            roles: ['ADMIN', 'DOCTOR', 'NURSE', 'BILLING']
        },
        {
            title: 'Patients',
            path: '/patients',
            icon: <PeopleIcon />,
            roles: ['ADMIN', 'DOCTOR', 'NURSE', 'BILLING']
        },
        {
            title: 'Appointments',
            path: '/appointments',
            icon: <EventNoteIcon />,
            roles: ['ADMIN', 'DOCTOR', 'NURSE']
        },
        {
            title: 'Medical Records',
            path: '/medical-records',
            icon: <DescriptionIcon />,
            roles: ['ADMIN', 'DOCTOR']
        },
        {
            title: 'Billing',
            path: '/billing',
            icon: <ReceiptIcon />,
            roles: ['ADMIN', 'BILLING']
        },
        {
            title: 'Reports',
            path: '/reports',
            icon: <AssessmentIcon />,
            roles: ['ADMIN', 'BILLING']
        },
        {
            title: 'User Management',
            path: '/admin/users',
            icon: <ManageAccountsIcon />,
            roles: ['ADMIN']
        }
    ];

    const filteredMenu = menuConfig.filter(item => item.roles.includes(user?.role));

    const drawer = (
        <div>
            <Toolbar /> {/* Spacer for AppBar */}
            <Box sx={{ overflow: 'auto', mt: 2 }}>
                <List sx={{ px: 1.5 }}>
                    {filteredMenu.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => {
                                        navigate(item.path);
                                        if (mobileOpen) onDrawerToggle();
                                    }}
                                    sx={{
                                        borderRadius: 2,
                                        bgcolor: isActive ? 'primary.light' : 'transparent',
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                        '&:hover': {
                                            bgcolor: isActive ? 'primary.light' : 'rgba(25, 118, 210, 0.04)',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: isActive ? 'primary.main' : 'inherit',
                                            minWidth: 40
                                        },
                                        '& .MuiTypography-root': {
                                            fontWeight: isActive ? 600 : 500,
                                        }
                                    }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </div>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>

            {/* Desktop drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: '1px solid rgba(0,0,0,0.08)'
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
