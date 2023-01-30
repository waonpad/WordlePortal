import { createTheme } from '@mui/material/styles';
import { green, grey, yellow } from '@mui/material/colors';

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        //   xs: false;
        //   sm: false;
        smd: true;
        //   md: false;
        //   lg: false;
        //   xl: false;
    }
}

export const globalTheme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            smd: 769,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    palette: {
        // mode: 'dark',
        primary: {
            main: green[400],
            contrastText: '#fff'
        },
        background: {
            default: '#f5f5f5',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                '&.swal-button': {backgroundColor: green[400]}
            }
        },
        MuiBackdrop: {
            defaultProps: {
                sx: {backgroundColor: '#f5f5f5'}
            }
        },
        MuiContainer: {
            defaultProps: {
                sx: {pl: 1, pr: 1, '@media (min-width: 600px)': {pl: 1, pr: 1}}
            }
        },
        MuiOutlinedInput: {
            defaultProps: {
                sx: {background: '#fff'}
            }
        },
        MuiList: {
            defaultProps: {
                disablePadding: true
            }
        },
    },
});