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

const theme = createTheme();

// TODO: characterの大きさ調整、レスポンシブ対応 どうやる？？？？？
// TODO: Stackの幅とレスポンシブ
const WordleStyle = makeStyles((theme: Theme) => createStyles({
    character: {
        minWidth: '38px',
        minHeight: '38px',
        width: '38px',
        height: '38px',
        borderRadius: '7px',
        border: 'solid 1px rgba(0, 0, 0, 0.54)',
        boxSizing: 'border-box'
    },
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
    input_character: {
        backgroundColor: yellow[500],
        "&:hover": {
            backgroundColor: yellow[700],
            // Reset on touch devices, it doesn't add specificity
            "@media (hover: none)": {
                backgroundColor: yellow[500]
            }
        }
    }
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
        axios.post('/api/wordle/game/entry', {game_uuid: game_uuid}).then(res => {
            console.log(res);
            if (res.data.status === true) {
                const game = res.data.game;

                const default_game_words: any[] = [];

                // const rows = game.game_users.length * game.laps;
                const rows = 10; // test
                // const max = game.max;
                const max = 10; // test
                ([...Array(rows)]).forEach(() => {
                    const default_game_word: any[] = [];
                    ([...Array(max)]).forEach(() => {
                        default_game_word.push({
                            character: 'A',
                            errata: 'plain',
                        })
                    });
                    default_game_words.push(default_game_word);
                });
                console.log(default_game_words);
                setGameWords(default_game_words);
                setGameUsers(game.game_users);
                setGameLog(game.game_log);

                // TODO: ログを追う処理を追加する

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
            else if(res.data.status === false) {
                swal("参加失敗", res.data.message, "error");
            }
        }).catch(error => {
            console.log(error)
            swal("参加失敗", "参加失敗", "error");
        })
	}, [])

    // input ///////////////////////////////////////////////////////////////////////
    const [input_stack, setInputStack] = useState<string[]>([]);

    const handleInputStack = (event: any) => {
        // stackが最大文字数未満なら
        if (input_stack.length < game.max) {
            const target_character = String(event.currentTarget.getAttribute('data-character-id'));
            console.log(target_character);
            setInputStack([...input_stack, target_character]);
            // TODO: game_wordsでplainなcharacterがあるところにtarget_characterを表示させる？
        }
    }

    const handleInputBackSpace = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const backspaced_input_stack = input_stack.slice(0, -1);
        setInputStack(backspaced_input_stack);
        // TODO: 表示エリアからも削除
    }

    useEffect(() => {
        console.log(input_stack);
    }, [input_stack]);
    /////////////////////////////////////////////////////////////////////////

    // enter ///////////////////////////////////////////////////////////////////////
    const handleInputEnter = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setLoading(true)

        const data = {
            game_uuid: game_uuid,
            input: input_stack
        };

        axios.post('/api/wordle/game/input', data).then(res => {
            swal("送信成功", "送信成功", "success");
            console.log(res);
            setLoading(false);
        }).catch(error => {
            console.log(error)
            swal("送信失敗", "送信失敗", "error");
            // setError('submit', {
            //     type: 'manual',
            //     message: '送信に失敗しました'
            // })
            setLoading(false);
        })

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
                            {/* words表示エリア */}
                            <Grid item xs={12}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} md={6}>
                                        <Grid container spacing={1}>
                                            {(game_words.slice(0, Math.ceil(game_words.length / 2))).map((word: any, index: number) => (
                                                <Grid key={index} item xs={12}>
                                                    <Stack direction="row" justifyContent="center" spacing={0} sx={{ flexWrap: 'nowrap', gap: 1 }}>
                                                        {(word).map((character: {errata: 'match' | 'exist' | 'not_exist', character: string}, index: number) => (
                                                            <Chip className={classes.character + " " + classes[`character_${character.errata}`]} key={index} label={character.character} />
                                                        ))}
                                                    </Stack>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Grid container spacing={1}>
                                            {(game_words.slice(Math.ceil(game_words.length / 2), game_words.length)).map((word: any, index: number) => (
                                                <Grid key={index} item xs={12}>
                                                    <Stack direction="row" justifyContent="center" spacing={0} sx={{ flexWrap: 'nowrap', gap: 1 }}>
                                                        {(word).map((character: {errata: 'match' | 'exist' | 'not_exist', character: string}, index: number) => (
                                                            <Chip className={classes.character + " " + classes[`character_${character.errata}`]} key={index} label={character.character} />
                                                        ))}
                                                    </Stack>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* input表示エリア */}
                            {/* そのターンのプレイヤーしか入力できないようにする */}
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={0} sx={{ flexWrap: 'nowrap', gap: 1 }}>
                                    <Button data-character-id={'B'} className={classes.character + " " + classes.input_character} onClick={handleInputStack}>B</Button>
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={2} direction="row">
                                    <IconButton color='inherit' onClick={handleInputBackSpace}>
                                        <BackspaceIcon />
                                    </IconButton>
                                    <LoadingButton
                                        loading={loading}
                                        variant="contained"
                                        onClick={handleInputEnter}
                                    >
                                        Enter
                                    </LoadingButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </ThemeProvider>
        )
	}
}

export default Wordle;