import React, { useState } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const drawerWidth = 260;

/**
 * MainLayout component wrapping the application shell
 */
const MainLayout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Topbar onDrawerToggle={handleDrawerToggle} />

            <Sidebar
                mobileOpen={mobileOpen}
                onDrawerToggle={handleDrawerToggle}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 0,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Toolbar /> {/* Spacer for AppBar */}
                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;
