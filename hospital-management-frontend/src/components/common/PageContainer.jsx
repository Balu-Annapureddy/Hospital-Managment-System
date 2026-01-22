import React from 'react';
import { Box, Typography, Container, Breadcrumbs, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

/**
 * PageContainer component for consistent page layout
 */
const PageContainer = ({ title, subtitle, breadcrumbs, children }) => {
    return (
        <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                {breadcrumbs && (
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        aria-label="breadcrumb"
                        sx={{ mb: 1.5 }}
                    >
                        {breadcrumbs.map((bc, index) => (
                            index === breadcrumbs.length - 1 ? (
                                <Typography key={bc.label} color="text.primary" variant="body2">
                                    {bc.label}
                                </Typography>
                            ) : (
                                <Link
                                    key={bc.label}
                                    underline="hover"
                                    color="inherit"
                                    href={bc.path}
                                    variant="body2"
                                >
                                    {bc.label}
                                </Link>
                            )
                        ))}
                    </Breadcrumbs>
                )}
                <Typography variant="h4" gutterBottom component="h1">
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="body1" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </Box>
            <Box animation-name="fade-in">
                {children}
            </Box>
        </Container>
    );
};

export default PageContainer;
