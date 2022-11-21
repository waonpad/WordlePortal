import React, { useState, useEffect } from 'react';
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
import WordleJapaneseCharacters from '../components/WordleJapaneseCharacters';

type WordleBoardProps = {
    game_words: any
    classes: any
}

function WordleBoard(props: WordleBoardProps): React.ReactElement {

    const BoardAsset = (game_words: any, place: 'left' | 'right') => (
        <Grid container spacing={1}>
            {game_words.map((word: any, index: number) => (
                <Grid key={index} item xs={12}>
                    <Grid container spacing={0.5} sx={{flexWrap: 'nowrap', justifyContent: {xs: 'center', md: place === 'left' ? 'right' : 'left'}}}>
                        {(word).map((character: {errata: 'match' | 'exist' | 'not_exist' | 'plain', character: string}, index: number) => (
                            <Grid item key={index}>
                                <Chip className={props.classes.character + " " + props.classes[`character_${character.errata}`]} key={index} label={
                                    <Typography>{character.character}</Typography>
                                } />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            ))}
        </Grid>
    )

    return (
        <Box
            // sx={{
            //     marginTop: 2,
            // }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    {BoardAsset((props.game_words.slice(0, Math.ceil(props.game_words.length / 2))), 'left')}
                </Grid>
                <Grid item xs={12} md={6}>
                    {BoardAsset((props.game_words.slice(Math.ceil(props.game_words.length / 2), props.game_words.length)), 'right')}
                </Grid>
            </Grid>
        </Box>
    )
}

export default WordleBoard; 