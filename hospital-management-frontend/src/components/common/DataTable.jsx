import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';

/**
 * Reusable DataTable component
 */
const DataTable = ({
    columns,
    data,
    totalElements,
    page,
    size,
    onPageChange,
    onRowsPerPageChange,
    loading,
    emptyMessage = "No records found"
}) => {
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="data table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 10 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : data && data.length > 0 ? (
                            data.map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.render ? column.render(row) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 10 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        {emptyMessage}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalElements || 0}
                rowsPerPage={size}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </Paper>
    );
};

export default DataTable;
