import React, { useState, useEffect } from 'react';
import swal from "sweetalert";
import ReactDOM from 'react-dom';
import { Button, IconButton, Card } from '@material-ui/core';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Link, useParams, useHistory } from "react-router-dom";
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form";
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
// import Chip from '@mui/material/Chip';
import Chip from "@material-ui/core/Chip"; // v4
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { LoadingButton } from '@mui/lab';
import { alpha, createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { WordleTypingProps } from '../../../../types/WordleType';

function WordleTyping(props: WordleTypingProps): React.ReactElement {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Grid container spacing={0} sx={{alignItems: 'center', justifyContent: 'center'}}>
                <Grid item sx={{width: '400px'}}>
                    <TextField
                        fullWidth
                        id="wordle-typing"
                        label="Input Here"
                        autoComplete="wordle-typing"
                        value={props.input_stack.map((character: any) => (character['character'])).join('')}
                        disabled={!props.turn_flag}
                        onChange={props.handleTypingStack}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default WordleTyping;