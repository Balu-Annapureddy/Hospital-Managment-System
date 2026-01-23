import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Button,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    Chip,
    Stack,
    Typography
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import PageContainer from '../../components/common/PageContainer';
import DataTable from '../../components/common/DataTable';
import patientAPI from '../../api/patientAPI';
import { useAuth } from '../../auth/AuthContext';

/**
 * PatientList component for displaying and managing patients
 */
const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const { hasRole } = useAuth();

    const fetchPatients = useCallback(async () => {
        try {
            setLoading(true);
            let data;
            if (searchQuery) {
                data = await patientAPI.searchPatients(searchQuery, page, size);
            } else {
                data = await patientAPI.getAllPatients(page, size);
            }
            setPatients(data.content);
            setTotalElements(data.totalElements);
        } catch (err) {
            console.error('Error fetching patients:', err);
        } finally {
            setLoading(false);
        }
    }, [page, size, searchQuery]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(0); // Reset to first page on search
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const columns = [
        {
            id: 'patientId',
            label: 'ID',
            minWidth: 100,
            render: (row) => <Typography variant="body2" fontWeight="600" color="primary">{row.patientId}</Typography>
        },
        {
            id: 'fullName',
            label: 'Name',
            minWidth: 200,
            render: (row) => (
                <Box>
                    <Typography variant="body2" fontWeight="500">{row.fullName}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.gender}, {row.age} yrs</Typography>
                </Box>
            )
        },
        { id: 'phone', label: 'Phone', minWidth: 130 },
        {
            id: 'bloodGroup',
            label: 'Blood',
            minWidth: 80,
            render: (row) => (
                <Chip
                    label={row.bloodGroup || 'N/A'}
                    size="small"
                    variant="outlined"
                    color={row.bloodGroup ? "error" : "default"}
                    sx={{ fontWeight: 600 }}
                />
            )
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 150,
            align: 'right',
            render: (row) => (
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="View Profile">
                        <IconButton size="small" onClick={() => navigate(`/patients/${row.id}`)} color="info">
                            <ViewIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    {hasRole('NURSE') || hasRole('ADMIN') ? (
                        <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => navigate(`/patients/edit/${row.id}`)} color="primary">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ) : null}
                    {hasRole('ADMIN') && (
                        <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => {/* handle delete */ }} color="error">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            )
        },
    ];

    return (
        <PageContainer
            title="Patients"
            subtitle="View and manage patient hospital records"
            breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Patients' }]}
        >
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                    placeholder="Search by name, ID or phone..."
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ width: { xs: '100%', sm: 350 }, bgcolor: 'background.paper' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh">
                        <IconButton onClick={fetchPatients} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    {(hasRole('NURSE') || hasRole('ADMIN')) && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/patients/new')}
                        >
                            Register Patient
                        </Button>
                    )}
                </Box>
            </Box>

            <DataTable
                columns={columns}
                data={patients}
                totalElements={totalElements}
                page={page}
                size={size}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                loading={loading}
            />
        </PageContainer>
    );
};

export default PatientList;
