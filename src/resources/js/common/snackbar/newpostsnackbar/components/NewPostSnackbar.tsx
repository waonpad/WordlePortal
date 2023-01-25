import React, {useEffect} from 'react';
import { Button, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@material-ui/icons/Close';
import { NewPostSnackbarProps } from '@/common/snackbar/newpostsnackbar/types/NewPostSnackbarType';
import { globalTheme } from '@/Theme';

function NewPostSnackbar(props: NewPostSnackbarProps): React.ReactElement {
    const {open, handleApiGet, handleClose, message, position} = props;

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            autoHideDuration={null}
            onClose={handleClose}
            message={message}
            action={
                <React.Fragment>
                    <Button color="inherit" size="small" onClick={handleApiGet}>
                        Reload
                    </Button>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }
            ContentProps={{
                sx: {
                    background: globalTheme.palette.primary.main
                }
            }}
            sx={{
                '&.MuiSnackbar-root': {
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    zIndex: 2, // headerの下に隠れる
                }
            }}
        />
    )
}

export default NewPostSnackbar;