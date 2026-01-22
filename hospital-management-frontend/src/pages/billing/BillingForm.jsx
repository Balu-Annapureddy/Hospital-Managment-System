import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Divider,
    CircularProgress,
    Alert,
    IconButton,
    Stack,
    Autocomplete,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Receipt as BillIcon,
    Person as PersonIcon,
    CurrencyRupee as CurrencyIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

import PageContainer from '../../components/common/PageContainer';
import billingAPI from '../../api/billingAPI';
import patientAPI from '../../api/patientAPI';
import appointmentAPI from '../../api/appointmentAPI';

/**
 * BillingForm component for generating itemized invoices
 */
const BillingForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialPatientId = queryParams.get('patientId');
    const initialAppointmentId = queryParams.get('appointmentId');

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [items, setItems] = useState([
        { description: 'Consultation Fee', amount: '500' }
    ]);

    const [formData, setFormData] = useState({
        patientId: initialPatientId || '',
        appointmentId: initialAppointmentId || '',
        billDate: new Date().toISOString().slice(0, 16)
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await patientAPI.getAllPatients(0, 100);
            setPatients(data.content);

            if (initialPatientId) {
                const patient = data.content.find(p => p.id.toString() === initialPatientId);
                if (patient) setSelectedPatient(patient);
            }
        } catch (err) {
            console.error('Error fetching patients:', err);
            setError('Failed to load patient list.');
        } finally {
            setLoading(false);
        }
    };

    const handlePatientChange = (event, newValue) => {
        setSelectedPatient(newValue);
        setFormData(prev => ({ ...prev, patientId: newValue ? newValue.id : '' }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', amount: '' }]);
    };

    const removeItem = (index) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            if (!formData.patientId) throw new Error('Please select a patient.');

            const billData = {
                patientId: formData.patientId,
                appointmentId: formData.appointmentId || null,
                billDate: new Date(formData.billDate).toISOString(),
                items: items.map(item => ({
                    description: item.description,
                    amount: parseFloat(item.amount)
                }))
            };

            await billingAPI.generateBill(billData);
            setSuccess('Bill generated successfully!');
            setTimeout(() => navigate('/billing'), 1500);
        } catch (err) {
            console.error('Error generating bill:', err);
            setError(err.response?.data?.message || err.message || 'Failed to generate bill.');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <PageContainer
            title="Generate Invoice"
            subtitle="Create itemized clinical bill"
            breadcrumbs={[
                { label: 'Dashboard', path: '/' },
                { label: 'Billing', path: '/billing' },
                { label: 'Generate' }
            ]}
        >
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/billing')}
                    sx={{ color: 'text.secondary' }}
                >
                    Back to List
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <BillIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6" fontWeight="600">Bill Header</Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    options={patients}
                                    getOptionLabel={(option) => `${option.fullName} (${option.patientId})`}
                                    value={selectedPatient}
                                    onChange={handlePatientChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select Patient" required />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Bill Date"
                                    type="datetime-local"
                                    name="billDate"
                                    value={formData.billDate}
                                    onChange={(e) => setFormData(prev => ({ ...prev, billDate: e.target.value }))}
                                    required
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CurrencyIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6" fontWeight="600">Line Items</Typography>
                            </Box>
                            <Button startIcon={<AddIcon />} onClick={addItem} size="small" variant="outlined">
                                Add Item
                            </Button>
                        </Box>

                        <Table size="small" sx={{ mb: 3 }}>
                            <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                                <TableRow>
                                    <TableCell width="60%">Description</TableCell>
                                    <TableCell width="30%">Amount (₹)</TableCell>
                                    <TableCell width="10%" align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="e.g. Consultation, Blood Test"
                                                value={item.description}
                                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                required
                                                variant="standard"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="number"
                                                placeholder="0.00"
                                                value={item.amount}
                                                onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                                                required
                                                variant="standard"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" color="error" onClick={() => removeItem(index)} disabled={items.length === 1}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow sx={{ bgcolor: 'rgba(25, 118, 210, 0.02)' }}>
                                    <TableCell sx={{ fontWeight: 700 }}>Total Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }} colSpan={2}>
                                        ₹ {calculateTotal().toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>

                    <Grid item xs={12}>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="outlined" onClick={() => navigate('/billing')}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                disabled={submitting}
                            >
                                Generate Bill
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </PageContainer>
    );
};

export default BillingForm;
