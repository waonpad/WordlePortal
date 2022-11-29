import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { SnackbarPrimaryProps } from '../types/SnackbarPrimaryType';

function SnackbarPrimary(props: SnackbarPrimaryProps): React.ReactElement {

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={props.open}
            autoHideDuration={6000}
            onClose={props.handleClose}
            message={props.message}
            action={
                <React.Fragment>
                    <Button color="secondary" size="small" onClick={props.handleClose}>
                        OK
                    </Button>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={props.handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }
        />
    )
}

export default SnackbarPrimary;