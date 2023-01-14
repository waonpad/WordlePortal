import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Avatar, Card, CardContent, Divider, Button, Collapse, IconButton, ButtonGroup, ToggleButtonGroup, ToggleButton } from '@mui/material';
import UserPrimaryDetail from './components/UserPrimaryDetail';
import { globalTheme } from '../Theme';
import WordleList from '../wordle/components/wordlelist/components/WordleList';
import GameList from '../wordle/components/gamelist/components/GameList';
import SuspensePrimary from '../common/suspense/suspenseprimary/components/SuspensePrimary';
import ButtonGroupPrimary from '../common/button/buttongroupprimary/components/ButtonGroupPrimary';

function User(): React.ReactElement {
    const location = useLocation();
    const {screen_name} = useParams<{screen_name: string}>();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>({});
    const [key, setKey] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [display_list_component, setDisplayListComponent] = useState<'wordles' | 'game_results' | 'likes'>('wordles');

    // 表示するWordleの種類を切り替える /////////////////////////////////////////////////////////////////////////
    const handleDisplayWordleListSelect = (event: any) => {
        setDisplayListComponent(event.currentTarget.value);
    }
    /////////////////////////////////////////////////////////////////////////

    // データ取得 /////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        setExpanded(false);
        setDisplayListComponent('wordles');
        setLoading(true);
        axios.get('/api/user/show', {params: {screen_name: screen_name}}).then(res => {
            if(res.data.status === true) {
                setUser(res.data.user);
                setKey(screen_name);
                setLoading(false);
            }
            else if (res.data.status === false) {
                // TODO: ユーザーが存在しない時の処理
            }
        })
    }, [location])
    /////////////////////////////////////////////////////////////////////////

    return (
        <SuspensePrimary open={loading} backdrop={true}>
            <Container maxWidth={'lg'} key={key}>
                <Grid container spacing={2}>
                    {/* 左のエリア */}
                    <Grid item container xs={4} spacing={2} height={'fit-content'}>
                        {/* ユーザー情報 */}
                        <Grid item xs={12}>
                            <UserPrimaryDetail
                                user={user}
                                setUser={setUser}
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
                                Join {user.name}'s Game!
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <GameList
                                game_status={['wait', 'start']} // start消す?
                                request_config={{
                                    api_url: 'wordle/game/user',
                                    params: {screen_name: screen_name},
                                    response_keys: ['games'],
                                }}
                                listen={false}
                                key={key + 'games'}
                            />
                        </Grid>
                        {/* 表示するWordleの種類選択エリア */}
                        <Grid item xs={12}>
                            <ButtonGroupPrimary
                                items={[
                                    {
                                        text: 'Wordles',
                                        value: 'wordles',
                                        onClick: handleDisplayWordleListSelect,
                                        active: display_list_component === 'wordles'
                                    },
                                    {
                                        text: 'GAME RESULTS',
                                        value: 'game_results',
                                        onClick: handleDisplayWordleListSelect,
                                        active: display_list_component === 'game_results'
                                    },
                                    {
                                        text: 'LIKES',
                                        value: 'likes',
                                        onClick: handleDisplayWordleListSelect,
                                        active: display_list_component === 'likes'
                                    }
                                ]}
                            />
                        </Grid>
                        {/* Wordle */}
                        <Grid item xs={12}>
                            {
                                display_list_component === 'wordles' ?
                                <WordleList
                                    request_config={{
                                        api_url: 'wordle/user',
                                        params: {screen_name: screen_name},
                                        response_keys: ['wordles'],
                                    }}
                                    listen={false}
                                    key={key + 'wordles'}
                                />
                                :
                                display_list_component === 'game_results' ?
                                <GameList
                                    game_status={['end']}
                                    request_config={{
                                        api_url: 'wordle/game/userjoining',
                                        params: {screen_name: screen_name},
                                        response_keys: ['games'],
                                    }}
                                    listen={false}
                                    key={key + 'games'}
                                />
                                :
                                display_list_component === 'likes' ?
                                <WordleList
                                    request_config={{
                                        api_url: 'wordle/userlikes',
                                        params: {screen_name: screen_name},
                                        response_keys: ['wordles'],
                                    }}
                                    listen={false}
                                    key={key + 'wordle_likes'}
                                />
                                : <></>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </SuspensePrimary>
    );
}

export default User;