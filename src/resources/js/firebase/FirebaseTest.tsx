import { Typography } from '@material-ui/core';
import { Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import firebaseApp from "../contexts/FirebaseConfig";

type data = {
    [key: string]: {
        name: string
        msg: string
    }
}

function FirebaseTest(): React.ReactElement {

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

    useEffect(() => {
        // データ追加
        // firebaseApp.database().ref('sample').push(
        //     {
        //         name: 'waon',
        //         msg: 'おはよう'
        //     }
        // );

        // データ取得(一度)
        // firebaseApp.database().ref().child("sample").get().then((snapshot) => {
        //     // データがあったらuserNameの項目に登録されているものをとってきて、コンソールに表示する。
        //     if (snapshot.exists()) {
        //         console.log(snapshot.val());
        //         setData(snapshot.val());
        //     // もしデータが無かったらエラーをコンソールに表示する
        //     } else {
        //         console.log("No data available");
        //     }
        // }).catch((error) => {
        //     console.error(error);
        // });

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
                onClick={handleSubmit}
            >
                Submit
            </Button>
            {
                !data_loading ? (
                    <Box>
                        {Object.keys(data).map((key: any, index) => (
                            <Typography key={index}>{data[key].name} : {data[key].msg}</Typography>
                        ))}
                    </Box>
                )
                : (
                    <Box></Box>
                )
            }
        </React.Fragment>
    )
}

export default FirebaseTest;