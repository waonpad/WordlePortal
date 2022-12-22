import React, { useEffect, useState } from 'react';
// import ReactLoading from 'react-loading';
import ReactDOM from 'react-dom';
import { Link, useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import swal from "sweetalert";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Avatar, Card, CardContent, Divider, Button } from '@mui/material';
import { green, grey, yellow } from '@mui/material/colors';
import { alpha, createStyles, makeStyles, Theme } from '@material-ui/core/styles'

function User(): React.ReactElement {
    const location = useLocation();

    const {screen_name} = useParams<{screen_name: string}>();
    const [loading, setLoading] = useState(true);
    const [user_data, setUserData] = useState<any>({});
    const [follow, setFollow] = useState(false);
    const [myself, setMyself] = useState(false);
    const [key, setKey] = useState('');

    const followToggle = () => {
        axios.post('/api/user/followtoggle', {screen_name: screen_name}).then(res => {
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
        setLoading(true);
        axios.get('/api/user/show', {params: {screen_name: screen_name}}).then(res => {
            console.log(res);
            if(res.data.status === true) {
                setUserData(res.data.user);
                setMyself(res.data.myself);
                setFollow(res.data.follow);
                setKey(screen_name);
                setLoading(false);
            }
            else {
                swal("ユーザー情報取得失敗", "ユーザー情報取得失敗", "error");
            }
        }).catch(error => {
            console.log(error)
            swal("ユーザー情報取得失敗", "ユーザー情報取得失敗", "error");
        });
    }, [location])

    if(loading) {
		return (
			<Backdrop open={true}>
			  <CircularProgress color="inherit" />
			</Backdrop>
		)
    }
    else {
        return (
            <Container maxWidth={'lg'} key={key}>
                <Grid container spacing={2}>
                    {/* 左のエリア */}
                    <Grid item container xs={4} spacing={2}>
                        {/* ユーザー情報 */}
                        <Grid item xs={12}>
                            <Card elevation={1} sx={{minWidth: '100%'}}>
                                <CardContent>
                                    <Grid container spacing={1} sx={{textAlign: 'center'}}>
                                        <Grid item xs={12} sx={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
                                            {user_data.icon !== null ? <Avatar src={`data:image/jpeg;base64,${user_data.icon}`} sx={{height: '100px', width: '100px'}} /> : <Avatar sx={{height: '100px', width: '100px'}}>A</Avatar>}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography fontSize={28}>
                                                {user_data.name}
                                            </Typography>
                                            <Typography color={grey[500]}>
                                                @{user_data.screen_name}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sx={{marginTop: 1}}>
                                            {
                                                myself ? (
                                                    <Button variant='outlined' fullWidth>Edit Profile</Button>
                                                ) : (
                                                    <Button variant='outlined' fullWidth onClick={followToggle}>{follow ? 'unFollow' : 'Follow'}</Button>
                                                )
                                            }
                                        </Grid>
                                        {/* <Grid item xs={12} sx={{marginTop: 2}}>
                                            <Divider sx={{backgroundColor: '#000'}}/>
                                        </Grid> */}
                                        <Grid item container xs={12} spacing={1} sx={{marginTop: 0.5}}>
                                            <Grid item xs={4}>
                                                {/* 投稿数をカウント */}
                                                <Typography color={grey[700]}>0</Typography>
                                                <Typography color={grey[500]}>Post</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography color={grey[700]}>{user_data.follows.length}</Typography>
                                                <Typography color={grey[500]}>Follow</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography color={grey[700]}>{user_data.followers.length}</Typography>
                                                <Typography color={grey[500]}>Follower</Typography>
                                            </Grid>
                                        </Grid>
                                        {/* description */}
                                        {/* 長すぎるものは開閉できるようにする */}
                                        {/* https://teech-lab.com/react-typescript-material-ui-card-collapse/1979/ */}
                                        <Grid item xs={12} sx={{marginTop: 2, textAlign: 'left', whiteSpace: 'pre-line'}}>
                                            <Typography sx={{color: grey[700]}}>{user_data.description}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        {/* フォロー中のタグ？ */}
                        <Grid item xs={12}>
                            <Paper elevation={1} sx={{minWidth: '100%'}}>
                                <Typography>Paper</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    {/* 右のエリア */}
                    <Grid item container xs={8} spacing={2}>
                        {/* 成績 */}
                        <Grid item xs={12}>
                            <Paper elevation={1} sx={{minWidth: '100%'}}>
                                <Typography>Paper</Typography>
                            </Paper>
                        </Grid>
                        {/* 待機中のゲーム */}
                        <Grid item xs={12}>
                            <Paper elevation={1} sx={{minWidth: '100%'}}>
                                <Typography>Paper</Typography>
                            </Paper>
                        </Grid>
                        {/* Wordle */}
                        <Grid item xs={7}>
                            <Paper elevation={1} sx={{minWidth: '100%'}}>
                                <Typography>Paper</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default User;