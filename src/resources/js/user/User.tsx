import React, { useEffect, useState, useRef } from 'react';
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
import { Avatar, Card, CardContent, Divider, Button, Collapse, IconButton, ButtonGroup, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { green, grey, yellow } from '@mui/material/colors';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { styled } from "@mui/material/styles";
import { alpha, createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { globalTheme } from '../Theme';
import WordleList from '../wordle/components/WordleList';

function User(): React.ReactElement {
    const location = useLocation();

    const {screen_name} = useParams<{screen_name: string}>();
    const [loading, setLoading] = useState(true);
    const [user_data, setUserData] = useState<any>({});
    const [follow, setFollow] = useState(false);
    const [myself, setMyself] = useState(false);
    const [key, setKey] = useState('');

    const [expanded, setExpanded] = useState(false);
    const [user_menu_anchor_el, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
    const is_menu_open = Boolean(user_menu_anchor_el);

    const [display_wordle_list, setDisplayWordleList] = useState<string | null>('wordles');

    // descriptionの展開 ///////////////////////////////////////////////////////////////////////
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    /////////////////////////////////////////////////////////////////////////

    // 設定メニュー関連 /////////////////////////////////////////////////////////////////////////
    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchorEl(event.currentTarget);
    };
    
    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    const more_horiz_id = 'user-menu';
    const render_user_menu = (
        <Menu
            anchorEl={user_menu_anchor_el}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            id={more_horiz_id}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={is_menu_open}
            onClose={handleUserMenuClose}
        >
            {/* 後で設定する */}
            <MenuItem onClick={handleUserMenuClose}>項目</MenuItem>
            <MenuItem onClick={handleUserMenuClose}>項目</MenuItem>
        </Menu>
    )
    /////////////////////////////////////////////////////////////////////////

    // 表示するWordleの種類を切り替える /////////////////////////////////////////////////////////////////////////
    const handleDisplayWordleListSelect = (event: any) => {
        setDisplayWordleList(event.currentTarget.value);
    }
    /////////////////////////////////////////////////////////////////////////

    // フォロー /////////////////////////////////////////////////////////////////////////
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
			  <CircularProgress color="inherit" />
			</Backdrop>
		)
    }
    else {
        return (
            <Container maxWidth={'lg'} key={key}>
                {render_user_menu}
                <Grid container spacing={2}>
                    {/* 左のエリア */}
                    <Grid item container xs={4} spacing={2} height={'fit-content'}>
                        {/* ユーザー情報 */}
                        <Grid item xs={12}>
                            <Card elevation={1} sx={{minWidth: '100%'}}>
                                <CardContent sx={{paddingBottom: 0}}>
                                    <Grid container spacing={1} sx={{textAlign: 'center', position: 'relative'}}>
                                        {/* 設定メニュー */}
                                        <IconButton
                                            sx={{position: 'absolute', top: 0, right: '12px'}}
                                            edge="end"
                                            aria-label="show setting and others"
                                            aria-controls={more_horiz_id}
                                            aria-haspopup="true"
                                            onClick={handleUserMenuOpen}
                                            color="inherit"
                                        >
                                            <MoreHorizIcon />
                                        </IconButton>
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
                                        <Grid item xs={12} sx={{marginTop: 2, textAlign: 'left', whiteSpace: 'pre-line'}}>
                                            <Collapse in={expanded} collapsedSize={'9em'}>
                                                <Typography sx={{color: grey[700]}}>{user_data.description}</Typography>
                                            </Collapse>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                {/* descriptionを展開するボタン */}
                                {/* 高さが設定値未満でもMOREが出てしまうが、手間なので妥協している */}
                                <Button
                                    fullWidth
                                    onClick={handleExpandClick}
                                    startIcon={expanded ? <ExpandLess /> : <ExpandMore />}
                                >
                                    {expanded ? "LESS" : "MORE"}
                                </Button>
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
                    <Grid item container xs={8} spacing={2} height={'fit-content'}>
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
                                        style={{fontWeight: 'bold'}}
                                        sx={display_wordle_list === input ? {color: '#fff', backgroundColor: globalTheme.palette.primary.main, ":hover": {backgroundColor: globalTheme.palette.primary.main}} : {}}
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
                            {/* {
                                display_wordle_list === 'wordles' ?
                                <WordleList
                                    wordle_get_api_method={''}
                                    request_params={''}
                                    listening_channel={''}
                                    listening_event={''}
                                    key={''}
                                />
                                :
                                display_wordle_list === 'game_results' ?
                                <WordleList
                                    wordle_get_api_method={}
                                    request_params={}
                                    listening_channel={}
                                    listening_event={}
                                    key={}
                                />
                                :
                                display_wordle_list === 'likes' ?
                                <WordleList
                                    wordle_get_api_method={}
                                    request_params={}
                                    listening_channel={}
                                    listening_event={}
                                    key={}
                                />
                                : <></>
                            } */}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default User;