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
import { useAuth } from '@/contexts/AuthContext';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { WordleLobbyProps } from '@/wordle/types/WordleType';

function WordleLobby(props: WordleLobbyProps): React.ReactElement {
    const {classes, game_status, firebase_game_data, handleGameStart} = props;

    const auth = useAuth();

    return (
        <Container maxWidth={'md'}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Stack spacing={2} direction="row">
                        {Object.keys(firebase_game_data.users).filter((key) => (
                            firebase_game_data.users[key].status === 'connect'
                        )).map((key, index) => (
                            <Chip key={index} label={firebase_game_data.users[key].user.name} />
                        ))}
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant='contained'
                        disabled={
                            auth!.user!.id === firebase_game_data.host ? false //自分がゲーム作成者ならstartできる
                            :
                            (`u${firebase_game_data.host}` in Object.keys(firebase_game_data.users).filter((key) => (
                                firebase_game_data.users[key].status === 'connect'
                            ))) === false
                            &&
                            `u${auth!.user!.id.toString()}` === Object.keys(firebase_game_data.users).filter((key) => (
                                firebase_game_data.users[key].status === 'connect'
                            ))[0] ? false // ゲーム作成者が居ない場合、idが若いユーザーがstartできる
                            :
                            true
                        }
                        onClick={handleGameStart}
                    >
                        Game Start
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )
}

export default WordleLobby;