import React, { useEffect, useState } from 'react';
import { Fab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useLocation } from 'react-router-dom';

export type FabWordleCreateProps = {
}

function FabWordleCreate(props: FabWordleCreateProps): React.ReactElement {

    const location = useLocation();
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        location.pathname.substring(0, 6) === '/user/' ? setOpen(false)
        :
        location.pathname.substring(0, 18) === '/wordle/game/play/' ? setOpen(false)
        :
        location.pathname.substring(0, 9) === '/register' ? setOpen(false)
        :
        location.pathname.substring(0, 6) === '/login' ? setOpen(false)
        :
        location.pathname.substring(0, 14) === '/wordle/create' ? setOpen(false)
        :
        location.pathname.substring(0, 15) === '/wordle/manage/' ? setOpen(false)
        :
        setOpen(true)
    }, [location])

    return (
        <Fab
            variant='extended'
            color='primary'
            sx={{
                display: open ? 'flex' : 'none',
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