import React, { useState, useEffect, useRef } from 'react';
import swal from "sweetalert";
import { useParams, useHistory } from "react-router-dom";
import axios from 'axios';
import { CircularProgress, Backdrop } from '@mui/material';
import {useAuth} from "@/contexts/AuthContext";
import { GameWords, ErrataList, DisplayInputComponent } from '@/wordle/types/WordleType';
import WordleLobby from '@/wordle/wordle/components/WordleLobby';
import WordleGame from '@/wordle/wordle/components/WordleGame';
import firebaseApp from '@/contexts/FirebaseConfig';
import { push } from '@firebase/database'
import { serverTimestamp } from 'firebase/database';
import SuspensePrimary from '@/common/suspense/suspenseprimary/components/SuspensePrimary';

declare var window: {
    Echo: any;
}

function Wordle(): React.ReactElement {
    const auth = useAuth();
    const {game_uuid} = useParams<{game_uuid: string}>();
    const [game_status, setGameStatus] = useState<any>();
    const [game_words, setGameWords] = useState<GameWords>([]);
    const [firebase_game_data, setFirebaseGameData] = useState<any>();
    const [input_stack, setInputStack] = useState<any[]>([]);
    const [errata_list, setErrataList] = useState<ErrataList>({
        matchs: [],
        exists: [],
        not_exists: []
    });
    const [turn_flag, setTurnFlag] = useState<boolean>(false);
    const [display_input_component, setDisplayInputComponent] = useState<DisplayInputComponent>(null); 
    const [initial_load, setInitialLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    const [counter, setCounter] = useState<number>();
    
    const ref = firebaseApp.database().ref(`wordle/games/${game_uuid}`);
    const connection = useRef<{
        listener: number | null;
        // ref: ThenableReference | null;
        ref: any;
    }>({ listener: null, ref: null });

	useEffect(() => {
        /////////////////////////////////////////////////////////////////////////
        const user_id = auth!.user!.id.toString();
        axios.get('/api/wordle/game/show', {params: {game_uuid: game_uuid}}).then(res => {
            if (res.data.status === true) {
                const game = res.data.game;

                const firebase_game = ref.once('value', (snapshot) => {
                    if (snapshot.val()) {
                        const firbase_game_users = snapshot.val().users;
                        const connected_firebase_game_users = firbase_game_users ? Object.keys(firbase_game_users).filter((key) => (
                            snapshot.val().users[key].status === 'connect' && key !== `u${user_id}`
                        )).map((key) => (
                            snapshot.val().users[key]
                        )) : [];
                        
                        console.log(snapshot.val());
                        console.log(game.game_users.filter((game_user: any) => (game_user.user_id === auth!.user!.id)))
                        console.log(connected_firebase_game_users);
                        if(
                            (game.status !== 'end' && connected_firebase_game_users.length === 0 && snapshot.val().joined !== false) // 参加ユーザーがいない
                            ||
                            (game.status === 'end' && game.game_users.filter((game_user: any) => (game_user.user_id === auth!.user!.id)).length === 0) // 終了していて参加者ではない
                            ||
                            (game.status === 'start' && game.game_users.filter((game_user: any) => (game_user.user_id === auth!.user!.id)).length === 0) //startしていて、制限人数が1でない、且つゲーム参加者ではない
                            ||
                            (connected_firebase_game_users.length === game.max_participants) // 満員
                        ) {
                            swal("Error", "ゲームが存在しないか参加できない", "error");
                        }
                        else {
                            console.log('接続');

                            // game作成から一人目が入るまではconnectしているユーザーが0でも参加できるようにフラグがある
                            ref.update({
                                ...snapshot.val(),
                                joined: true
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

                                    await ref.child(`users/u${user_id}`).onDisconnect().update({
                                        user: auth!.user,
                                        status: 'disconnect'
                                    });
                    
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
                                    console.log('firebaseのデータが更新された');
                                    console.log(snapshot.val());
                                    setFirebaseGameData(snapshot.val())
                                }
                                else {
                                    console.log("No data available");
                                }
                            })
            
                            const current_game_status = res.data.current_game_status;
                            console.log(current_game_status);
            
                            setGameStatus(current_game_status);
            
                            window.Echo.join('game_play.' + game.uuid)
                            .listen('GamePlayEvent', (e: any) => {
                                console.log('listen');
                                console.log(e);
            
                                setGameStatus(e.current_game_status);
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
                        }
                    }
                });
            }
            else if(res.data.status === false) {
                // 参加できなかった時の処理
                swal("Error", res.data.message, "error");
            }
        })

        // ページ遷移でdisconnectする
        return () => {
            ref.child(`users/u${user_id}`).update({
                user: auth!.user,
                status: 'disconnect'
            });
        }
	}, [])
    
    // update board ///////////////////////////////////////////////////////////////////////
    const updateBoard = (updated_input_stack: any[]) => {
        const target_game_word_index = game_status.board.length;
        setGameWords((game_words) => (game_words as any[]).map((game_word, index) => (index === target_game_word_index ? updated_input_stack : game_word)));
    }
    /////////////////////////////////////////////////////////////////////////

    // input ///////////////////////////////////////////////////////////////////////
    const handleInputStack = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const target_character = String(event.currentTarget.getAttribute('data-character-value'));
        const target_input_stack_index = input_stack.findIndex(function(character) {
            return character.character === '';
        });

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

        for(var i = current_value.length; i < game_status.game.max; i++) {
            updated_input_stack.push({
                character: '',
                errata: 'plain'
            })
        }

        setInputStack(updated_input_stack);
        updateBoard(updated_input_stack.slice(0, game_status.game.max));
    }
    /////////////////////////////////////////////////////////////////////////

    // enter ///////////////////////////////////////////////////////////////////////
    const handleInputEnter = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setLoading(true)

        const data = {
            game_uuid: game_uuid,
            input: input_stack.map((character) => (character['character'])).slice(0, game_status.game.max),
            game_users: firebase_game_data.users
        };

        console.log(data);

        axios.post('/api/wordle/game/input', data).then(res => {
            if(res.data.status === true) {
                const default_input_stack: any[] = [];
                ([...Array(game_status.game.max)]).forEach(() => {
                    default_input_stack.push({
                        character: '',
                        errata: 'plain',
                    })
                });
                setInputStack(default_input_stack);
            }
            else if (res.data.status === false) {
                // 失敗時の処理
            }
            setLoading(false);
        })
    }
    /////////////////////////////////////////////////////////////////////////

    // ゲームの状態が変わったときの処理まとめ ///////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if(game_status !== undefined) {
            if(game_status.game.status !== 'wait') {

                // gameがstartしていてgame_wordsのデフォルト値が入っていなかったら入れる
                if((game_words as any[]).length === 0) {
                    const default_game_words: any[] = [];
            
                    const rows = game_status.game_users.length * game_status.game.laps;
                    // const rows = 10; // test
                    const max = game_status.game.max;
                    // const max = 6; // test
                    ([...Array(rows)]).forEach((row, index) => {
                        if(game_status.board[index]) {
                            default_game_words.push(game_status.board[index]);
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

                    setErrataList(game_status.errata);
                    setGameWords(default_game_words);
                    setDisplayInputComponent(game_status.game.input[0]);
    
                    const default_input_stack: any[] = [];
                    ([...Array(max)]).forEach(() => {
                        default_input_stack.push({
                            character: '',
                            errata: 'plain',
                        })
                    });
                    setInputStack(default_input_stack);
                }

                // ターン(inputエリアの入力可否)切り替え
                if(auth?.user?.id === game_status.next_input_user && game_status.game.status === 'start') {
                    console.log('ターンプレイヤーです');
                    setTurnFlag(true);
                }
                else {
                    console.log('ターンプレイヤーではありません');
                    setTurnFlag(false);
                }

                // inputの反映
                if(game_status.latest_game_log !== null && initial_load === false && game_status.latest_game_log.type === 'input') {
                    mergeErrata(game_status, game_words);
                }

                if(firebase_game_data !== undefined && game_status.game.status === 'start') {
                    // カウンターを動かすためのパラメータの処理
                    if(firebase_game_data.log_length < game_status.game_input_logs.length) {
                        console.log('firebaseのタイムスタンプを更新');
        
                        ref.update({
                            input_timestamp: serverTimestamp(),
                            log_length: game_status.game_input_logs.length
                        })
                    }
                    
                    // バックでゲームが開始されていてfirebaseに反映されていなければ反映する
                    if(firebase_game_data.status === 'wait') {
                        console.log('start');
            
                        ref.update({
                            status: 'start',
                            input_timestamp: serverTimestamp(),
                            log_length: 0
                        });
            
                        const actual_game_users = game_status.game_users;
    
                        console.log(actual_game_users);
            
                        actual_game_users.map((actual_game_user: any) => {
                            ref.child(`users/u${actual_game_user.user_id}`).update({
                                order: actual_game_user.order
                            })
                        })
                    }
                }
            }
            
            if(firebase_game_data !== undefined) {
                // バックでゲームが終了していてfirebaseに反映されていなければ反映する
                if(game_status.game.status === 'end') {
                    if(firebase_game_data.status === 'start') {
                        console.log('end');
            
                        ref.update({
                            status: 'end'
                        });
            
                        const actual_game_users = game_status.game_users;
            
                        actual_game_users.map((actual_game_user: any) => {
                            ref.child(`users/u${actual_game_user.user_id}`).update({
                                result: actual_game_user.result
                            })
                        })
                    }
                }
            }
            setInitialLoad(false);
        }
    }, [game_status])

    useEffect(() => {
        if(game_status !== undefined && firebase_game_data !== undefined) {
            console.log('firebaseのデータが更新された');
            console.log(firebase_game_data);

            // テスト済み 邪魔なのでコメントアウト
            // if(game_status.game.status === 'start') {
            //     // カウント
            //     if(game_status.game.answer_time_limit !== null) {
            //         console.log('reset counter');

            //         const input_timestamp = new Date((firebase_game_data.input_timestamp as any)).getTime();
            //         const answer_time_limit = game_status.game.answer_time_limit * 1000;
            //         const target_time = input_timestamp + answer_time_limit;
        
            //         setCounter(answer_time_limit);
            
            //         const timer = setInterval(() => {
            //             const remaining_time = target_time - new Date().getTime();
        
            //             setCounter(remaining_time / 1000 | 0);
        
            //             if(remaining_time <= 0) {
            //                 clearInterval(timer);
            //             }
            //         }, 1000)
            
            //         return () => {
            //             clearInterval(timer);
            //             console.log('clear counter');
            //         }
            //     }
            // }
        }
    }, [firebase_game_data]);
    /////////////////////////////////////////////////////////////////////////

    // counter ///////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if(counter !== undefined) {
            console.log(counter);
            // 指定時間更新が無かったら
            // ホストユーザーがログを更新する責務を負う
            // firebaseのstatusがconnectなユーザーの中でキーが若いユーザー順にホストになる
            if(counter <= 0 && game_status.game.status === 'start') {
                console.log('ターンスキップ');
    
                if(
                    auth!.user!.id === firebase_game_data.host ? true //自分がゲーム作成者である
                    :
                    (`u${firebase_game_data.host}` in Object.keys(firebase_game_data.users).filter((key) => (
                        firebase_game_data.users[key].status === 'connect'
                    ))) === false
                    &&
                    `u${auth!.user!.id.toString()}` === Object.keys(firebase_game_data.users).filter((key) => (
                        firebase_game_data.users[key].status === 'connect'
                    ))[0] ? true // ゲーム作成者が居ない場合、idが若いユーザー
                    :
                    false
                ) {
                    axios.post('/api/wordle/game/input', {game_uuid: game_uuid, skip: true, skip_user_id: game_status.next_input_user}).then(res => {
                        console.log(res);
                        if(res.data.status === true) {
                            console.log('送信成功');
                        }
                        else if (res.data.status === false) {
                            // 失敗時の処理
                            console.log('送信失敗');
                        }
                    })
                }
            }
        }
    }, [counter]);
    /////////////////////////////////////////////////////////////////////////

    // errata ///////////////////////////////////////////////////////////////////////
    const mergeErrata = (game_status: any, game_words: any) => {
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
            const sleep = (second: number) => new Promise(resolve => setTimeout(resolve, second * 500))

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

    // display input component ///////////////////////////////////////////////////////////////////////
    const handleDisplayInputComponentSelect = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const target_input = event.currentTarget.value;
        setDisplayInputComponent((target_input as DisplayInputComponent));
    }
    /////////////////////////////////////////////////////////////////////////

    // gamestart /////////////////////////////////////////////////////////////////////////
    const handleGameStart = (event: any) => {
        const data = {
            game_uuid: game_uuid,
            game_users: firebase_game_data.users
        }

        axios.post('/api/wordle/game/start', data).then(res => {
            if(res.data.status === true) {
                console.log('start posted');
            }
            else if (res.data.status === false) {
                // 失敗時の処理
            }
        })
    }
    /////////////////////////////////////////////////////////////////////////

    if(initial_load || firebase_game_data?.users == undefined || game_status == undefined) {
        return (<SuspensePrimary open={true} backdrop={true} />)
    }

    return (
        <React.Fragment>
            {
                game_status?.game?.status === 'wait' ?
                <WordleLobby
                    game_status={game_status}
                    firebase_game_data={firebase_game_data}
                    handleGameStart={handleGameStart}
                />
                :
                game_status?.game?.status === 'start' || game_status?.game?.status === 'end' ?
                <WordleGame
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
                    firebase_game_data={firebase_game_data}
                />
                // :
                // game_status?.game?.status === 'end' ?
                // <Backdrop open={true}>
                //     <CircularProgress/>
                // </Backdrop>
                :
                <></>
            }
        </React.Fragment>
    )
}

export default Wordle;