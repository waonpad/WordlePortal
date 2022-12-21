import { Typography } from '@material-ui/core';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import firebaseApp from "../../contexts/FirebaseConfig";
import { getDatabase, push, ref, set, update, onValue, onDisconnect, child, orderByChild, equalTo, startAt, endAt } from '@firebase/database'
import { serverTimestamp } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import { useParams } from 'react-router-dom';

type Posts = {
    [key: string]: {
        name: string
        msg: string
        time: any
    }
}

type FirebaseGameData = {
    posts?: Posts[]
    users?: any
    host?: any,
    current_order?: number
    time_limit?: number
    status?: 'wait' | 'start' | 'end'
}

function FirebaseTest(): React.ReactElement {

    const auth = useAuth();
    const {room_id} = useParams<{room_id: string}>();

    const [data, setData] = useState<FirebaseGameData>();
    const [data_loading, setDataLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<Posts[]>([]);

    const ref = firebaseApp.database().ref(`connections/rooms/${room_id}`);
    const [name, setName] = useState<string>('');
    const [msg, setMsg] = useState<string>('');
    const [counter, setCounter] = useState<number>();

    const handleChangeInputName = (event: any) => {
        setName(event.currentTarget.value);
    }

    const handleChangeInputMsg = (event: any) => {
        setMsg(event.currentTarget.value);
    }

    const handleSubmit = (event: any) => {
        // データ追加
        ref.child('posts').push({
            name: name,
            msg: msg,
            time: serverTimestamp()
        });
    }

    const handleRemoveItem = (event: any) => {
        const key = event.currentTarget.getAttribute('data-key');

        // データ削除
        ref.child('posts').child(key).remove();
    }

    const handleUpdateItemUnchi = (event: any) => {
        const key = event.currentTarget.getAttribute('data-key');

        const prev = data!.posts![key];

        // データ更新
        ref.child('posts').child(key).update({
            ...prev,
            msg: 'うんち！',
            time: serverTimestamp()
        });
    }

    // 今回は簡易的に(ルーム)ゲームごとにコネクションを管理する
    const connection = useRef<{
    listener: number | null;
    // ref: ThenableReference | null;
    ref: any;
    }>({ listener: null, ref: null });
    
    useEffect(() => {
        const connected_info_ref = firebaseApp.database().ref(".info/connected");
        const user_id = auth!.user!.id.toString();
    
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
                    status: 'disconnect'
                });

                // 参加中のルームを設定する
                await ref.child(`users/u${user_id}`).set({
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
                setData(snapshot.val());
                setPosts(snapshot.val().posts);

                setDataLoading(false);
            }
            else {
                console.log("No data available");
            }
        })
    }, []);

    // 新しい入力があったときに発火させる
    // 妥協してクライアント側でカウントダウンする
    // useEffect(() => {
    //     console.log('reset counter');
    //     setCounter(30);

    //     const timer = setInterval(() => {
    //         setCounter(counter => counter! - 1);
    //     }, 1000)

    //     return () => {
    //         clearInterval(timer);
    //         console.log('clear counter');
    //     }
    // }, [posts]);

    // useEffect(() => {
    //     console.log(counter);
    //     // 指定時間更新が無かったら
    //     // ホストユーザーがログを更新する責務を負う
    //     // TODO: ホストが切断された時のホスト変更処理 どういう優先順位でホストを付与する？
    //     // if(counter === 0 && auth!.user!.id === data!.host) {
    //     if(counter === 0) {
    //         ref.child('posts').push({
    //             name: '',
    //             msg: '',
    //             time: serverTimestamp()
    //         })
    //     }
    // }, [counter]);

    return (
        <React.Fragment>
            <TextField
                value={name}
                label="name"
                onChange={handleChangeInputName}
            />
            <TextField
                value={msg}
                label="msg"
                onChange={handleChangeInputMsg}
            />
            <Button
                type='button'
                variant='contained'
                onClick={handleSubmit}
            >
                Submit
            </Button>
            <Typography>{counter}</Typography>
            {
                !data_loading ? (
                    <Grid container>
                        {Object.keys(data!.posts!).map((key: any, index) => (
                            <Grid item xs={12} key={index} sx={{display: 'flex'}}>
                                <Typography>{new Date((data!.posts![key].time as any)).toLocaleString()} : {data!.posts![key].name} : {data!.posts![key].msg}</Typography>
                                <Button
                                    data-key={key}
                                    onClick={handleRemoveItem}
                                    variant='contained'
                                >
                                    削除
                                </Button>
                                <Button
                                    data-key={key}
                                    onClick={handleUpdateItemUnchi}
                                    variant='contained'
                                >
                                    うんちにする
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                )
                : (
                    <Box></Box>
                )
            }
        </React.Fragment>
    )
}

export default FirebaseTest;