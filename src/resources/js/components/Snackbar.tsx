import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Snackbar as MuiSnackbar } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { SnackbarProps } from '../@types/SnackbatType';

function Snackbar(props: SnackbarProps): React.ReactElement {

    return (
        <MuiSnackbar
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

export default Snackbar;