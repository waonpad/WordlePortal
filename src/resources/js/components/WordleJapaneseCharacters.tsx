import React, { useState, useEffect, MouseEventHandler } from 'react';
import swal from "sweetalert";
import ReactDOM from 'react-dom';
import { Button, IconButton, Card } from '@material-ui/core';
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
import {useAuth} from "../contexts/AuthContext";
import yellow from "@material-ui/core/colors/yellow";
import BackspaceIcon from '@mui/icons-material/Backspace';

type WordleJapaneseCharactersProps = {
    classes: any
    handleInputStack: MouseEventHandler
}

function WordleJapaneseCharacters(props: WordleJapaneseCharactersProps): React.ReactElement {

    return (
        <Box
        sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}
        >
            <Grid container spacing={0}>
                {/* input表示エリア */}
                {/* そのターンのプレイヤーしか入力できないようにする */}
                <Grid item xs={10}>
                    <Grid container spacing={1} sx={{display: 'flex'}}>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                        <Grid item xs>
                            <Button data-character-value={'B'} className={props.classes.character + " " + props.classes.input_character} onClick={props.handleInputStack}>B</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default WordleJapaneseCharacters;