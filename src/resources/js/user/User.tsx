import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import ReactDOM from 'react-dom';
import { Button, Card } from '@material-ui/core';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import swal from "sweetalert";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@mui/material/Container';

function User(): React.ReactElement {
    const {screen_name} = useParams<{screen_name: string}>();
    const [loading, setLoading] = useState(true);
    const [user_data, setUserData] = useState<any>({});
    const [follow, setFollow] = useState(false);
    const [myself, setMyself] = useState(false);

    const followToggle = () => {
        axios.post('/api/followtoggle', {screen_name: screen_name}).then(res => {
            console.log(res);
            if(res.data.status === true) {
                setFollow(res.data.follow);
            }
            else {
                swal("処理失敗", "処理失敗", "error");
            }
        }).catch(error => {
            console.log(error)
            swal("処理失敗", "処理失敗", "error");
        });
    }

    useEffect(() => {
        axios.get('/api/user/show', {params: {screen_name: screen_name}}).then(res => {
            console.log(res);
            if(res.data.status === true) {
                setUserData(res.data.user);
                setMyself(res.data.myself);
                setFollow(res.data.follow);
                setLoading(false);
            }
            else {
                swal("ユーザー情報取得失敗", "ユーザー情報取得失敗", "error");
            }
        }).catch(error => {
            console.log(error)
            swal("ユーザー情報取得失敗", "ユーザー情報取得失敗", "error");
        });
    }, [])

    if(loading) {
		return (
			<Backdrop open={true}>
			  <CircularProgress color="inherit" />
			</Backdrop>
		)
    }
    else {
        return (
            <Container maxWidth={'md'}>
                <h1>User:{screen_name}</h1>
                {
                    myself ? (
                        <Button>Edit Profile</Button>
                    ) : (
                        <Button onClick={followToggle}>{follow ? 'unFollow' : 'Follow'}</Button>
                    )
                }<br />
                {user_data.screen_name ? <span>{user_data.screen_name}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
                {user_data.name ? <span>{user_data.name}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
                {user_data.email ? <span>{user_data.email}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
                {user_data.description ? <span>{user_data.description}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
                {user_data.age ? <span>{user_data.age}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
                {user_data.gender ? <span>{user_data.gender}</span> : <ReactLoading type="spin" height="20px" width="20px" />}<br />
            </Container>
        );
    }
}

export default User;