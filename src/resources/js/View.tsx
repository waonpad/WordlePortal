import React, { useEffect, useState, ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { green, grey, yellow } from '@mui/material/colors';

import { globalTheme } from './Theme';

type Props = {
    children: ReactNode;
}

function View({children}: Props): React.ReactElement {

    return (
        <ThemeProvider theme={globalTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}

export default View;