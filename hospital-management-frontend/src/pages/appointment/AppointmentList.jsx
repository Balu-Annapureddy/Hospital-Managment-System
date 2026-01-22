import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Button,
    Typography,
    Chip,
    Stack,
    Tooltip,
    IconButton,
    TextField,
    MenuItem
} from '@mui/material';
import {
    Add as AddIcon,
    CheckCircle as CompleteIcon,
    Cancel as CancelIcon,
    Refresh as RefreshIcon,
    CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import PageContainer from '../../components/common/PageContainer';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import appointmentAPI from '../../api/appointmentAPI';
import { useAuth } from '../../auth/AuthContext';

/**
 * AppointmentList component for viewing and managing clinical visits
 */
const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Dialog state
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [updating, setUpdating] = useState(false);

    const navigate = useNavigate();
    const { hasAnyRole, hasRole } = useAuth();

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            let data;
            if (statusFilter === 'ALL') {
                data = await appointmentAPI.getAllAppointments(page, size);
            } else {
                data = await appointmentAPI.getAppointmentsByStatus(statusFilter, page, size);
            }
            setAppointments(data.content);
            setTotalElements(data.totalElements);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    }, [page, size, statusFilter]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            setUpdating(true);
            await appointmentAPI.updateAppointmentStatus(id, { status });
            fetchAppointments();
            setCancelDialogOpen(false);
        } catch (err) {
            console.error('Error updating appointment status:', err);
        } finally {
            setUpdating(false);
            setSelectedAppointment(null);
        }
    };

    const columns = [
        {
            id: 'appointmentDate',
            label: 'Date & Time',
            minWidth: 180,
            render: (row) => (
                <Box>
                    <Typography variant="body2" fontWeight="600">
                        {format(new Date(row.appointmentDate), 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {format(new Date(row.appointmentDate), 'hh:mm a')}
                    </Typography>
                </Box>
            )
        },
        {
            id: 'patient',
            label: 'Patient',
            minWidth: 180,
            render: (row) => (
                <Box>
                    <Typography
                        variant="body2"
                        fontWeight="500"
                        sx={{ cursor: 'pointer', color: 'primary.main' }}
                        onClick={() => navigate(`/patients/${row.patient.id}`)}
                    >
                        {row.patient.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{row.patient.patientId}</Typography>
                </Box>
            )
        },
        {
            id: 'doctor',
            label: 'Doctor',
            minWidth: 150,
            render: (row) => `Dr. ${row.doctor.name}`
        },
        {
            id: 'reason',
            label: 'Reason',
            minWidth: 200,
            render: (row) => (
                <Typography variant="body2" sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {row.reason}
                </Typography>
            )
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 120,
            render: (row) => {
                let color = 'primary';
                if (row.status === 'COMPLETED') color = 'success';
                if (row.status === 'CANCELLED') color = 'error';
                return <Chip label={row.status} size="small" color={color} variant="outlined" sx={{ fontWeight: 600 }} />;
            }
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 120,
            align: 'right',
            render: (row) => (
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {row.status === 'SCHEDULED' && hasAnyRole(['NURSE', 'DOCTOR', 'ADMIN']) && (
                        <>
                            <Tooltip title="Mark Completed">
                                <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => handleStatusUpdate(row.id, 'COMPLETED')}
                                >
                                    <CompleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel Appointment">
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                        setSelectedAppointment(row);
                                        setCancelDialogOpen(true);
                                    }}
                                >
                                    <CancelIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    {row.status === 'COMPLETED' && hasRole('DOCTOR') && (
                        <Button
                            size="small"
                            variant="text"
                            startIcon={<AddIcon />}
                            onClick={() => navigate(`/medical-records/new?appointmentId=${row.id}&patientId=${row.patient.id}`)}
                        >
                            Add Record
                        </Button>
                    )}
                </Stack>
            )
        },
    ];

    return (
        <PageContainer
            title="Appointments"
            subtitle="Manage clinical visit schedules and status"
            breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Appointments' }]}
        >
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                    select
                    label="Filter by Status"
                    size="small"
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(0);
                    }}
                    sx={{ width: 180, bgcolor: 'background.paper' }}
                >
                    <MenuItem value="ALL">All Appointments</MenuItem>
                    <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                    <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </TextField>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh">
                        <IconButton onClick={fetchAppointments} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    {hasAnyRole(['NURSE', 'ADMIN']) && (
                        <Button
                            variant="contained"
                            startIcon={<CalendarIcon />}
                            onClick={() => navigate('/appointments/new')}
                        >
                            Schedule Appointment
                        </Button>
                    )}
                </Box>
            </Box>

            <DataTable
                columns={columns}
                data={appointments}
                totalElements={totalElements}
                page={page}
                size={size}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                loading={loading}
            />

            {/* Cancellation Confirmation */}
            <ConfirmDialog
                open={cancelDialogOpen}
                title="Cancel Appointment"
                message={`Are you sure you want to cancel the appointment for ${selectedAppointment?.patient.name}? This action cannot be undone.`}
                confirmText="Yes, Cancel"
                cancelText="No, Keep"
                color="error"
                loading={updating}
                onConfirm={() => handleStatusUpdate(selectedAppointment.id, 'CANCELLED')}
                onCancel={() => {
                    setCancelDialogOpen(false);
                    setSelectedAppointment(null);
                }}
            />
        </PageContainer>
    );
};

export default AppointmentList;
