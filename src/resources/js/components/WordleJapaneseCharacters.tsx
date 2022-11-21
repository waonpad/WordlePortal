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

    const initial_state: any[] = [
        {
            character: 'あ',
            errata: 'plain'
        },
        {
            character: 'い',
            errata: 'plain'
        },
        {
            character: 'う',
            errata: 'plain'
        },
        {
            character: 'え',
            errata: 'plain'
        },
        {
            character: 'お',
            errata: 'plain'
        },
        {
            character: 'あ',
            errata: 'plain'
        },
        {
            character: 'い',
            errata: 'plain'
        },
        {
            character: 'う',
            errata: 'plain'
        },
        {
            character: 'え',
            errata: 'plain'
        },
        {
            character: 'お',
            errata: 'plain'
        },
        {
            character: 'あ',
            errata: 'plain'
        },
        {
            character: 'い',
            errata: 'plain'
        },
        {
            character: 'う',
            errata: 'plain'
        },
        {
            character: 'え',
            errata: 'plain'
        },
        {
            character: 'お',
            errata: 'plain'
        },
        {
            character: 'あ',
            errata: 'plain'
        },
        {
            character: 'い',
            errata: 'plain'
        },
        {
            character: 'う',
            errata: 'plain'
        },
        {
            character: 'え',
            errata: 'plain'
        },
        {
            character: 'お',
            errata: 'plain'
        },
        {
            character: 'あ',
            errata: 'plain'
        },
        {
            character: 'い',
            errata: 'plain'
        },
        {
            character: 'う',
            errata: 'plain'
        },
        {
            character: 'え',
            errata: 'plain'
        },
        {
            character: 'お',
            errata: 'plain'
        },
    ];

    const [japanese_characters, setJapanseCharacters] = useState<any[]>(initial_state);

    useEffect(() => {
        console.log((japanese_characters.slice(1*10, 1*10+10)));
    }, []);

    return (
        <Box>
            <Grid container spacing={0}>
                {/* input表示エリア */}
                {/* そのターンのプレイヤーしか入力できないようにする */}
                <Grid item xs={12}>
                    <Grid container spacing={0.5}>
                        {[...Array(5)].map((item, index) => (
                            <Grid key={index} item xs={12}>
                                <Grid container spacing={0.5} sx={{flexWrap: 'nowrap', justifyContent: 'center'}}>
                                    {(japanese_characters.slice(index*10, index*10+10) as any[]).map((character: {errata: 'match' | 'exist' | 'not_exist' | 'plain', character: string}, index: number) => (
                                        <Grid item key={index}>
                                            <Button data-character-value={character.character} className={props.classes.character + " " + props.classes.input_character + " " + props.classes[`character_${character.errata}`]} onClick={props.handleInputStack}>{character.character}</Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default WordleJapaneseCharacters;