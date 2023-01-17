import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useLocation, useHistory } from "react-router-dom";
import axios from 'axios';
import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import UserPrimaryDetail from './components/UserPrimaryDetail';
import WordleList from '../wordle/components/wordlelist/components/WordleList';
import GameList from '../wordle/components/gamelist/components/GameList';
import SuspensePrimary from '../common/suspense/suspenseprimary/components/SuspensePrimary';
import ButtonGroupPrimary from '../common/button/buttongroupprimary/components/ButtonGroupPrimary';
import UserList from './components/UserList';
import { useCustomPath } from '../contexts/CustomPathContext';
import ParticalRenderLink from '../common/link/particalrenderlink/components/ParticalRenderLink';

function User(props: any): React.ReactElement {
    const location = useLocation();
    const history = useHistory();
    const custom_path = useCustomPath();
    const {screen_name} = useParams<{screen_name: string}>();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>({});
    const [key, setKey] = useState('');
    const [expanded, setExpanded] = useState(false);

    const partical_render_route_paths = [
        `/user/:screen_name`,
        `/user/:screen_name/follows`,
        `/user/:screen_name/followers`,
        `/user/:screen_name/wordle`,
        `/user/:screen_name/wordle/game`,
        `/user/:screen_name/wordle/like`,
    ];

    // データ取得 /////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        console.log('props');
        console.log(props);
        custom_path?.changePath({
            path: props.location.pathname,
            route_path: props.match.path,
            params: props.match.params
        })
        setExpanded(false);
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

    const handlePathCheck = (event: any) => {
        console.log(location);
        console.log(history);
    }

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
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant='outlined'
                                sx={{fontWeight: 'bold', pointerEvents: 'none', backgroundColor: '#fffcustom_path?.path.path'}}
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
                        {
                            custom_path?.path.path === `/user/${screen_name}/follows` || custom_path?.path.path === `/user/${screen_name}/followers` ?
                            <Grid item xs={12}>
                                <UserList
                                    head={
                                        <ButtonGroupPrimary
                                            head={true}
                                            items={[
                                                {
                                                    text: 'Follows',
                                                    value: 'follows',
                                                    link: {
                                                        path: {
                                                            path: `/user/${screen_name}/follows`,
                                                            route_path: `/user/:screen_name/follows`,
                                                            params: {screen_name: screen_name}
                                                        },
                                                        partical_render_route_paths: partical_render_route_paths
                                                    },
                                                    active: custom_path?.path.path === `/user/${screen_name}/follows`
                                                },
                                                {
                                                    text: 'Followers',
                                                    value: 'followers',
                                                    link: {
                                                        path: {
                                                            path: `/user/${screen_name}/followers`,
                                                            route_path: `/user/:screen_name/followers`,
                                                            params: {screen_name: screen_name}
                                                        },
                                                        partical_render_route_paths: partical_render_route_paths
                                                    },
                                                    active: custom_path?.path.path === `/user/${screen_name}/followers`
                                                },
                                            ]}
                                        />
                                    }
                                    request_config={{
                                        api_url: `user/${custom_path?.path.path === `/user/${screen_name}/follows` ? 'follows' : custom_path?.path.path === `/user/${screen_name}/followers` ? 'followers' : ''}`,
                                        params: {screen_name: screen_name},
                                        response_keys: ['users'],
                                    }}
                                    listen={false}
                                    no_item_text={custom_path?.path.path === `/user/${screen_name}/follows` ? 'No Follows' : custom_path?.path.path === `/user/${screen_name}/followers` ? 'No Followers' : ''}
                                    key={key + custom_path?.path.path}
                                />
                            </Grid>
                            :
                            // TODO: 表示の分岐を増やすならここの条件を詳しくする必要がある
                            <React.Fragment>
                                <Grid item xs={12}>
                                    <ButtonGroupPrimary
                                        items={[
                                            {
                                                text: 'Wordles',
                                                value: 'wordles',
                                                link: {
                                                    path: {
                                                        path: `/user/${screen_name}/wordle`,
                                                        route_path: `/user/:screen_name/wordle`,
                                                        params: {screen_name: screen_name}
                                                    },
                                                    partical_render_route_paths: partical_render_route_paths
                                                },
                                                active: custom_path?.path.path === `/user/${screen_name}/wordle` || custom_path?.path.path === `/user/${screen_name}`
                                            },
                                            {
                                                text: 'GAME RESULTS',
                                                value: 'game_results',
                                                link: {
                                                    path: {
                                                        path: `/user/${screen_name}/wordle/game`,
                                                        route_path: `/user/:screen_name/wordle/game`,
                                                        params: {screen_name: screen_name}
                                                    },
                                                    partical_render_route_paths: partical_render_route_paths
                                                },
                                                active: custom_path?.path.path === `/user/${screen_name}/wordle/game`
                                            },
                                            {
                                                text: 'LIKES',
                                                value: 'likes',
                                                link: {
                                                    path: {
                                                        path: `/user/${screen_name}/wordle/like`,
                                                        route_path: `/user/:screen_name/wordle/like`,
                                                        params: {screen_name: screen_name}
                                                    },
                                                    partical_render_route_paths: partical_render_route_paths
                                                },
                                                active: custom_path?.path.path === `/user/${screen_name}/wordle/like`
                                            }
                                        ]}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        custom_path?.path.path === `/user/${screen_name}/wordle` || custom_path?.path.path === `/user/${screen_name}` ?
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
                                        custom_path?.path.path === `/user/${screen_name}/wordle/game` ?
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
                                        custom_path?.path.path === `/user/${screen_name}/wordle/like` ?
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
                            </React.Fragment>
                        }
                    </Grid>
                </Grid>
            </Container>
        </SuspensePrimary>
    );
}

export default User;