import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress
} from '@mui/material';

/**
 * Reusable ConfirmDialog component
 */
const ConfirmDialog = ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    color = "primary"
}) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            PaperProps={{
                sx: { borderRadius: 2, minWidth: 300 }
            }}
        >
            <DialogTitle id="confirm-dialog-title" fontWeight="600">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description" color="text.primary">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onCancel} color="inherit" disabled={loading}>
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    color={color}
                    variant="contained"
                    autoFocus
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={16} color="inherit" />}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
