import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Button } from '@mui/material'
import { DialogPrimaryProps } from '../types/DialogPrimaryType';

function DialogPrimary(props: DialogPrimaryProps): React.ReactElement {
    const { onClose, title, message } = props

    return (
        <Dialog
            open
            onClose={() => onClose('close')}
            PaperProps={{
                elevation: 0,
                style: {
                    border: '1.5px solid rgb(204, 204, 204)'
                }
            }}
            BackdropProps={{
                style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.75)'
                },
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose('ok')}>OK</Button>
                <Button onClick={() => onClose('cancel')} autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogPrimary;