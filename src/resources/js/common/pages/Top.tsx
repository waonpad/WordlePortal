import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import { Backdrop, CircularProgress, Grid, Button, ButtonGroup, Container } from '@mui/material';
import WordleList from '../../wordle/components/WordleList';
import GameList from '../../wordle/components/GameList';
import { globalTheme } from '../../Theme';

function Top(): React.ReactElement {
    const location = useLocation();
    const {wordle_tag_id, game_tag_id} = useParams<{wordle_tag_id: string, game_tag_id: string}>();
    const [initial_load, setInitialLoad] = useState(true);
    const [wordle_get_api_method, setWordleGetApiMethod] = useState<string>('wordle/index');
    const [request_params, setRequestParams] = useState<object>({});
    const [response_keys, setResponseKeys] = useState<string[]>(['wordles']);
    const [listening_channel, setListeningChannel] = useState<string>(`wordle`);
    const [listening_event, setListeningEvent] = useState<string>('WordleEvent');
    const [display_list_component, setDisplayListComponent] = useState<'wordles' | 'games'>('wordles');
    const [key, setKey] = useState(''); //再読み込みのためにkeyが必要

    useEffect(() => {
        setInitialLoad(true);
        if(location.pathname === '/' || location.pathname === '/wordle/index') {
            setWordleGetApiMethod('wordle/index');
            setRequestParams({});
            setResponseKeys(['wordles']);
            setListeningChannel(`wordle`);
            setListeningEvent('WordleEvent');
            setDisplayListComponent('wordles');
            setKey(`wordle_index`);
        }
        if(location.pathname === `/wordle/tag/${wordle_tag_id}`) {
            setWordleGetApiMethod('wordle/tag');
            setRequestParams({wordle_tag_id: wordle_tag_id});
            setResponseKeys(['wordles']);
            setListeningChannel(`wordle_tag.${wordle_tag_id}`);
            setListeningEvent('WordleTagEvent');
            setDisplayListComponent('wordles');
            setKey(`wordle_tag.${wordle_tag_id}`);
        }
        if(location.pathname === '/wordle/game/index') {
            setWordleGetApiMethod('wordle/game/index');
            setRequestParams({});
            setResponseKeys(['games']);
            setListeningChannel(`game`);
            setListeningEvent('GameEvent');
            setDisplayListComponent('games');
            setKey(`wordle_game_index`);
        }
        if(location.pathname === `/wordle/game/tag/${game_tag_id}`) {
            setWordleGetApiMethod('wordle/game/tag');
            setRequestParams({game_tag_id: game_tag_id});
            setResponseKeys(['games']);
            setListeningChannel(`game_tag.${game_tag_id}`);
            setListeningEvent('GameTagEvent');
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
                                    wordle_get_api_method={wordle_get_api_method}
                                    request_params={request_params}
                                    response_keys={response_keys}
                                    // listen={true}
                                    listen={false} // ページネーションとの兼ね合いと、使いやすさ的に同期的なリストにする (いい方法があれば今後変えるかも)
                                    listening_channel={listening_channel}
                                    listening_event={listening_event}
                                    key={key}
                                />
                            )
                            :
                            display_list_component === 'games' ? (
                                <GameList
                                    game_status={['wait', 'start']}
                                    game_get_api_method={wordle_get_api_method}
                                    request_params={request_params}
                                    response_keys={response_keys}
                                    // listen={true}
                                    listen={false} // ページネーションとの兼ね合いと、使いやすさ的に同期的なリストにする (いい方法があれば今後変えるかも)
                                    listening_channel={listening_channel}
                                    listening_event={listening_event}
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