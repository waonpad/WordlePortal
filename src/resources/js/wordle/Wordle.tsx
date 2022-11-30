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
import {useAuth} from "../contexts/AuthContext";
import BackspaceIcon from '@mui/icons-material/Backspace';

import WordleInput from './components/WordleInput';
import WordleInputSelectButtonGroup from './components/WordleInputSelectButtonGroup';
import WordleBoard from './components/WordleBoard';
import { WordleStyle } from './styles/WordleStyle';
import { GameWords, ErrataList, DisplayInputComponent } from './types/WordleType';

const theme = createTheme();

function Wordle(): React.ReactElement {

    const auth = useAuth();
    const history = useHistory();
    const classes = WordleStyle();
    
    const {game_uuid} = useParams<{game_uuid: string}>();

    const [game, setGame] = useState<any>();
    const [game_words, setGameWords] = useState<GameWords>([]);
    const [game_users, setGameUsers] = useState<any>([]); // TODO: 開始したらstart状態のユーザーだけに書き換える
    const [game_logs, setGameLogs] = useState<any>([]);

    const [input_stack, setInputStack] = useState<any[]>([]);
    const [errata_list, setErrataList] = useState<ErrataList>({
        matchs: [],
        exists: [],
        not_exists: []
    });
    const [turn_flag, setTurnFlag] = useState<boolean>(true);
    const [display_input_component, setDisplayInputComponent] = useState<DisplayInputComponent>(null); 

    // const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<GroupPostData>();
    const [data_load, setDataLoad] = useState(true);
    const [new_game_log, setNewGameLog] = useState<any>();
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
        // axios.post('/api/wordle/game/entry', {game_uuid: game_uuid}).then(res => {
        axios.get('/api/wordle/game/show', {params: {game_uuid: game_uuid}}).then(res => {
            console.log(res);
            if (res.data.status === true) {
                const game = res.data.game;
                console.log(game);

                const default_game_words: any[] = [];

                // const rows = game.game_users.length * game.laps;
                const rows = 10; // test
                // const max = game.max;
                const max = 6; // test
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
                setGame(game);
                setGameWords(default_game_words);
                setGameUsers(game.game_users);
                setGameLogs(game.game_logs);
                setDisplayInputComponent(game.input[0]);

                const default_input_stack: any[] = [];
                ([...Array(max)]).forEach(() => {
                    default_input_stack.push({
                        character: '',
                        errata: 'plain',
                    })
                });
                setInputStack(default_input_stack);

                handleErrata(game.game_logs, default_game_words);
                handleTurnChange(game.game_logs, game.game_users);

                // window.Echo.join('game.' + '7ceb7e91-f845-4212-a4ce-6c0e8ca5105e')
                // .listen('GameEvent', (e: any) => {
                //     console.log('listen');
                //     console.log(e);

                //     // 要検証
                //     setNewGameLog(e.game_log);
                // })
                // .here((users: any) => {
                //     console.log('here');
                //     console.log(users);
                // })
                // .joining((user: any) => {
                //     console.log('joining');
                //     console.log(user);
                // })
                // .leaving((user: any) => {
                //     console.log('leaving');
                //     console.log(user);
                // })
                // .error((error: any) => {
                //     console.log(error);
                // });

                // setInitialLoad(false);
                setDataLoad(false);
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
        const target_game_word_index = game_input_logs.length;
        setGameWords((game_words) => (game_words as any[]).map((game_word, index) => (index === target_game_word_index ? updated_input_stack : game_word)));
    }
    /////////////////////////////////////////////////////////////////////////

    // enter ///////////////////////////////////////////////////////////////////////
    const handleInputEnter = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setLoading(true)

        const data = {
            game_uuid: game_uuid,
            input: input_stack.map((character) => (character['character']))
        };

        axios.post('/api/wordle/game/input', data).then(res => {
            swal("送信成功", "送信成功", "success");
            console.log(res);

            const default_input_stack: any[] = [];
            ([...Array(game.max)]).forEach(() => {
                default_input_stack.push({
                    character: '',
                    errata: 'plain',
                })
            });
            setInputStack(default_input_stack);

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

    // game_log 初期表示時
    useEffect(() => {
        if(data_load === false) {
            handleErrata(game_logs, game_words);
            handleTurnChange(game_logs, game_users);

            setInitialLoad(false);
        }
    }, [data_load])

    // game_log 更新時
    useEffect(() => {
        if(new_game_log !== undefined) {
            const updated_game_logs = [...game_logs, new_game_log];
            
            handleErrata(updated_game_logs, game_words);
            handleTurnChange(updated_game_logs, game_users);

            setGameLogs(updated_game_logs);
        }
    }, [new_game_log])

    // errata ///////////////////////////////////////////////////////////////////////
    const handleErrata = (game_logs: any, game_words: any) => {
        // game_logs type: inputのみを取得する
        const game_input_logs = (game_logs as any[]).filter((game_log, index) => (game_log.type === 'input'));
        // inputがまだ1つもされていなければ、処理を行わない
        if(game_input_logs.length > 0) {
            if(initial_load === true) {
                // Boardに表示する
                const input_and_errata_list = (game_input_logs as any[]).map((game_input_log, index) => (game_input_log.log.input_and_errata));
                const updated_game_words = (game_words as any[]).map((game_word, index) => (input_and_errata_list[index] ?? game_word));
                setGameWords(updated_game_words);
    
                // errataを取得
                const matchs_list = Array.from(new Set((game_input_logs as any[]).map((game_input_log, index) => (game_input_log.log.matchs)).flat()));
                const exists_list = Array.from(new Set((game_input_logs as any[]).map((game_input_log, index) => (game_input_log.log.exists)).flat()));
                const not_exists_list = Array.from(new Set((game_input_logs as any[]).map((game_input_log, index) => (game_input_log.log.not_exists)).flat()));

                // errataが上位のものに変わった場合のため、リスト間での重複を削除する
                const merged_exists_list = (exists_list as any[]).map((exist_character, index) => (
                    matchs_list.includes(exist_character) ? undefined : exist_character
                )).filter(exist_character => typeof exist_character !== undefined);

                const merged_not_exists_list = (not_exists_list as any[]).map((not_exist_character, index) => (
                    matchs_list.includes(not_exist_character) && merged_exists_list.includes(not_exist_character) ? undefined : not_exist_character
                )).filter(not_exist_character => typeof not_exist_character !== undefined);

                // 取得できたのでsetする
                setErrataList({
                    matchs: matchs_list,
                    exists: merged_exists_list,
                    not_exists: merged_not_exists_list
                });
            }
            else {
                if(game_logs.slice(-1)[0].type === 'input') { // type: entry等で発火しない
                    
                    const prev_game_input_logs = game_input_logs.slice(0, -1);
                    
                    // Boardに表示する
                    const input_and_errata_list = (prev_game_input_logs as any[]).map((game_input_log, index) => (game_input_log.log.input_and_errata));
                    const updated_game_words = (game_words as any[]).map((game_word, index) => (input_and_errata_list[index] ?? game_word));
                    setGameWords(updated_game_words); // ターンプレイヤーはcharacterが既に表示されている
        
                    // errataを取得
                    const matchs_list = Array.from(new Set((prev_game_input_logs as any[]).map((game_input_log, index) => (game_input_log.log.matchs)).flat()));
                    const exists_list = Array.from(new Set((prev_game_input_logs as any[]).map((game_input_log, index) => (game_input_log.log.exists)).flat()));
                    const not_exists_list = Array.from(new Set((prev_game_input_logs as any[]).map((game_input_log, index) => (game_input_log.log.not_exists)).flat()));

                    // errataが上位のものに変わった場合のため、リスト間での重複を削除する
                    const merged_exists_list = (exists_list as any[]).map((exist_character, index) => (
                        matchs_list.includes(exist_character) ? undefined : exist_character
                    )).filter(exist_character => typeof exist_character !== undefined);

                    const merged_not_exists_list = (not_exists_list as any[]).map((not_exist_character, index) => (
                        matchs_list.includes(not_exist_character) && merged_exists_list.includes(not_exist_character) ? undefined : not_exist_character
                    )).filter(not_exist_character => typeof not_exist_character !== undefined);

                    // 取得できたのでsetする
                    setErrataList({
                        matchs: matchs_list,
                        exists: merged_exists_list,
                        not_exists: merged_not_exists_list
                    });

                    // ここから1文字ずつ更新する処理 ///////////////////////////////////////////////////////////////////////
                    const new_game_input_log = game_input_logs.slice(-1)[0];

                    const target_game_word_index = game_input_logs.length - 1;
                    const new_input_and_errata = new_game_input_log.log.input_and_errata;

                    (async () => {
                        const sleep = (second: number) => new Promise(resolve => setTimeout(resolve, second * 1000))

                        for(var i = 0; i < new_input_and_errata.length; i++) {
                            // stateの仕組みの都合、i番目の要素だけでなくそれまでの要素も更新する
                            const updated_game_words = (game_words as any[]).map((game_word, index) => (
                                index === target_game_word_index ? (game_word as any[]).map((character, index) => (
                                    new_input_and_errata.slice(0, i + 1)[index] ?? character
                                )) : game_word
                            ));
                            setGameWords(updated_game_words);

                            // inputエリアの同期
                            const current_new_input_and_errata: any[] = new_input_and_errata.slice(0, i + 1);
                            const current_new_input_list = (new_input_and_errata.slice(0, i + 1) as any[]).map((character, index) => (character.character));

                            // ターゲットのcharacterを全ての配列から一度削除する
                            const updated_matchs_list = (matchs_list as any[]).filter((match_character, index) => (
                                current_new_input_list.indexOf(match_character) == -1
                            ));

                            const updated_exists_list = (exists_list as any[]).filter((exist_character, index) => (
                                current_new_input_list.indexOf(exist_character) == -1
                            ));

                            const updated_not_exists_list = (not_exists_list as any[]).filter((not_exist_character, index) => (
                                current_new_input_list.indexOf(not_exist_character) == -1
                            ));

                            // 振り分け
                            (current_new_input_and_errata).forEach((character, index) => {
                                if(character.errata === 'match') {
                                    updated_matchs_list.push(character.character);
                                }
                                if(character.errata === 'exist') {
                                    matchs_list.includes(character.character) ? updated_matchs_list.push(character.character) : updated_exists_list.push(character.character);
                                }
                                if(character.errata === 'not_exist') {
                                    updated_not_exists_list.push(character.character);
                                }
                            });

                            // errataが上位のものに変わった場合のため、リスト間での重複を削除する
                            const merged_updated_exists_list = (updated_exists_list as any[]).map((exist_character, index) => (
                                updated_matchs_list.includes(exist_character) ? undefined : exist_character
                            )).filter(exist_character => typeof exist_character !== undefined);
            
                            const merged_updated_not_exists_list = (updated_not_exists_list as any[]).map((not_exist_character, index) => (
                                updated_matchs_list.includes(not_exist_character) || merged_updated_exists_list.includes(not_exist_character) ? undefined : not_exist_character
                            )).filter(not_exist_character => typeof not_exist_character !== undefined);

                            setErrataList({
                                matchs: Array.from(new Set(updated_matchs_list)),
                                exists: Array.from(new Set(merged_updated_exists_list)),
                                not_exists: Array.from(new Set(merged_updated_not_exists_list)),
                            });

                            await sleep(1);
                        }
                    })()
                }
                /////////////////////////////////////////////////////////////////////////
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////

    // turn_flag ///////////////////////////////////////////////////////////////////////
    const handleTurnChange = (game_logs: any, game_users: any) => {
        // 自分のこのgameにおける情報を取得する
        const my_game_status = (game_users as any[]).filter((game_user, index) => (game_user.user.id === auth?.user?.id))[0];
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
            const last_input_user = (game_users as any[]).filter((game_user, index) => (game_user.user.id === game_input_logs_last.user_id))[0];

            // 上で取得したユーザーの次のorderを持つユーザーを取得する
            const next_input_user = (game_users as any[]).filter((game_user, index) => (game_user.order === last_input_user.order + 1))[0];

            // next_input_userがターンプレイヤーになる
            // undefinedの場合、orderが1のユーザーが次のターンプレイヤーになる
            if(next_input_user === undefined && my_game_status.order === 1) {
                // 自分がターンプレイヤーになる
                setTurnFlag(true);
            }
            else if(my_game_status.order === (next_input_user?.order)) {
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

    // display input component ///////////////////////////////////////////////////////////////////////
    const handleDisplayInputComponentSelect = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const target_input = event.currentTarget.value;
        setDisplayInputComponent((target_input as DisplayInputComponent));
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
                                <WordleInput
                                    classes={classes}
                                    turn_flag={turn_flag}
                                    handleInputStack={handleInputStack}
                                    errata={errata_list}
                                    display_input_component={display_input_component}
                                />
                            </Grid>
                            {/* input切り替えボタングループ */}
                            <Grid item xs={12}>
                                <WordleInputSelectButtonGroup
                                    input={game.input}
                                    handleDisplayInputComponentSelect={handleDisplayInputComponentSelect}
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