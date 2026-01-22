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
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment
} from '@mui/material';
import {
    Add as AddIcon,
    Payments as PayIcon,
    Visibility as ViewIcon,
    Refresh as RefreshIcon,
    CurrencyRupee as CurrencyIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import PageContainer from '../../components/common/PageContainer';
import DataTable from '../../components/common/DataTable';
import billingAPI from '../../api/billingAPI';
import { useAuth } from '../../auth/AuthContext';

/**
 * BillingList component for hospital revenue management
 */
const BillingList = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalElements, setTotalElements] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Payment state
    const [payDialogOpen, setPayDialogOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [payAmount, setPayAmount] = useState('');
    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();
    const { hasAnyRole } = useAuth();

    const fetchBills = useCallback(async () => {
        try {
            setLoading(true);
            let data;
            if (statusFilter === 'ALL') {
                data = await billingAPI.getAllBills(page, size);
            } else {
                // statusFilter would match PaymentStatus enum if API supported direct filter
                // for now just use overall list or specific API logic if needed
                data = await billingAPI.getAllBills(page, size);
            }
            setBills(data.content);
            setTotalElements(data.totalElements);
        } catch (err) {
            console.error('Error fetching bills:', err);
        } finally {
            setLoading(false);
        }
    }, [page, size, statusFilter]);

    useEffect(() => {
        fetchBills();
    }, [fetchBills]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleProcessPayment = async () => {
        if (!payAmount || parseFloat(payAmount) <= 0) return;

        try {
            setProcessing(true);
            await billingAPI.processPayment(selectedBill.id, {
                amount: parseFloat(payAmount),
                paymentDate: new Date().toISOString()
            });
            setPayDialogOpen(false);
            fetchBills();
        } catch (err) {
            console.error('Error processing payment:', err);
        } finally {
            setProcessing(false);
            setSelectedBill(null);
            setPayAmount('');
        }
    };

    const columns = [
        {
            id: 'billNumber',
            label: 'Bill #',
            minWidth: 100,
            render: (row) => <Typography variant="body2" fontWeight="600">{row.billNumber}</Typography>
        },
        {
            id: 'billDate',
            label: 'Date',
            minWidth: 120,
            render: (row) => format(new Date(row.billDate), 'MMM dd, yyyy')
        },
        {
            id: 'patient',
            label: 'Patient',
            minWidth: 180,
            render: (row) => (
                <Box>
                    <Typography variant="body2" fontWeight="500">{row.patient.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.patient.patientId}</Typography>
                </Box>
            )
        },
        {
            id: 'totalAmount',
            label: 'Total',
            minWidth: 100,
            render: (row) => `₹${row.totalAmount.toLocaleString()}`
        },
        {
            id: 'outstandingAmount',
            label: 'Balance',
            minWidth: 100,
            render: (row) => (
                <Typography variant="body2" color={row.outstandingAmount > 0 ? "error.main" : "success.main"} fontWeight="600">
                    ₹{row.outstandingAmount.toLocaleString()}
                </Typography>
            )
        },
        {
            id: 'paymentStatus',
            label: 'Status',
            minWidth: 100,
            render: (row) => {
                let color = 'warning';
                if (row.paymentStatus === 'PAID') color = 'success';
                if (row.paymentStatus === 'PARTIAL') color = 'info';
                return <Chip label={row.paymentStatus} size="small" color={color} variant="outlined" sx={{ fontWeight: 600 }} />;
            }
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 100,
            align: 'right',
            render: (row) => (
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="View Bill">
                        <IconButton size="small" onClick={() => {/* navigate to bill detail */ }}>
                            <ViewIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    {row.paymentStatus !== 'PAID' && hasAnyRole(['BILLING', 'ADMIN']) && (
                        <Tooltip title="Process Payment">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => {
                                    setSelectedBill(row);
                                    setPayAmount(row.outstandingAmount.toString());
                                    setPayDialogOpen(true);
                                }}
                            >
                                <PayIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            )
        },
    ];

    return (
        <PageContainer
            title="Billing & Invoices"
            subtitle="Track patient payments and outstanding revenue"
            breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Billing' }]}
        >
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                    select
                    label="Payment Status"
                    size="small"
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(0);
                    }}
                    sx={{ width: 180, bgcolor: 'background.paper' }}
                >
                    <MenuItem value="ALL">All Bills</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="PARTIAL">Partial</MenuItem>
                    <MenuItem value="PAID">Paid</MenuItem>
                </TextField>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh">
                        <IconButton onClick={fetchBills} disabled={loading}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    {hasAnyRole(['BILLING', 'ADMIN']) && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/billing/new')}
                        >
                            Generate Bill
                        </Button>
                    )}
                </Box>
            </Box>

            <DataTable
                columns={columns}
                data={bills}
                totalElements={totalElements}
                page={page}
                size={size}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                loading={loading}
            />

            {/* Payment Dialog */}
            <Dialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)}>
                <DialogTitle fontWeight="600">Process Payment</DialogTitle>
                <DialogContent sx={{ minWidth: 350 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Bill Number: {selectedBill?.billNumber}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Patient: {selectedBill?.patient.name}
                    </Typography>
                    <Typography variant="body2" fontWeight="600" sx={{ mt: 2, mb: 1 }}>
                        Outstanding Balance: ₹{selectedBill?.outstandingAmount.toLocaleString()}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Payment Amount"
                        type="number"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        sx={{ mt: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CurrencyIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setPayDialogOpen(false)} color="inherit" disabled={processing}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleProcessPayment}
                        color="primary"
                        variant="contained"
                        disabled={processing || !payAmount}
                        startIcon={processing && <CircularProgress size={16} color="inherit" />}
                    >
                        Record Payment
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default BillingList;
