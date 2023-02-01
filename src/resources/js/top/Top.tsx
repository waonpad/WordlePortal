import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import { Grid, Container } from '@mui/material';
import WordleList from '@/wordle/components/wordlelist/components/WordleList';
import GameList from '@/wordle/components/gamelist/components/GameList';
import { RequestConfig } from '@/top/types/TopType';
import { useAuth } from '@/contexts/AuthContext';
import ButtonGroupPrimary from '@/common/button/buttongroupprimary/components/ButtonGroupPrimary';
import SuspensePrimary from '@/common/suspense/suspenseprimary/components/SuspensePrimary';

function Top(): React.ReactElement {
    const location = useLocation();
    const auth = useAuth();
    const {wordle_tag_id, game_tag_id, wordle_search_param, wordle_game_search_param} = useParams<{wordle_tag_id: string, game_tag_id: string, wordle_search_param: string, wordle_game_search_param: string}>();
    const [initial_load, setInitialLoad] = useState(true);
    const [display_list_component, setDisplayListComponent] = useState<'wordles' | 'games'>('wordles');
    const [key, setKey] = useState('');

    const [request_config, setRequestConfig] = useState<RequestConfig>({
        api_url: 'wordle/index',
        params: {},
        response_keys: ['wordles'],
        listening_channel: 'wordle',
        listening_event: 'WordleEvent'
    });

    useEffect(() => {
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
                listening_channel: `wordle_follows.${auth!.user!.id}`,
                listening_event: 'WordleFollowsEvent',
            });
            setDisplayListComponent('wordles');
            setKey(`wordle_follows.${auth!.user!.id}`);
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
        if(location.pathname === `/wordle/search/${wordle_search_param}`) {
            setRequestConfig({
                api_url: 'wordle/search',
                params: {wordle_search_param: wordle_search_param},
                response_keys: ['wordles'],
                // listening_channel: `wordle_search.${wordle_search_param}`,
                // listening_event: 'WordleSearchEvent'
            })
            setDisplayListComponent('wordles');
            setKey(`wordle_search.${wordle_search_param}`);
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
                listening_channel: `game_follows.${auth!.user!.id}`,
                listening_event: 'GameFollowsEvent',
            })
            setDisplayListComponent('games');
            setKey(`game_follows.${auth!.user!.id}`);
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
        if(location.pathname === `/wordle/game/search/${wordle_game_search_param}`) {
            setRequestConfig({
                api_url: 'wordle/game/search',
                params: {wordle_game_search_param: wordle_game_search_param},
                response_keys: ['games'],
                // listening_channel: `wordle_game_search.${wordle_game_search_param}`,
                // listening_event: 'WordleSearchEvent'
            })
            setDisplayListComponent('games');
            setKey(`wordle_game_search.${wordle_game_search_param}`);
        }
        setInitialLoad(false);
    }, [location]);

    if(initial_load) {
        return (<SuspensePrimary open={true} backdrop={true} />)
    }
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
                                listen={location.pathname === `/wordle/search/${wordle_search_param}` ? false : true}
                                key={key}
                            />
                        )
                        :
                        display_list_component === 'games' ? (
                            <GameList
                                game_status={['wait']}
                                request_config={request_config}
                                listen={location.pathname === `/wordle/game/search/${wordle_game_search_param}` ? false : true}
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

export default Top;