import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import { Backdrop, CircularProgress, Grid, Button, ButtonGroup, Container } from '@mui/material';
import WordleList from '../../../wordle/components/wordlelist/components/WordleList';
import GameList from '../../../wordle/components/gamelist/components/GameList';
import { globalTheme } from '../../../Theme';
import { RequestConfig } from './types/TopType';
import { useAuth } from '../../../contexts/AuthContext';
import ButtonGroupPrimary from '../../button/buttongroupprimary/components/ButtonGroupPrimary';
import { useCustomPath } from '../../../contexts/CustomPathContext';
import SuspensePrimary from '../../suspense/suspenseprimary/components/SuspensePrimary';

function Top(props: any): React.ReactElement {
    const location = useLocation();
    const custom_path = useCustomPath();
    const auth = useAuth();
    // const {wordle_tag_id, game_tag_id, wordle_search_param, wordle_game_search_param} = useParams<{wordle_tag_id: string, game_tag_id: string, wordle_search_param: string, wordle_game_search_param: string}>();
    const [initial_load, setInitialLoad] = useState(true);
    const [key, setKey] = useState(''); //再読み込みのためにkeyが必要

    const partical_render_route_paths = [
        '/',
        '/wordle/index',
        '/wordle/follows',
        `/wordle/tag/:wordle_tag_id`,
        `/wordle/search/:wordle_search_param`,
        `/wordle/game/index`,
        `/wordle/game/follows`,
        `/wordle/game/tag/:game_tag_id`,
        `/wordle/game/search/:wordle_game_search_param`
    ];

    const [request_config, setRequestConfig] = useState<RequestConfig>({
        api_url: 'wordle/index',
        params: {},
        response_keys: ['wordles'],
        listening_channel: 'wordle',
        listening_event: 'WordleEvent'
    });

    useEffect(() => {
        setInitialLoad(true);
        const data = {
            path: props.location.pathname,
            route_path: props.match.path,
            params: props.match.params
        }
        console.log(props);
        custom_path?.changePath(data)
    }, []);

    useEffect(() => {
        setInitialLoad(true);
        if(custom_path?.path.route_path !== '') {
            console.log('do');
            console.log(custom_path);

            if(custom_path?.path.route_path === '/' || custom_path?.path.route_path === '/wordle/index') {
                setRequestConfig({
                    api_url: 'wordle/index',
                    params: {},
                    response_keys: ['wordles'],
                    listening_channel: 'wordle',
                    listening_event: 'WordleEvent',
                });
                setKey(`wordle_index`);
            }
            if(custom_path?.path.path === '/wordle/follows') {
                setRequestConfig({
                    api_url: 'wordle/follows',
                    params: {},
                    response_keys: ['wordles'],
                });
                // チャンネルとイベントは作成していない
                setKey(`wordle_follows`);
            }
            if(custom_path?.path.route_path === `/wordle/tag/:wordle_tag_id`) {
                setRequestConfig({
                    api_url: 'wordle/tag',
                    params: {wordle_tag_id: custom_path?.path.params.wordle_tag_id},
                    response_keys: ['wordles'],
                    listening_channel: `wordle_tag.${custom_path?.path.params.wordle_tag_id}`,
                    listening_event: 'WordleTagEvent',
                })
                setKey(`wordle_tag.${custom_path?.path.params.wordle_tag_id}`);
            }
            if(custom_path?.path.route_path === `/wordle/search/:wordle_search_param`) {
                setRequestConfig({
                    api_url: 'wordle/search',
                    params: {wordle_search_param: custom_path?.path.params.wordle_search_param},
                    response_keys: ['wordles'],
                })
                // チャンネルとイベントは作成していない
                setKey(`wordle_search.${custom_path?.path.params.wordle_search_param}`);
            }
            if(custom_path?.path.route_path === '/wordle/game/index') {
                setRequestConfig({
                    api_url: 'wordle/game/index',
                    params: {},
                    response_keys: ['games'],
                    listening_channel: 'game',
                    listening_event: 'GameEvent',
                })
                setKey(`wordle_game_index`);
            }
            if(custom_path?.path.route_path === '/wordle/game/follows') {
                setRequestConfig({
                    api_url: 'wordle/game/follows',
                    params: {},
                    response_keys: ['games'],
                })
                // チャンネルとイベントは作成していない
                setKey(`wordle_game_index`);
            }
            if(custom_path?.path.route_path === `/wordle/game/tag/:game_tag_id`) {
                setRequestConfig({
                    api_url: 'wordle/game/tag',
                    params: {game_tag_id: custom_path?.path.params.game_tag_id},
                    response_keys: ['games'],
                    listening_channel: `game_tag.${custom_path?.path.params.game_tag_id}`,
                    listening_event: 'GameTagEvent',
                })
                setKey(`wordle_game_tag.${custom_path?.path.params.game_tag_id}`);
            }
            if(custom_path?.path.route_path === `/wordle/game/search/:wordle_game_search_param`) {
                setRequestConfig({
                    api_url: 'wordle/game/search',
                    params: {wordle_game_search_param: custom_path?.path.params.wordle_game_search_param},
                    response_keys: ['games'],
                })
                // チャンネルとイベントは作成していない
                setKey(`wordle_game_search.${custom_path?.path.params.wordle_game_search_param}`);
            }

            setInitialLoad(false);
        }
    }, [custom_path?.path.route_path]);

    return (
        <SuspensePrimary open={initial_load} backdrop={true}>
            <Container maxWidth={'md'}>
                <Grid container spacing={2}>
                    {/* 表示するWordleの種類選択エリア */}
                    <Grid item xs={12}>
                        <ButtonGroupPrimary
                            items={[
                                {
                                    text: 'WORDLES',
                                    link: {
                                        path: {
                                            path: custom_path?.path.path.substring(0, 12) === '/wordle/game' ? `/wordle${custom_path?.path.path.substring(12)}` : custom_path?.path.path as string,
                                            route_path: custom_path?.path.route_path.substring(0, 12) === '/wordle/game' ? `/wordle${custom_path?.path.route_path.substring(12)}` : custom_path?.path.route_path as string,
                                            params: {wordle_tag_id: custom_path?.path.params.game_tag_id, wordle_search_param: custom_path?.path.params.wordle_game_search_param}
                                        },
                                        partical_render_route_paths: partical_render_route_paths
                                    },
                                    active: ((custom_path?.path.route_path.substring(0, 12) !== '/wordle/game') && (custom_path?.path.path.substring(0, 7) === '/wordle')) || custom_path?.path.path === '/'
                                },
                                {
                                    text: 'GAMES',
                                    link: {
                                        path: {
                                            path: custom_path?.path.path === '/' ? '/wordle/game/index' : custom_path?.path.path.substring(0, 12) !== '/wordle/game' ? `/wordle/game${custom_path?.path.path.substring(7)}` : custom_path?.path.path,
                                            route_path: custom_path?.path.route_path === '/' ? '/wordle/game/index' : custom_path?.path.route_path.substring(0, 12) !== '/wordle/game' ? `/wordle/game${custom_path?.path.route_path.substring(7)}` : custom_path?.path.route_path,
                                            params: {game_tag_id: custom_path?.path.params.wordle_tag_id, wordle_game_search_param: custom_path?.path.params.wordle_search_param}
                                        },
                                        partical_render_route_paths: partical_render_route_paths
                                    },
                                    active: custom_path?.path.route_path.substring(0, 12) === '/wordle/game'
                                },
                            ]}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <SuspensePrimary open={initial_load} backdrop={false}>
                            {
                                ((request_config.api_url.substring(0, 11) !== 'wordle/game') && (request_config.api_url.substring(0, 6) === 'wordle')) ? (
                                    <WordleList
                                        request_config={request_config}
                                        // listen={true}
                                        listen={false} // ページネーションとの兼ね合いと、使いやすさ的に同期的なリストにする (いい方法があれば今後変えるかも)
                                        key={key}
                                    />
                                )
                                :
                                request_config.api_url.substring(0, 11) === 'wordle/game' ? (
                                    <GameList
                                        game_status={['wait']}
                                        request_config={request_config}
                                        // listen={true}
                                        listen={false} // ページネーションとの兼ね合いと、使いやすさ的に同期的なリストにする (いい方法があれば今後変えるかも)
                                        key={key}
                                    />
                                )
                                :
                                <></>
                            }
                        </SuspensePrimary>
                    </Grid>
                </Grid>
            </Container>
        </SuspensePrimary>
    )
}

export default Top;