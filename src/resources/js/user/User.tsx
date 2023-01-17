import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
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
    const custom_path = useCustomPath();
    const {screen_name} = useParams<{screen_name: string}>();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>({});
    const [key, setKey] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [router_path, setRouterPath] = useState<string>(props.match.path);

    // 見かけ上のパスを変超するやつ /////////////////////////////////////////////////////////////////////////
    const handleChangePath = (event: any) => {
        event.preventDefault();

        // custom_path?.changePath(event.currentTarget.getAttribute('data-path'));

        history.pushState(null, '', event.currentTarget.getAttribute('data-path'));
        setRouterPath(event.currentTarget.getAttribute('data-router-path'));
    }
    /////////////////////////////////////////////////////////////////////////

    // データ取得 /////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        console.log(props);
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

    return (
        <SuspensePrimary open={loading} backdrop={true}>
            <Container maxWidth={'lg'} key={key}>
                {/* <Box sx={{display: 'flex'}}>
                    <Button onClick={handleChangePath}>change path</Button>
                    <ParticalRenderLink
                        path={`/user/${screen_name}/follows`}
                        partical_render_path={[`/user/${screen_name}/follows`, `/user/${screen_name}/followers`]}
                    >
                        <Button>{custom_path?.path}</Button>
                    </ParticalRenderLink>
                </Box> */}
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
                        {
                            router_path === '/user/:screen_name/follows' || router_path === '/user/:screen_name/followers' ?
                            <Grid item xs={12}>
                                <UserList
                                    head={
                                        <ButtonGroupPrimary
                                            head={true}
                                            items={[
                                                {
                                                    text: 'Follows',
                                                    value: 'follows',
                                                    link: `/user/${screen_name}/follows`,
                                                    attributes: {
                                                        'data-path': `/user/${screen_name}/follows`,
                                                        'data-router-path': '/user/:screen_name/follows'
                                                    },
                                                    onClick: handleChangePath,
                                                    active: router_path === '/user/:screen_name/follows'
                                                },
                                                {
                                                    text: 'Followers',
                                                    value: 'followers',
                                                    link: `/user/${screen_name}/followers`,
                                                    attributes: {
                                                        'data-path': `/user/${screen_name}/followers`,
                                                        'data-router-path': '/user/:screen_name/followers'
                                                    },
                                                    onClick: handleChangePath,
                                                    active: router_path === '/user/:screen_name/followers'
                                                },
                                            ]}
                                        />
                                    }
                                    request_config={{
                                        api_url: `user/${router_path === '/user/:screen_name/follows' ? 'follows' : router_path === '/user/:screen_name/followers' ? 'followers' : ''}`,
                                        params: {screen_name: screen_name},
                                        response_keys: ['users'],
                                    }}
                                    listen={false}
                                    no_item_text={router_path === '/user/:screen_name/follows' ? 'No Follows' : router_path === '/user/:screen_name/followers' ? 'No Followers' : ''}
                                    key={key + router_path}
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
                                                link: `/user/${screen_name}/wordle`,
                                                attributes: {
                                                    'data-path': `/user/${screen_name}/wordle`,
                                                    'data-router-path': '/user/:screen_name/wordle'
                                                },
                                                onClick: handleChangePath,
                                                active: router_path === '/user/:screen_name/wordle' || router_path === '/user/:screen_name'
                                            },
                                            {
                                                text: 'GAME RESULTS',
                                                value: 'game_results',
                                                link: `/user/${screen_name}/wordle/game`,
                                                attributes: {
                                                    'data-path': `/user/${screen_name}/wordle/game`,
                                                    'data-router-path': '/user/:screen_name/wordle/game'
                                                },
                                                onClick: handleChangePath,
                                                active: router_path === '/user/:screen_name/wordle/game'
                                            },
                                            {
                                                text: 'LIKES',
                                                value: 'likes',
                                                link: `/user/${screen_name}/wordle/like`,
                                                attributes: {
                                                    'data-path': `/user/${screen_name}/wordle/like`,
                                                    'data-router-path': '/user/:screen_name/wordle/like'
                                                },
                                                onClick: handleChangePath,
                                                active: router_path === '/user/:screen_name/wordle/like'
                                            }
                                        ]}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        router_path === '/user/:screen_name/wordle' || router_path === '/user/:screen_name' ?
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
                                        router_path === '/user/:screen_name/wordle/game' ?
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
                                        router_path === '/user/:screen_name/wordle/like' ?
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