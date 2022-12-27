import React, { useEffect, useState, ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { green, grey, yellow } from '@mui/material/colors';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { globalTheme } from './Theme';

type Props = {
    children: ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({}),
);

function View({children}: Props): React.ReactElement {

    // これが無いといけない
    const classes = useStyles();

    return (
        <ThemeProvider theme={globalTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}

export default View;