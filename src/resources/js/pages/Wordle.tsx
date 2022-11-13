import React, { useState, useEffect } from 'react';
import swal from "sweetalert";
import ReactDOM from 'react-dom';
import { Button, Card } from '@material-ui/core';
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
import { alpha, createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@mui/material/CircularProgress';
import {useAuth} from "../contexts/AuthContext";

const theme = createTheme();

const WordleStyle = makeStyles((theme: Theme) => createStyles({
    character_match: {
        backgroundColor: '#4caf50'
    },
    character_exist: {
        backgroundColor: '#ffeb3b'
    },
    character_not_exist: {
        backgroundColor: '#9e9e9e'
    },
    character_plain: {
        backgroundColor: '#fff'
    },
}));

type Game_Words = {
    character: string
    errata: string
}

function Wordle(): React.ReactElement {

    const auth = useAuth();
    const history = useHistory();
    const classes = WordleStyle();
    
    const {game_uuid} = useParams<{game_uuid: string}>();

    const [game, setGame] = useState<any>();

    /*  game_words = [
            0 => [
                0 => [
                    'character' => 'R',
                    'errata => 'match'
                ],
                ...
            ],
            ...
        ]
    */
    const [game_words, setGameWords] = useState<any[]>([]);
    const [game_users, setGameUsers] = useState<any>([]);
    const [game_log, setGameLog] = useState<any>([]);

    // const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<GroupPostData>();
    const [initial_load, setInitialLoad] = useState(true);
    const [loading, setLoading] = useState(false);

    // const onSubmit: SubmitHandler<GroupPostData> = (data: GroupPostData) => {
    //     setLoading(true)

    //     axios.post('/api/grouppost', data).then(res => {
    //         swal("送信成功", "送信成功", "success");
    //         console.log(res);
    //         setLoading(false);
    //     }).catch(error => {
    //         console.log(error)
    //         setError('submit', {
    //         type: 'manual',
    //         message: '送信に失敗しました'
    //     })
    //         setLoading(false);
    //     })
    // }

	useEffect(() => {

        const data = {
            game_uuid: game_uuid
        };

        axios.get('/api/wordle/game/show', {params: data}).then(res => {
            if (res.status === 200) {
                console.log(res);
                const game = res.data.game;

                const default_game_words: any[] = [];
                ([...Array(game.game_users.length * game.laps)]).forEach(() => {
                    const default_game_word: any[] = [];
                    ([...Array(game.max)]).forEach(() => {
                        default_game_word.push({
                            character: 'A',
                            errata: 'plain',
                        })
                    });
                    default_game_words.push(default_game_word);
                });
                console.log(default_game_words);
                setGameWords(default_game_words);

                window.Echo.join('game.' + game.uuid)
                .listen('GameEvent', (e: any) => {
                    console.log(e);
                    // setGameLog(game_log => [...game_log,{text: e.group_post.text}]);
                })
                .here((users: any)=> {
                    console.log('here');
                    console.log(users);
                })
                .joining((user: any) => {
                    console.log('joining');
                    console.log(user);
                })
                .leaving((user: any) => {
                    console.log('leaving');
                    console.log(user);
                })
                .error((error: any) => {
                    console.log(error);
                });

                setInitialLoad(false);
            }
        }).catch((error) => {
            console.log(error);
            swal("ゲームがない", "そのゲームは存在しません", "error");
            // history.push('/');
            // setInitialLoad(false);
        });
	}, [])

    // input ///////////////////////////////////////////////////////////////////////
    const [input_stack, setInputStack] = useState<string[]>([]);

    const handleInputStack = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const target_character = String(event.currentTarget.getAttribute('data-character-id'));
        console.log(target_character);
        setInputStack([...input_stack, target_character]);
        // game_wordsでplainなcharacterがあるところにtarget_characterを表示させる？
    }
    /////////////////////////////////////////////////////////////////////////
    
	if (initial_load) {
		return (
            <CircularProgress sx={{textAlign: 'center'}} />
		)
	}
	else {
        return (
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth={'md'} sx={{padding: 0}}>
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
                            {/* words表示エリア */}
                            <Grid item xs={12}>
                                {game_words.map((word: any, index: number) => (
                                    <Stack key={index} direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                        {(word).map((character: {errata: 'match' | 'exist' | 'not_exist', character: string}, index: number) => (
                                            <Chip className={classes[`character_${character.errata}`]} key={index} style={{borderRadius: '7px', border: 'solid 1px rgba(0, 0, 0, 0.54)', boxSizing: 'border-box'}} label={character.character} />
                                        ))}
                                    </Stack>
                                ))}
                            </Grid>
                            {/* input表示エリア */}
                            <Grid item xs={12}>
                                <Button data-character-id={'B'} onClick={handleInputStack}>B</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </ThemeProvider>
        )
	}
}

export default Wordle;