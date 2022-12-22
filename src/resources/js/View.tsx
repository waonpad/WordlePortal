import React, { useEffect, useState, ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { green, grey, yellow } from '@mui/material/colors';

type Props = {
    children: ReactNode;
}

const theme = createTheme({
    palette: {
        // mode: 'dark',
        primary: {
            main: green[400]
        },
        background: {
            default: '#f5f5f5',
        },
    }
});

function View({children}: Props): React.ReactElement {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}

export default View;