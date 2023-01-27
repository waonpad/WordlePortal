import React from 'react';
import { Fab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';

export type FabWordleCreateProps = {
}

function FabWordleCreate(props: FabWordleCreateProps): React.ReactElement {
    return (
        <Fab
            variant='extended'
            color='primary'
            sx={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                textDecoration: 'none',
                ':hover': {
                    color: '#fff'
                }
            }}
            component={Link}
            to={'/wordle/create'}
        >
            <EditIcon sx={{mr: 1}} />
            Wordle Create
        </Fab>
    )
}

export default FabWordleCreate;