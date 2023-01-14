import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import { Backdrop, CircularProgress, Grid, Button, ButtonGroup, Container } from '@mui/material';
import WordleList from '../../../wordle/components/wordlelist/components/WordleList';
import GameList from '../../../wordle/components/gamelist/components/GameList';
import { globalTheme } from '../../../Theme';
import { RequestConfig } from './types/TopType';
import { useAuth } from '../../../contexts/AuthContext';
import ButtonGroupPrimary from '../../button/buttongroupprimary/components/ButtonGroupPrimary';

function Top(): React.ReactElement {
    const location = useLocation();
    const auth = useAuth();
    const {wordle_tag_id, game_tag_id} = useParams<{wordle_tag_id: string, game_tag_id: string}>();
    const [initial_load, setInitialLoad] = useState(true);
    const [display_list_component, setDisplayListComponent] = useState<'wordles' | 'games'>('wordles');
    const [key, setKey] = useState(''); //再読み込みのためにkeyが必要

    const [request_config, setRequestConfig] = useState<RequestConfig>({
        api_url: 'wordle/index',
        params: {},
        response_keys: ['wordles'],
        listening_channel: 'wordle',
        listening_event: 'WordleEvent'
    });

    useEffect(() => {
        setInitialLoad(true);
        if(location.pathname === '/' || location.pathname === '/wordle/index') {
            setRequestConfig({
                api_url: 'wordle/index',
                params: {},
                response_keys: ['wordles'],
                listening_channel: 'wordle',
                listening_event: 'WordleEvent',
            });
            setDisplayListComponent('wordles');
            setKey(`wordle_index`);
        }
        if(location.pathname === '/wordle/follows') {
            setRequestConfig({
                api_url: 'wordle/follows',
                params: {},
                response_keys: ['wordles'],
                // listening_channel: `wordle_follows.${auth?.user?.id}`,
                // listening_event: 'WordleFollowsEvent',
            });
            // チャンネルとイベントは作成していない
            setDisplayListComponent('wordles');
            setKey(`wordle_follows`);
        }
        if(location.pathname === `/wordle/tag/${wordle_tag_id}`) {
            setRequestConfig({
                api_url: 'wordle/tag',
                params: {wordle_tag_id: wordle_tag_id},
                response_keys: ['wordles'],
                listening_channel: `wordle_tag.${wordle_tag_id}`,
                listening_event: 'WordleTagEvent',
            })
            setDisplayListComponent('wordles');
            setKey(`wordle_tag.${wordle_tag_id}`);
        }
        if(location.pathname === '/wordle/game/index') {
            setRequestConfig({
                api_url: 'wordle/game/index',
                params: {},
                response_keys: ['games'],
                listening_channel: 'game',
                listening_event: 'GameEvent',
            })
            setDisplayListComponent('games');
            setKey(`wordle_game_index`);
        }
        if(location.pathname === '/wordle/game/follows') {
            setRequestConfig({
                api_url: 'wordle/game/follows',
                params: {},
                response_keys: ['games'],
                // listening_channel: `game_follows.${auth?.user?.id}`,
                // listening_event: 'GameFollowsEvent',
            })
            // チャンネルとイベントは作成していない
            setDisplayListComponent('games');
            setKey(`wordle_game_index`);
        }
        if(location.pathname === `/wordle/game/tag/${game_tag_id}`) {
            setRequestConfig({
                api_url: 'wordle/game/tag',
                params: {game_tag_id: game_tag_id},
                response_keys: ['games'],
                listening_channel: `game_tag.${game_tag_id}`,
                listening_event: 'GameTagEvent',
            })
            setDisplayListComponent('games');
            setKey(`wordle_game_tag.${game_tag_id}`);
        }
        setInitialLoad(false);
    }, [location]);

    if(initial_load) {
        return (
			<Backdrop open={true}>
                <CircularProgress/>
            </Backdrop>
        )
    }
    else {
        return (
            <Container maxWidth={'md'}>
                <Grid container spacing={2}>
                    {/* 表示するWordleの種類選択エリア */}
                    <Grid item xs={12}>
                        <ButtonGroupPrimary
                            items={[
                                {
                                    text: 'WORDLES',
                                    link: location.pathname.substring(0, 12) === '/wordle/game' ? `/wordle${location.pathname.substring(12)}` : location.pathname,
                                    active: display_list_component === 'wordles'
                                },
                                {
                                    text: 'GAMES',
                                    link: location.pathname === '/' ? '/wordle/game/index' : location.pathname.substring(0, 12) !== '/wordle/game' ? `/wordle/game${location.pathname.substring(7)}` : location.pathname,
                                    active: display_list_component === 'games'
                                },
                            ]}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {
                            display_list_component === 'wordles' ? (
                                <WordleList
                                    request_config={request_config}
                                    // listen={true}
                                    listen={false} // ページネーションとの兼ね合いと、使いやすさ的に同期的なリストにする (いい方法があれば今後変えるかも)
                                    key={key}
                                />
                            )
                            :
                            display_list_component === 'games' ? (
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
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

export default Top;