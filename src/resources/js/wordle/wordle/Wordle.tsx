import React, { useState, useEffect, useRef } from 'react';
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
import {useAuth} from "../../contexts/AuthContext";
import BackspaceIcon from '@mui/icons-material/Backspace';

import WordleInput from './components/wordlegame/WordleInput';
import WordleInputSelectButtonGroup from './components/wordlegame/WordleInputSelectButtonGroup';
import WordleBoard from './components/wordlegame/WordleBoard';
import { WordleStyle } from './styles/WordleStyle';
import { GameWords, ErrataList, DisplayInputComponent, GameStatus } from '../types/WordleType';
import WordleLobby from './components/WordleLobby';
import WordleGame from './components/WordleGame';

import firebaseApp from '../../contexts/FirebaseConfig';
import { getDatabase, push, ref, set, update, onValue, onDisconnect, child, orderByChild, equalTo, startAt, endAt } from '@firebase/database'
import { serverTimestamp } from 'firebase/database';

const theme = createTheme();

function Wordle(): React.ReactElement {

    const auth = useAuth();
    const history = useHistory();
    const classes = WordleStyle();
    
    const {game_uuid} = useParams<{game_uuid: string}>();

    const [game, setGame] = useState<any>();
    const [game_status, setGameStatus] = useState<any>();
    const [game_words, setGameWords] = useState<GameWords>([]);

    // firebaseで管理
    const [firebase_game_data, setFirebaseGameData] = useState<any>(); // TODO: 開始したらstart状態のユーザーだけに書き換える

    const [input_stack, setInputStack] = useState<any[]>([]);
    const [errata_list, setErrataList] = useState<ErrataList>({
        matchs: [],
        exists: [],
        not_exists: []
    });
    const [turn_flag, setTurnFlag] = useState<boolean>(false);
    const [display_input_component, setDisplayInputComponent] = useState<DisplayInputComponent>(null); 

    // const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<GroupPostData>();
    const [initial_load, setInitialLoad] = useState(true);
    const [loading, setLoading] = useState(false);

    const ref = firebaseApp.database().ref(`wordle/games/${game_uuid}`);
    const [counter, setCounter] = useState<number>(); // 制限時間機能 後から作る
    
    const connection = useRef<{
        listener: number | null;
        // ref: ThenableReference | null;
        ref: any;
    }>({ listener: null, ref: null });

	useEffect(() => {
        /////////////////////////////////////////////////////////////////////////
        // axios.post('/api/wordle/game/entry', {game_uuid: game_uuid}).then(res => {
        axios.get('/api/wordle/game/show', {params: {game_uuid: game_uuid}}).then(res => {
            console.log(res);
            if (res.data.status === true) {
                
                const user_id = auth!.user!.id.toString();
                const game = res.data.game;

                const firebase_game = ref.once('value', (snapshot) => {
                    if (snapshot.val()) {
                        const firbase_game_users = snapshot.val().users;
                        const connected_firebase_game_users = Object.keys(firbase_game_users).filter((key) => (
                            snapshot.val().users[key].status === 'connect'
                        )).map((key) => (
                            snapshot.val().users[key]
                        ))
                        
                        console.log(connected_firebase_game_users);
                        if(
                            // (connected_firebase_game_users.length === 0 && snapshot.val().status !== 'create') // 参加ユーザーがいない
                            // ||
                            (game.status === 'end') // 終了している
                            ||
                            // (game.status === 'start' && ('order' in snapshot.val().users[(`u${user_id}` as any)]) === false) //startしていてゲーム参加者ではない
                            // ||
                            (connected_firebase_game_users.length === game.max_participants) // 満員
                        ) {  
                            swal("ゲームが存在しないか参加できない", "ゲームが存在しないか参加できない", "error");
                        }
                        else {
                            console.log('接続');

                            // game作成から一人目が入るまではconnectしているユーザーが0でも参加できるようにフラグがある
                            ref.update({
                                ...snapshot.val(),
                                status: 'joined'
                            })

                            const connected_info_ref = firebaseApp.database().ref(".info/connected");
                        
                            const connect = async () => {
                                // 接続状態を監視する
                                const onValueUnsubscribe = connected_info_ref.on('value', async (snapshot) => {
                                    if (!snapshot.val()) {
                                        return;
                                    }
                    
                                    if (!connection.current.ref) {
                                        connection.current.ref = push(ref);
                                    }
                            
                                    // 切断されたら接続情報を削除する処理を予約する
                                    await ref.child(`users/u${user_id}`).onDisconnect().update({
                                        user: auth!.user,
                                        status: 'disconnect'
                                    });
                    
                                    // 参加中のルームを設定する
                                    await ref.child(`users/u${user_id}`).update({
                                        user: auth!.user,
                                        status: 'connect'
                                    });
                                });
                            };
                        
                            connect().catch(() => {
                            });
                    
                            // データの変更を監視
                            ref.on('value', (snapshot) => {
                                if (snapshot.exists()) {
                                    console.log(snapshot.val());
                                    setFirebaseGameData(snapshot.val())
                                }
                                else {
                                    console.log("No data available");
                                }
                            })
            
                            // const game = res.data.game;
                            const current_game_status = res.data.current_game_status;
                            console.log(game);
                            console.log(current_game_status);
            
                            const default_game_words: any[] = [];
            
                            // const rows = game.game_users.length * game.laps;
                            const rows = 10; // test
                            // const max = game.max;
                            const max = 6; // test
                            ([...Array(rows)]).forEach((row, index) => {
                                if(current_game_status.board[index]) {
                                    default_game_words.push(current_game_status.board[index]);
                                }
                                else {
                                    const default_game_word: any[] = [];
                                    ([...Array(max)]).forEach(() => {
                                        default_game_word.push({
                                            character: '',
                                            errata: 'plain',
                                        })
                                    });
                                    default_game_words.push(default_game_word);
                                }
                            });
            
                            console.log(default_game_words);
            
                            setGame(game);
                            setGameStatus(current_game_status);
                            setErrataList(current_game_status.errata);
                            setGameWords(default_game_words);
                            setDisplayInputComponent(game.input[0]);
            
                            const default_input_stack: any[] = [];
                            ([...Array(max)]).forEach(() => {
                                default_input_stack.push({
                                    character: '',
                                    errata: 'plain',
                                })
                            });
                            setInputStack(default_input_stack);
            
                            // window.Echo.join('game.' + game.uuid)
                            // .listen('GameEvent', (e: any) => {
                            //     console.log('listen');
                            //     console.log(e);
            
                            //     setGameStatus(e.current_game_status);
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
            
                            setInitialLoad(false);
                        }
                    }
                    else {
                        swal("ゲームが存在しない", "ゲームが存在しない", "error");
                    }
                });
            }
            else if(res.data.status === false) {
                swal("参加失敗", res.data.message, "error");
            }
        }).catch(error => {
            console.log(error)
            swal("参加失敗", "参加失敗", "error");
        })
	}, [])
    
    // update board ///////////////////////////////////////////////////////////////////////
    const updateBoard = (updated_input_stack: any[]) => {
        // Boardに表示させる
        const target_game_word_index = game_status.board.length;
        setGameWords((game_words) => (game_words as any[]).map((game_word, index) => (index === target_game_word_index ? updated_input_stack : game_word)));
    }
    /////////////////////////////////////////////////////////////////////////

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
    /////////////////////////////////////////////////////////////////////////

    // typing ///////////////////////////////////////////////////////////////////////
    const handleTypingStack = (event: React.ChangeEvent<HTMLInputElement>) => {
        const current_value = event.currentTarget.value.split('');
        const updated_input_stack: any[] = [];

        current_value.forEach((character: any, index: number) => {
            updated_input_stack.push({
                character: current_value[index],
                errata: 'plain'
            })
        })

        for(var i = current_value.length; i < game.max; i++) {
            updated_input_stack.push({
                character: '',
                errata: 'plain'
            })
        }

        setInputStack(updated_input_stack);
        updateBoard(updated_input_stack.slice(0, game.max));
    }
    /////////////////////////////////////////////////////////////////////////

    // enter ///////////////////////////////////////////////////////////////////////
    const handleInputEnter = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setLoading(true)

        const data = {
            game_uuid: game_uuid,
            input: input_stack.map((character) => (character['character'])).slice(0, game.max),
            game_users: firebase_game_data.game_users
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

    // ゲームの状態が変わったとき
    useEffect(() => {
        if(game_status !== undefined) {
            // ターン(inputエリアの入力可否)切り替え
            if(auth?.user?.id === game_status.next_input_user) {
                setTurnFlag(true);
            }
            else {
                setTurnFlag(false);
            }

            if(initial_load === false) {
                if(game_status.latest_game_log.type === 'input') {
                    handleErrata(game_status, game_words);
                }
            }
        }
    }, [game_status])

    // errata ///////////////////////////////////////////////////////////////////////
    const handleErrata = (game_status: any, game_words: any) => {
        const game_input_logs = game_status.game_input_logs;
        const sliced_board = game_status.board.slice(0, game_status.board.length);
        
        // Boardに表示する
        const updated_game_words = (game_words as any[]).map((game_word, index) => (sliced_board[index] ?? game_word));
        setGameWords(updated_game_words); // ターンプレイヤーはcharacterが既に表示されている

        // errataを取得
        // 重複を排除せず、board,characters側で上手く処理する
        const matchs = game_status.errata.matchs;
        const exists = game_status.errata.exists;
        const not_exists = game_status.errata.not_exists;

        // 取得できたのでsetする
        setErrataList({
            matchs: matchs,
            exists: exists,
            not_exists: not_exists
        });

        // ここから1文字ずつ更新する処理 ///////////////////////////////////////////////////////////////////////
        const new_game_input_log = game_input_logs.slice(-1)[0];
        const target_game_word_index = sliced_board.length - 1;
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
                setGameWords(updated_game_words); // NOTICE: この更新中に入力があるとstackが消えたり見えたりするが動作自体はする 軽微な不具合

                // inputエリアの同期
                const current_new_input_and_errata: any[] = new_input_and_errata.slice(0, i + 1);

                // 振り分け
                (current_new_input_and_errata).forEach((character, index) => {
                    if(character.errata === 'match') {
                        matchs.push(character.character);
                    }
                    if(character.errata === 'exist') {
                        exists.push(character.character);
                    }
                    if(character.errata === 'not_exist') {
                        not_exists.push(character.character);
                    }
                });

                setErrataList({
                    matchs: matchs,
                    exists: exists,
                    not_exists: not_exists
                });

                await sleep(1);
            }
        })()
        /////////////////////////////////////////////////////////////////////////
    }
    /////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        // 制限時間機能
        if(game_status !== undefined) {
            if(initial_load === false) {
                if(game.answer_time_limit !== null) {
                    if(game_status.latest_game_log.type === 'input') {
                        console.log('reset counter');
                        setCounter(game.answer_time_limit);
                        var i = game.answer_time_limit;
                
                        const timer = setInterval(() => {
                            i--
                            setCounter(i);
                            if(i === 0) {
                                clearInterval(timer);
                            }
                        }, 1000)
                
                        return () => {
                            clearInterval(timer);
                            console.log('clear counter');
                        }
                    }
                }
            }
        }
    }, [game_status]);

    useEffect(() => {
        console.log(counter);
        // 指定時間更新が無かったら
        // ホストユーザーがログを更新する責務を負う
        // firebaseのstatusがconnectなユーザーの中でキーが若いユーザー順にホストになる
        if(counter === 0) {

            const connect_users = Object.keys(firebase_game_data.game_users).map((key: any) => (
                firebase_game_data.game_users[key].status === 'connect'
            ));

            // TODO: ゲーム作成者がいる場合それを優先する
            const host = Object.keys(connect_users)[0].slice(1); // idを配列のindexにしないために最初にuをつけているので外す

            console.log('ターンスキップ');

            // if(auth!.user!.id.toString() === host) {
            //     skip用APIを作る
            //     axios.post('/api/wordle/game/skip', {game_uuid: game_uuid}).then(res => {
            //         console.log(res);
            //         if(res.data.status === true) {
            //             // ターンスキップイベントをバックで発火する
            //             console.log('送信成功');
            //         }
            //         else {
            //             console.log('送信失敗');
            //         }
            //     }).catch(error => {
            //         console.log(error)
            //         swal("送信失敗", "送信失敗", "error");
            //     })
            // }
        }
    }, [counter]);

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
            <React.Fragment>
                {
                    game_status?.game?.status === 'wait' ?
                    <WordleLobby
                        theme={theme}
                        classes={classes}
                        game={game}
                        game_status={game_status}
                        firebase_game_data={firebase_game_data}
                    />
                    :
                    game_status?.game?.status === 'start' || 'end' ?
                    <WordleGame
                        theme={theme}
                        classes={classes}
                        game={game}
                        game_status={game_status}
                        game_words={game_words}
                        turn_flag={turn_flag}
                        handleInputStack={handleInputStack}
                        input_stack={input_stack}
                        handleTypingStack={handleTypingStack}
                        handleDisplayInputComponentSelect={handleDisplayInputComponentSelect}
                        handleInputBackSpace={handleInputBackSpace}
                        handleInputEnter={handleInputEnter}
                        loading={loading}
                        errata_list={errata_list}
                        display_input_component={display_input_component}
                    />
                    :
                    // game_status?.game?.status === 'end' ?
                    // <Backdrop open={true}>
                    //     <CircularProgress color="inherit" />
                    // </Backdrop>
                    // :
                    <Backdrop open={true}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                }
            </React.Fragment>
        )
	}
}

export default Wordle;