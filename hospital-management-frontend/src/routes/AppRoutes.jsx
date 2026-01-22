import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';

// Dashboards
import AdminDashboard from '../pages/admin/AdminDashboard';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import NurseDashboard from '../pages/nurse/NurseDashboard';
import BillingDashboard from '../pages/billing/BillingDashboard';

// Patient Management
import PatientList from '../pages/patient/PatientList';
import PatientProfile from '../pages/patient/PatientProfile';
import PatientForm from '../pages/patient/PatientForm';

// Appointment Management
import AppointmentList from '../pages/appointment/AppointmentList';
import ScheduleAppointment from '../pages/appointment/ScheduleAppointment';

// Medical Records
import MedicalRecordForm from '../pages/medical-record/MedicalRecordForm';

// Billing
import BillingList from '../pages/billing/BillingList';
import BillingForm from '../pages/billing/BillingForm';

import { Typography, Box } from '@mui/material';

/**
 * AppRoutes component defining all application routes
 */
const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes inside MainLayout */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/login" replace />} />

                {/* Dashboard Routes */}
                <Route path="admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="doctor/dashboard" element={<ProtectedRoute roles={['DOCTOR']}><DoctorDashboard /></ProtectedRoute>} />
                <Route path="nurse/dashboard" element={<ProtectedRoute roles={['NURSE']}><NurseDashboard /></ProtectedRoute>} />
                <Route path="billing/dashboard" element={<ProtectedRoute roles={['BILLING', 'ADMIN']}><BillingDashboard /></ProtectedRoute>} />

                {/* Patient Management Routes */}
                <Route path="patients" element={<PatientList />} />
                <Route path="patients/new" element={<ProtectedRoute roles={['NURSE', 'ADMIN']}><PatientForm /></ProtectedRoute>} />
                <Route path="patients/edit/:id" element={<ProtectedRoute roles={['NURSE', 'ADMIN']}><PatientForm /></ProtectedRoute>} />
                <Route path="patients/:id" element={<PatientProfile />} />

                {/* Appointment Management Routes */}
                <Route path="appointments" element={<AppointmentList />} />
                <Route path="appointments/new" element={<ProtectedRoute roles={['NURSE', 'DOCTOR', 'ADMIN']}><ScheduleAppointment /></ProtectedRoute>} />

                {/* Medical Record Routes */}
                <Route path="medical-records/new" element={<ProtectedRoute roles={['DOCTOR', 'ADMIN']}><MedicalRecordForm /></ProtectedRoute>} />
                <Route path="medical-records" element={
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h4" fontWeight="600">Clinical History</Typography>
                        <Typography variant="body1" color="text.secondary">Use search to find patient medical records.</Typography>
                    </Box>
                } />

                {/* Billing Management Routes */}
                <Route path="billing" element={<BillingList />} />
                <Route path="billing/new" element={<ProtectedRoute roles={['BILLING', 'ADMIN']}><BillingForm /></ProtectedRoute>} />

                {/* Placeholder Routes */}
                <Route path="reports" element={
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h4" fontWeight="600">Reports & Analytics</Typography>
                        <Typography variant="body1" color="text.secondary">Detailed system reports are available in the Admin and Billing dashboards.</Typography>
                    </Box>
                } />

                <Route path="admin/users" element={
                    <Box sx={{ p: 4 }}>
                        <Typography variant="h4" fontWeight="600">User Management</Typography>
                        <Typography variant="body1" color="text.secondary">Staff management interface is under maintenance.</Typography>
                    </Box>
                } />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
