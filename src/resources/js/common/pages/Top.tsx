import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { Backdrop, CircularProgress } from '@mui/material';
import WordleList from '../../wordle/components/WordleList';
import GameList from '../../wordle/components/GameList';

function Top(): React.ReactElement {

    const location = useLocation();
    const {wordle_tag_id, game_tag_id} = useParams<{wordle_tag_id: string, game_tag_id: string}>();

    const [initial_load, setInitialLoad] = useState(true);

    const [wordle_get_api_method, setWordleGetApiMethod] = useState<string>('wordle/index');
    const [request_params, setRequestParams] = useState<object>({});
    const [response_keys, setResponseKeys] = useState<string[]>(['wordles']);
    const [listening_channel, setListeningChannel] = useState<string>(`wordle`);
    const [listening_event, setListeningEvent] = useState<string>('WordleEvent');
    const [display_list_component, setDisplayListComponent] = useState<'wordle' | 'game'>('wordle');
    const [key, setKey] = useState(''); //再読み込みのためにkeyが必要

    useEffect(() => {
        console.log(location);
        console.log(wordle_tag_id);
        setInitialLoad(true);
        if(location.pathname === '/' || '/wordle/index') {
            setWordleGetApiMethod('wordle/index');
            setRequestParams({});
            setResponseKeys(['wordles']);
            setListeningChannel(`wordle`);
            setListeningEvent('WordleEvent');
            setDisplayListComponent('wordle');
            setKey(`wordle_index`);
        }
        if(location.pathname === `/wordle/tag/${wordle_tag_id}`) {
            setWordleGetApiMethod('wordle/tag');
            setRequestParams({wordle_tag_id: wordle_tag_id});
            setResponseKeys(['wordles']);
            setListeningChannel(`wordle_tag.${wordle_tag_id}`);
            setListeningEvent('WordleTagEvent');
            setDisplayListComponent('wordle');
            setKey(`wordle_tag.${wordle_tag_id}`);
        }
        if(location.pathname === '/wordle/game/index') {
            setWordleGetApiMethod('wordle/game/index');
            setRequestParams({});
            setResponseKeys(['games']);
            setListeningChannel(`game`);
            setListeningEvent('GameEvent');
            setDisplayListComponent('game');
            setKey(`wordle_game_index`);
        }
        if(location.pathname === `/wordle/game/tag/${game_tag_id}`) {
            setWordleGetApiMethod('wordle/game/tag');
            setRequestParams({game_tag_id: game_tag_id});
            setResponseKeys(['games']);
            setListeningChannel(`game_tag.${game_tag_id}`);
            setListeningEvent('GameTagEvent');
            setDisplayListComponent('game');
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
            <React.Fragment>
                {
                    display_list_component === 'wordle' ? (
                        <WordleList
                            wordle_get_api_method={wordle_get_api_method}
                            request_params={request_params}
                            response_keys={response_keys}
                            listen={true}
                            listening_channel={listening_channel}
                            listening_event={listening_event}
                            key={key}
                        />
                    )
                    :
                    display_list_component === 'game' ? (
                        <GameList
                            game_status={['wait', 'start']}
                            game_get_api_method={wordle_get_api_method}
                            request_params={request_params}
                            response_keys={response_keys}
                            listen={true}
                            listening_channel={listening_channel}
                            listening_event={listening_event}
                            key={key}
                        />
                    )
                    :
                    <></>
                }
            </React.Fragment>
        )
    }
}

export default Top;