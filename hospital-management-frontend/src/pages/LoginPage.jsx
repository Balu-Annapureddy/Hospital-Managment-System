import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Container,
    Avatar
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    LocalHospital as HospitalIcon
} from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * LoginPage for authentication
 */
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const result = await login({ username, password });

        if (result.success) {
            // Redirect to the page they were trying to visit, or their role dashboard
            if (from === '/') {
                navigate(`/${result.user.role.toLowerCase()}/dashboard`);
            } else {
                navigate(from, { replace: true });
            }
        } else {
            setError(result.error);
            setSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                p: 2
            }}
        >
            <Container maxWidth="sm">
                <Card sx={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)', borderRadius: 4 }}>
                    <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Avatar
                                sx={{
                                    bgcolor: 'primary.main',
                                    width: 64,
                                    height: 64,
                                    margin: '0 auto',
                                    mb: 2
                                }}
                            >
                                <HospitalIcon sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Typography variant="h4" gutterBottom fontWeight="700" color="primary">
                                MediConnect
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Hospital Management System Login
                            </Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Username"
                                margin="normal"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={submitting}
                                autoFocus
                                InputProps={{
                                    sx: { borderRadius: 2 }
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                margin="normal"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={submitting}
                                InputProps={{
                                    sx: { borderRadius: 2 },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                                disabled={submitting}
                                sx={{
                                    mt: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                                }}
                            >
                                {submitting ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                            </Button>
                        </form>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Need help? Contact system administrator
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default LoginPage;
