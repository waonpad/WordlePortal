import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, grey, yellow } from '@mui/material/colors';

export const globalTheme = createTheme({
    palette: {
        // mode: 'dark',
        primary: {
            main: green[400],
            contrastText: '#fff'
        },
        background: {
            default: '#f5f5f5',
        },
    }
});