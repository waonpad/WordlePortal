import { Typography } from '@material-ui/core';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import firebaseApp from "../contexts/FirebaseConfig";
import { getDatabase, push, ref, set, update, onValue, onDisconnect, child, orderByChild, equalTo, startAt, endAt } from '@firebase/database'
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';

type data = {
    [key: string]: {
        name: string
        msg: string
    }
}

function FirebaseTest(): React.ReactElement {

    const auth = useAuth();
    const {room_id} = useParams<{room_id: string}>();

    const [data, setData] = useState<data[]>([]);
    const [data_loading, setDataLoading] = useState<boolean>(true);

    const [name, setName] = useState<string>('');
    const [msg, setMsg] = useState<string>('');

    const handleChangeInputName = (event: any) => {
        setName(event.currentTarget.value);
    }

    const handleChangeInputMsg = (event: any) => {
        setMsg(event.currentTarget.value);
    }

    const handleSubmit = (event: any) => {
        const data = {
            name: name,
            msg: msg
        }
        
        // データ追加
        firebaseApp.database().ref('sample').push(data);
    }

    const handleRemoveItem = (event: any) => {
        const key = event.currentTarget.getAttribute('data-key');

        // データ削除
        firebaseApp.database().ref('sample').child(key).remove();
    }

    const handleUpdateItemUnchi = (event: any) => {
        const key = event.currentTarget.getAttribute('data-key');

        const prev_item = data[key];

        // データ更新
        firebaseApp.database().ref('sample').child(key).update({
            ...prev_item,
            msg: 'うんち！'
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
        const ref = firebaseApp.database().ref(`connections/rooms/${room_id}`);
    
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
                await ref.child(`users/${user_id}`).onDisconnect().update({
                    status: 'disconnect'
                });

                // 参加中のルームを設定する
                await ref.child(`users/${user_id}`).set({
                    status: 'connect'
                });
            });
        };
    
        connect().catch(() => {
        });
        
        // // ルーム内のデータの変更を監視
        // ref.on('value', (snapshot) => {
        //     if (snapshot.exists()) {
        //         console.log(snapshot.val());
        //         setData(snapshot.val());
        //     }
        //     else {
        //         console.log("No data available");
        //     }
        // })

        // setDataLoading(false);
    }, []);

    useEffect(() => {
        // データの変更を監視
        firebaseApp.database().ref('sample').on('value', (snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                setData(snapshot.val());
            }
            else {
                console.log("No data available");
            }
        })

        setDataLoading(false);
    }, [])

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
            {
                !data_loading ? (
                    <Grid container>
                        {Object.keys(data).map((key: any, index) => (
                            <Grid item xs={12} key={index} sx={{display: 'flex'}}>
                                <Typography>{data[key].name} : {data[key].msg}</Typography>
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