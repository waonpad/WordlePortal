import React, { useState, useEffect } from 'react';

import firebaseApp from "../contexts/FirebaseConfig";

function FirebaseTest(): React.ReactElement {

    useEffect(() => {
        firebaseApp.database().ref('sample').update({
            // 追加するデータをJSON形式で書く。
            key3: 'value3'
        });

        // データをとってくる
        firebaseApp.database().ref().child("sample").get().then((snapshot) => {
            // データがあったらuserNameの項目に登録されているものをとってきて、コンソールに表示する。
            if (snapshot.exists()) {
                console.log(snapshot.val());
            // もしデータが無かったらエラーをコンソールに表示する
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [])

    return (
        <React.Fragment>

        </React.Fragment>
    )
}

export default FirebaseTest;