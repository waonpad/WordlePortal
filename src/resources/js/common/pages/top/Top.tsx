import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import { Backdrop, CircularProgress, Grid, Button, ButtonGroup, Container } from '@mui/material';
import WordleList from '../../../wordle/components/WordleList';
import GameList from '../../../wordle/components/GameList';
import { globalTheme } from '../../../Theme';
import { RequestConfig } from './types/TopType';

function Top(): React.ReactElement {
    const location = useLocation();
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
                    <Grid item container xs={12}>
                        <Grid item xs={6}>
                            <Link to={'/wordle/index'}>
                                <Button
                                    fullWidth
                                    variant='outlined'
                                    style={{borderRadius: '4px 0px 0px 4px'}}
                                    sx={display_list_component === 'wordles' ? {fontWeight: 'bold', color: '#fff', backgroundColor: globalTheme.palette.primary.main, ":hover": {backgroundColor: globalTheme.palette.primary.main}} : {fontWeight: 'bold', backgroundColor: '#fff'}}
                                >
                                    WORDLES
                                </Button>
                            </Link>
                        </Grid>
                        <Grid item xs={6}>
                            <Link to={'/wordle/game/index'}>
                                <Button
                                    fullWidth
                                    variant='outlined'
                                    style={{borderRadius: '0px 4px 4px 0px'}}
                                    sx={display_list_component === 'games' ? {fontWeight: 'bold', color: '#fff', backgroundColor: globalTheme.palette.primary.main, ":hover": {backgroundColor: globalTheme.palette.primary.main}} : {fontWeight: 'bold', backgroundColor: '#fff'}}   
                                >
                                    GAMES
                                </Button>
                            </Link>
                        </Grid>
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
                                    game_status={['wait', 'start']}
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