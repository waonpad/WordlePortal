import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom";
import { Backdrop, CircularProgress } from '@mui/material';
import WordleList from '../../wordle/components/WordleList';

function Top(): React.ReactElement {
    const [initial_load, setInitialLoad] = useState(true);

    const [wordle_get_api_method, setWordleGetApiMethod] = useState('wordle/index');
    const [request_params, setRequestParams] = useState<any>({});
    const [listening_channel, setListeningChannel] = useState('wordle');
    const [listening_event, setListeningEvent] = useState('WordleEvent');

    const location = useLocation();
    const {wordle_tag_id} = useParams<{wordle_tag_id: string}>();

    const [key, setKey] = useState(''); //再読み込みのためにkeyが必要

    useEffect(() => {
        console.log(wordle_tag_id);
        setInitialLoad(true);
        if(wordle_tag_id !== undefined) {
            setWordleGetApiMethod('wordle/tag');
            setRequestParams({tag_id: wordle_tag_id});
            setListeningChannel(`wordle_tag.${wordle_tag_id}`);
            setListeningEvent('WordleTagEvent');
            setKey(`wordle_tag.${wordle_tag_id}`);
        }
        setInitialLoad(false);
    }, [location]);

    if(initial_load) {
        return (
			<Backdrop open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        )
    }
    else {
        return (
            <WordleList
                wordle_get_api_method={wordle_get_api_method}
                request_params={request_params}
                response_keys={['wordles']}
                listen={true}
                listening_channel={listening_channel}
                listening_event={listening_event}
                key={key}
            />
        )
    }
}

export default Top;