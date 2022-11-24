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
import Backdrop from '@material-ui/core/Backdrop';
import {useAuth} from "../contexts/AuthContext";
import yellow from "@material-ui/core/colors/yellow";
import BackspaceIcon from '@mui/icons-material/Backspace';
import WordleJapaneseCharacters from '../components/WordleJapaneseCharacters';
import WordleBoard from '../components/WordleBoard';
import { green, grey } from '@mui/material/colors';
import { Console } from 'console';

const theme = createTheme();

// TODO: characterの大きさ調整、レスポンシブ対応 どうやる？？？？？
// TODO: Stackの幅とレスポンシブ
const WordleStyle = makeStyles((theme: Theme) => ({
    character: {
        minWidth: '0px',
        minHeight: '0px',
        width: '40px',
        height: '40px',
        borderRadius: '7px',
        // border: 'solid 1px rgba(0, 0, 0, 0.54)',
        boxSizing: 'border-box',
        color: '#fff',
        fontWeight: 'bold',
        // game.maxを参照して拡大の可否を分岐しないといけないがapiから受け取ったgameを使えない・・・？
        // classにgame.maxの値を入れ込んでそれを元に分岐するか
        [theme.breakpoints.down("sm")]: {
            width: '33px',
            height: '33px',
        },
        '& .MuiChip-label': {
            overflow: 'visible',
        }
    },
    board_character: {
        border: 'solid 1px transparent',
        backgroundColor: '#fff'
    },
    board_character_match: {
        backgroundColor: green[400]
    },
    board_character_exist: {
        backgroundColor: yellow[400]
    },
    board_character_not_exist: {
        backgroundColor: grey[400]
    },
    board_character_plain: {
        border: 'solid 1px rgba(0, 0, 0, 0.54)',
        color: '#000000DE'
    },
    input_character: {
        border: 'solid 1px transparent',
        backgroundColor: grey[200],
        '&:hover': {
            backgroundColor: grey[400],
            '@media (hover: none)': {
                backgroundColor: grey[200],
            }
        },
    },
    input_character_null: {
        border: 'solid 1px transparent',
    },
    input_character_match: {
        backgroundColor: green[400],
        '&:hover': {
            backgroundColor: green[600],
            '@media (hover: none)': {
                backgroundColor: green[400],
            }
        },
    },
    input_character_exist: {
        backgroundColor: yellow[400],
        '&:hover': {
            backgroundColor: yellow[600],
            '@media (hover: none)': {
                backgroundColor: yellow[400],
            }
        },
    },
    input_character_not_exist: {
        backgroundColor: grey[400],
        // '&:hover': {
        //     backgroundColor: grey[600],
        //     '@media (hover: none)': {
        //         backgroundColor: grey[400],
        //     }
        // },
    },
    input_character_plain: {
        color: '#000000DE'
    },
}));

type GameWords = {
    [index: number]: {
        character: string
        errata: string
    }
}

