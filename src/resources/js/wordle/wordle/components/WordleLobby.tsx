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
import { useAuth } from '../../../contexts/AuthContext';
import BackspaceIcon from '@mui/icons-material/Backspace';

type WordleLobbyProps =  {
    theme: any
    classes: any
    game: any
    game_status: any
    firebase_game_data: any
    handleGameStart: any
}

function WordleLobby(props: WordleLobbyProps): React.ReactElement {

    const auth = useAuth();

    if(!props.firebase_game_data) {
		return (
			<Backdrop open={true}>
			    <CircularProgress color="inherit" />
			</Backdrop>
		)
    }
    else {
        return (
            <ThemeProvider theme={props.theme}>
                <Container component="main" maxWidth={false} sx={{padding: 0}}>
                    <CssBaseline />
                    <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Stack spacing={2} direction="row">
                                    {Object.keys(props.firebase_game_data.users).filter((key) => (
                                        props.firebase_game_data.users[key].status === 'connect'
                                    )).map((key, index) => (
                                        <Chip key={index} label={props.firebase_game_data.users[key].user.name} />
                                    ))}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant='contained'
                                    disabled={
                                        auth!.user!.id === props.firebase_game_data.host ? false //自分がゲーム作成者ならstartできる
                                        :
                                        (`u${props.firebase_game_data.host}` in Object.keys(props.firebase_game_data.users).filter((key) => (
                                            props.firebase_game_data.users[key].status === 'connect'
                                        ))) === false
                                        &&
                                        `u${auth!.user!.id.toString()}` === Object.keys(props.firebase_game_data.users).filter((key) => (
                                            props.firebase_game_data.users[key].status === 'connect'
                                        ))[0] ? false // ゲーム作成者が居ない場合、idが若いユーザーがstartできる
                                        :
                                        true
                                    }
                                    onClick={props.handleGameStart}
                                >
                                    Game Start
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </ThemeProvider>
        )
    }
}

export default WordleLobby;