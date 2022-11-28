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
import BackspaceIcon from '@mui/icons-material/Backspace';
import WordleJapaneseCharacters from '../components/WordleJapaneseCharacters';
import WordleBoard from '../components/WordleBoard';
import { WordleStyle } from '../styles/WordleStyle';

const theme = createTheme();

type GameWords = {
    [index: number]: {
        character: string
        errata: string
    }
}

type ErrataList = {
    matchs: any[],
    exists: any[],
    not_exists: any[]
}

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
    const [turn_flag, setTurnFlag] = useState<boolean>(true); // TODO: フラグを操作する処理を追加する

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
        axios.post('/api/wordle/game/entry', {game_uuid: game_uuid}).then(res => {
        // axios.get('/api/wordle/game/show', {params: {game_uuid: game_uuid}}).then(res => {
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
                handleErrata(game.game_logs, default_game_words);
                handleTurnChange(game.game_logs, game.game_users);

                // here以下は使わない？バックで管理したものをlistenで反映させるほうが考えること少なそう
                window.Echo.join('game.' + '7ceb7e91-f845-4212-a4ce-6c0e8ca5105e')
                .listen('GameEvent', (e: any) => {
                    console.log('listen');
                    console.log(e);

                    // 要検証
                    setNewGameLog(e.game_log);
                })
                .here((users: any) => {
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
            console.log(default_input_stack);
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

    useEffect(() => {
        if(data_load === false) {
            console.log('data_load');

            handleErrata(game_logs, game_words);
            handleTurnChange(game_logs, game_users);

            setInitialLoad(false);
        }
    }, [data_load])

    useEffect(() => {
        if(new_game_log !== undefined) {
            console.log('new_game_log');

            const updated_game_logs = [...game_logs, new_game_log];
            
            handleErrata(updated_game_logs, game_words);
            handleTurnChange(updated_game_logs, game_users);

            setGameLogs(updated_game_logs);
        }
    }, [new_game_log])

    // errata ///////////////////////////////////////////////////////////////////////
    const handleErrata = (game_logs: any, game_words: any) => {
        // メモ ///////////////////////////////////////////////////////////////////////
        // game_logsからerrataの情報を全て集めて同期する？
        // boardとinputエリアはerrataの扱いが違う
        // inputエリアにどうやって知らせる？charactersはWordle.tsxで一括管理する / game_logが更新された時の処理を個別に書く
        // 色が変わるアニメーションをつける場合、初期表示とchannelからの受信で処理を分けるか、配列の最後だけ処理を分ける
        // 初期表示かどうかはどうやって判別する？ → initial_loadがtrueであれば初期表示
        // ターンプレイヤーはgame_wordsの中に既にplainなcharacterが入っているのでその他のプレイヤーと処理を分ける(errataだけ更新する)必要がある
        // ターンプレイヤーかどうかはどうやって判別する？
        /////////////////////////////////////////////////////////////////////////

        // game_logs type: inputのみを取得する
        const game_input_logs = (game_logs as any[]).filter((game_log, index) => (game_log.type === 'input'));
        console.log(game_input_logs);
        // inputがまだ1つもされていなければ、処理を行わない
        if(game_input_logs.length > 0) {
            console.log('do errata');
            if(initial_load === true) {
                console.log('initial errata');
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
                const prev_game_input_logs = game_input_logs.slice(0, -1);
                console.log(prev_game_input_logs);
                
                // Boardに表示する
                const input_and_errata_list = (prev_game_input_logs as any[]).map((game_input_log, index) => (game_input_log.log.input_and_errata));
                console.log(input_and_errata_list);
                const updated_game_words = (game_words as any[]).map((game_word, index) => (input_and_errata_list[index] ?? game_word));
                console.log(updated_game_words);
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

                console.log({
                    matchs: matchs_list,
                    exists: merged_exists_list,
                    not_exists: merged_not_exists_list
                });

                // 取得できたのでsetする
                setErrataList({
                    matchs: matchs_list,
                    exists: merged_exists_list,
                    not_exists: merged_not_exists_list
                });

                // ここから1文字ずつ更新する処理 ///////////////////////////////////////////////////////////////////////
                const new_game_input_log = game_input_logs.slice(-1)[0];
                console.log(new_game_input_log);

                const target_game_word_index = game_input_logs.length - 1;
                const new_input_and_errata = new_game_input_log.log.input_and_errata;

                (async () => {
                    const sleep = (second: number) => new Promise(resolve => setTimeout(resolve, second * 1000))

                    for(var i = 0; i < new_input_and_errata.length; i++) {
                        const updated_game_words = (game_words as any[]).map((game_word, index) => (
                            index === target_game_word_index ? (game_word as any[]).map((character, index) => (
                                new_input_and_errata.slice(0, i + 1)[index] ?? character
                            )) : game_word
                        ));
                        setGameWords(updated_game_words);

                        // TODO: inputエリアも同期する

                        await sleep(1);
                    }
                })()
                /////////////////////////////////////////////////////////////////////////
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////

    // turn_flag ///////////////////////////////////////////////////////////////////////
    const handleTurnChange = (game_logs: any, game_users: any) => {
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
                                    errata={errata_list}
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