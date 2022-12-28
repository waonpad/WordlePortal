import React, { useEffect, useState, useRef } from 'react';
// import ReactLoading from 'react-loading';
import ReactDOM from 'react-dom';
import { Link, useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import swal from "sweetalert";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Avatar, Card, CardContent, Divider, Button, Collapse, IconButton, ButtonGroup, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { green, grey, yellow } from '@mui/material/colors';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import UserPrimaryDetail from './components/UserPrimaryDetail';

import { globalTheme } from '../Theme';
import WordleList from '../wordle/components/WordleList';
import GameList from '../wordle/components/GameList';

function User(): React.ReactElement {
    const location = useLocation();

    const {screen_name} = useParams<{screen_name: string}>();
    const [loading, setLoading] = useState(true);
    const [user_data, setUserData] = useState<any>({});
    const [follow, setFollow] = useState(false);
    const [myself, setMyself] = useState(false);
    const [key, setKey] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [display_wordle_list, setDisplayWordleList] = useState<string | null>('wordles');

    // 表示するWordleの種類を切り替える /////////////////////////////////////////////////////////////////////////
    const handleDisplayWordleListSelect = (event: any) => {
        setDisplayWordleList(event.currentTarget.value);
    }
    /////////////////////////////////////////////////////////////////////////

    // データ取得 /////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        setExpanded(false)
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
    /////////////////////////////////////////////////////////////////////////

    if(loading) {
		return (
			<Backdrop open={true}>
			    <CircularProgress/>
			</Backdrop>
		)
    }
    else {
        return (
            <Container maxWidth={'lg'} key={key}>
                <Grid container spacing={2}>
                    {/* 左のエリア */}
                    <Grid item container xs={4} spacing={2} height={'fit-content'}>
                        {/* ユーザー情報 */}
                        <Grid item xs={12}>
                            <UserPrimaryDetail
                                user_data={user_data}
                                myself={myself}
                                follow={follow}
                                setFollow={setFollow}
                                expanded={expanded}
                                setExpanded={setExpanded}
                            />
                        </Grid>
                        {/* フォロー中のタグ？ */}
                        <Grid item xs={12}>
                            <Paper elevation={1} sx={{minWidth: '100%'}}>
                                <Typography>Paper</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    {/* 右のエリア */}
                    <Grid item container xs={8} spacing={2} height={'fit-content'}>
                        {/* 成績 */}
                        <Grid item xs={12}>
                            <Paper elevation={1} sx={{minWidth: '100%'}}>
                                <Typography>Paper</Typography>
                            </Paper>
                        </Grid>
                        {/* 待機中のゲーム */}
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant='outlined'
                                sx={{fontWeight: 'bold', pointerEvents: 'none', backgroundColor: '#fff'}}
                            >
                                Join Game!
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <GameList
                                game_status={['wait', 'start']}
                                game_get_api_method={'user/show'}
                                request_params={{screen_name: screen_name}}
                                response_keys={['user', 'games']}
                                listen={false}
                                key={key + 'games'}
                            />
                        </Grid>
                        {/* 表示するWordleの種類選択エリア */}
                        <Grid item xs={12}>
                            <ButtonGroup
                                fullWidth
                                variant='outlined'
                                aria-label="outlined primary button group"
                            >
                                {(['wordles', 'game_results', 'likes']).map((input, index) => (
                                    <Button
                                        key={index}
                                        value={input}
                                        sx={display_wordle_list === input ? {fontWeight: 'bold', color: '#fff', backgroundColor: globalTheme.palette.primary.main, ":hover": {backgroundColor: globalTheme.palette.primary.main}} : {fontWeight: 'bold', backgroundColor: '#fff'}}
                                        onClick={handleDisplayWordleListSelect}
                                    >
                                        {
                                            input === 'wordles' ? 'WORDLES'
                                            : input === 'game_results' ? 'GAME RESULTS'
                                            : input === 'likes' ? 'LIKES'
                                            : ''
                                        }
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </Grid>
                        {/* Wordle */}
                        <Grid item xs={12}>
                            {
                                display_wordle_list === 'wordles' ?
                                <WordleList
                                    wordle_get_api_method={'user/show'}
                                    request_params={{screen_name: screen_name}}
                                    response_keys={['user', 'wordles']}
                                    listen={false}
                                    key={key + 'wordles'}
                                />
                                :
                                display_wordle_list === 'game_results' ?
                                <GameList
                                    game_status={['end']}
                                    game_get_api_method={'user/show'}
                                    request_params={{screen_name: screen_name}}
                                    response_keys={['user', 'joining_games']}
                                    listen={false}
                                    key={key + 'games'}
                                />
                                :
                                display_wordle_list === 'likes' ?
                                <WordleList
                                    wordle_get_api_method={'user/show'}
                                    request_params={{screen_name: screen_name}}
                                    response_keys={['user', 'wordle_likes']}
                                    listen={false}
                                    key={key + 'wordle_likes'}
                                />
                                : <></>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default User;