function Wordle(): React.ReactElement {

    const auth = useAuth();
    const history = useHistory();
    const classes = WordleStyle();
    
    const {game_uuid} = useParams<{game_uuid: string}>();

    const [game, setGame] = useState<any>();
    const [game_words, setGameWords] = useState<GameWords>([]);
    const [game_users, setGameUsers] = useState<any>([]);
    const [game_logs, setGameLogs] = useState<any>([]);

    const [input_stack, setInputStack] = useState<any[]>([]);
    const [turn_flag, setTurnFlag] = useState<boolean>(true); // TODO: フラグを操作する処理を追加する

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
                            character: '',
                            errata: 'plain',
                        })
                    });
                    default_game_words.push(default_game_word);
                });
                console.log(default_game_words);
                setGame(game);
                setGameWords(default_game_words);
                setGameUsers(game.game_users);
                setGameLogs(game.game_logs);

                const default_input_stack: any[] = [];
                ([...Array(max)]).forEach(() => {
                    default_input_stack.push({
                        character: '',
                        errata: 'plain',
                    })
                });
                console.log(default_input_stack);
                setInputStack(default_input_stack);

                // TODO: ログを追う処理を追加する
                // 要検証
                GameLogsFunctionWrapper(game.game_logs);

                window.Echo.join('game.' + game.uuid)
                .listen('GameEvent', (e: any) => {
                    console.log(e);

                    // 要検証
                    const game_log = e.game_log;
                    const updated_game_logs = game_logs;
                    updated_game_logs.push(game_log);
                    GameLogsFunctionWrapper(updated_game_logs);
                    setGameLogs(updated_game_logs);
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
    const handleInputStack = (event: any) => {
        const target_character = String(event.currentTarget.getAttribute('data-character-value'));
        console.log(target_character);

        const target_input_stack_index = input_stack.findIndex(function(character) {
            return character.character === '';
        });
        // 既に全て埋まっている場合indexが無いので無反応で処理が行われない(エラー出す?)

        const updated_input_stack = input_stack.map((character, index) => (index === target_input_stack_index ? {...character, character: target_character} : character));
        setInputStack(updated_input_stack);
        updateBoard(updated_input_stack);
    }

    const handleInputBackSpace = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const filled_input_stack = (input_stack as any[]).filter((character, index) => (character.character !== ''));
        const target_input_stack_index = filled_input_stack.length - 1;
        const updated_input_stack = input_stack.map((character, index) => (index === target_input_stack_index ? {...character, character: ''} : character));
        setInputStack(updated_input_stack);
        updateBoard(updated_input_stack);
    }

    const updateBoard = (updated_input_stack: any[]) => {
        // Boardに表示させる
        const game_input_logs = (game_logs as any[]).filter((game_log, index) => (game_log.type === 'input'));
        const target_board_word_index = game_input_logs.length;
        setGameWords((game_words) => (game_words as any[]).map((game_word, index) => (index === target_board_word_index ? updated_input_stack : game_word)));
    }
    /////////////////////////////////////////////////////////////////////////

    // enter ///////////////////////////////////////////////////////////////////////
    const handleInputEnter = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setLoading(true)

        const data = {
            game_uuid: game_uuid,
            input: input_stack.map(character => character['character'])
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
    
    // game_logsが更新された時の処理をラップして関数化する
    const GameLogsFunctionWrapper = (game_logs: any) => {
        hgandleErrata(game_logs);
        handleTurnChange(game_logs);
    }

    // errata ///////////////////////////////////////////////////////////////////////
    const hgandleErrata = (game_logs: any) => {
        // メモ ///////////////////////////////////////////////////////////////////////
        // game_logsからerrataの情報を全て集めて同期する？
        // boardとinputエリアはerrataの扱いが違う
        // inputエリアにどうやって知らせる？charactersはWordle.tsxで一括管理する / game_logが更新された時の処理を個別に書く
        // 色が変わるアニメーションをつける場合、初期表示とchannelからの受信で処理を分けるか、配列の最後だけ処理を分ける
        // 初期表示かどうかはどうやって判別する？ → initial_loadがtrueであれば初期表示
        // ターンプレイヤーはgame_wordsの中に既にplainなcharacterが入っているのでその他のプレイヤーと処理を分ける(errataだけ更新する)必要がある
        // ターンプレイヤーかどうかはどうやって判別する？
        /////////////////////////////////////////////////////////////////////////
    }
    /////////////////////////////////////////////////////////////////////////

    // turn_flag ///////////////////////////////////////////////////////////////////////
    const handleTurnChange = (game_logs: any) => {
        // 自分のこのgameにおける情報を取得する
        const my_game_status = (game_users as any[]).filter((game_user, index) => (game_user.user.id === auth?.user?.id))[0];
        console.log(my_game_status);

        // game_logs type: inputのみを取得する
        const game_input_logs = (game_logs as any[]).filter((game_log, index) => (game_log.type === 'input'));

        // inputがまだ1つもされていなければ、orderが1のユーザーがターンプレイヤーになる            
        if(game_input_logs.length === 0) {
            if(my_game_status.order === 1) {
                // 自分がターンプレイヤーになる
                setTurnFlag(true);
            }
            else {
                // ターンプレイヤーにならない
                setTurnFlag(false);
            }
        }
        else {
            // 最後のデータを誰がinputしたのかを取得
            const game_input_logs_last = game_input_logs.slice(-1)[0];
            console.log(game_input_logs_last);
            const last_input_user = (game_users as any[]).filter((game_user, index) => (game_user.user.id === game_input_logs_last.user_id))[0];
            console.log(last_input_user);

            // 上で取得したユーザーの次のorderを持つユーザーを取得する
            const next_input_user = (game_users as any[]).filter((game_user, index) => (game_user.order === last_input_user.order + 1))[0];
            console.log(next_input_user);

            // next_input_userがターンプレイヤーになる
            // undefinedの場合、orderが1のユーザーが次のターンプレイヤーになる
            if(next_input_user === undefined && my_game_status.order === 1) {
                // 自分がターンプレイヤーになる
                setTurnFlag(true);
            }
            else if(my_game_status.order === next_input_user.order) {
                // 自分がターンプレイヤーになる
                setTurnFlag(true);
            }
            else {
                // ターンプレイヤーにならない
                setTurnFlag(false);
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////
    
	if (initial_load) {
		return (
			<Backdrop open={true}>
			  <CircularProgress color="inherit" />
			</Backdrop>
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
                                <WordleBoard game_words={game_words} classes={classes} />
                            </Grid>
                            {/* input表示エリア */}
                            <Grid item xs={12}>
                                <WordleJapaneseCharacters
                                    classes={classes}
                                    turn_flag={turn_flag}
                                    handleInputStack={handleInputStack}
                                />
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