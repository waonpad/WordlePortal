import React from 'react';
import { Button, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@material-ui/icons/Close';
import { SnackbarPrimaryProps } from '@/common/snackbar/snackbarprimary/types/SnackbarPrimaryType';

function SnackbarPrimary(props: SnackbarPrimaryProps): React.ReactElement {
    const {open, handleClose, message} = props;

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}
            action={
                <React.Fragment>
                    <Button color="primary" size="small" onClick={handleClose}>
                        OK
                    </Button>
                    <IconButton size="small" aria-label="close" color="primary" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }
        />
    )
}

export default SnackbarPrimary;