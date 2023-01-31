import React, { useEffect, useState, useRef } from 'react';
import swal from "sweetalert";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import { Button, Container, Grid, Paper, Typography } from '@mui/material';
import UserPrimaryDetail from '@/user/components/UserPrimaryDetail';
import WordleList from '@/wordle/components/wordlelist/components/WordleList';
import GameList from '@/wordle/components/gamelist/components/GameList';
import SuspensePrimary from '@/common/suspense/suspenseprimary/components/SuspensePrimary';
import ButtonGroupPrimary from '@/common/button/buttongroupprimary/components/ButtonGroupPrimary';
import UserList from '@/user/components/UserList';
import { useWindowDimensions } from '@/common/hooks/WindowDimensions';

function User(props: any): React.ReactElement {
    const location = useLocation();
    const {width} = useWindowDimensions();
    const {screen_name} = useParams<{screen_name: string}>();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(undefined);
    const [key, setKey] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [display_ff_component, setDisplayFFComponent] = useState<'follows' | 'followers'>('follows');
    const [display_list_component, setDisplayListComponent] = useState<'wordles' | 'game_results' | 'likes'>('wordles');

    const [route_store, setRouteStore] = useState({
        path: '',
        params: {}
    });
    
    function objectSort(obj: object){
        // ソートする
        const sorted = Object.entries(obj).sort();
        
        // valueを調べ、objectならsorted entriesに変換する
        for(let i in sorted){
            const val = sorted[i][1];
            if(typeof val === "object"){
                sorted[i][1] = objectSort(val);
            }
        }

        return sorted;
    }

    // データ取得 /////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        if((JSON.stringify(objectSort(props.match.params)) !== JSON.stringify(objectSort(route_store.params)))) {
            setLoading(true);
            setRouteStore({
                path: props.match.path,
                params: props.match.params
            });
            setExpanded(false);
            axios.get('/api/user/show', {params: {screen_name: screen_name}}).then(res => {
                if(res.data.status === true) {
                    setUser(res.data.user);
                    setKey(screen_name);
                    setLoading(false);
                }
                else if (res.data.status === false) {
                    swal("Error", res.data.message, "error");
                }
            })
        }
        setDisplayFFComponent(
            ['/user/:screen_name', '/user/:screen_name/follows'].includes(props.match.path) ? 'follows'
            : ['/user/:screen_name/followers'].includes(props.match.path) ? 'followers'
            : display_ff_component);
        setDisplayListComponent(
            ['/user/:screen_name', '/user/:screen_name/wordle'].includes(props.match.path) ? 'wordles'
            : ['/user/:screen_name/wordle/game'].includes(props.match.path) ? 'game_results'
            : ['/user/:screen_name/wordle/like'].includes(props.match.path) ? 'likes'
            : display_list_component
        );
    }, [location])
    /////////////////////////////////////////////////////////////////////////

    if(loading) {
        return (<SuspensePrimary open={true} backdrop={true} />)
    }
    return (
        <Container maxWidth={'lg'} key={key}>
            <Button>test</Button>
            <Grid container spacing={2}>
                {/* 左のエリア */}
                <Grid item container xs={12} smd={4} spacing={2} height={'fit-content'}>
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
                    {/* <Grid item xs={12}>
                        <Paper elevation={1} sx={{minWidth: '100%'}}>
                            <Typography>Paper</Typography>
                        </Paper>
                    </Grid> */}
                </Grid>
                {/* 右のエリア */}
                <Grid item container xs={12} smd={8} spacing={2} height={'fit-content'}>
                    {/* 成績 */}
                    {/* <Grid item xs={12}>
                        <Paper elevation={1} sx={{minWidth: '100%'}}>
                            <Typography>Paper</Typography>
                        </Paper>
                    </Grid> */}
                    {/* 待機中のゲーム */}
                    <Grid item xs={12}>
                        {/* メンバーがいなくなって閉じたゲームも表示されてしまう */}
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
                            game_status={['wait', 'start']}
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
                        ['/user/:screen_name/follows', '/user/:screen_name/followers'].includes(props.match.path) ?
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
                                                active: display_ff_component === 'follows'
                                            },
                                            {
                                                text: 'Followers',
                                                value: 'followers',
                                                link: `/user/${screen_name}/followers`,
                                                active: display_ff_component === 'followers'
                                            },
                                        ]}
                                    />
                                }
                                request_config={{
                                    api_url: `user/${display_ff_component}`,
                                    params: {screen_name: screen_name},
                                    response_keys: ['users'],
                                }}
                                listen={false}
                                no_item_text={display_ff_component === 'follows' ? 'No Follows' : 'No Followers'}
                                key={key + display_ff_component}
                            />
                        </Grid>
                        :
                        ['/user/:screen_name', '/user/:screen_name/wordle', '/user/:screen_name/wordle/game', '/user/:screen_name/wordle/like'].includes(props.match.path) ?
                        <React.Fragment>
                            {/* 表示するWordleの種類選択エリア */}
                            <Grid item xs={12}>
                                <ButtonGroupPrimary
                                    items={[
                                        {
                                            text: 'Wordles',
                                            value: 'wordles',
                                            link: `/user/${screen_name}/wordle`,
                                            active: display_list_component === 'wordles'
                                        },
                                        {
                                            text: width >= 450 ? 'GAME RESULTS' : 'RESULTS',
                                            value: 'game_results',
                                            link: `/user/${screen_name}/wordle/game`,
                                            active: display_list_component === 'game_results'
                                        },
                                        {
                                            text: 'LIKES',
                                            value: 'likes',
                                            link: `/user/${screen_name}/wordle/like`,
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
                        </React.Fragment>
                        :
                        <></>
                    }
                </Grid>
            </Grid>
        </Container>
    );
}

export default User;