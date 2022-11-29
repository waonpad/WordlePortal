import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import WordleList from '../../wordle/components/WordleList';

const theme = createTheme();

function Top(): React.ReactElement {
    const [initial_loading, setInitialLoading] = useState(true);

    const [wordle_get_api_method, setWordleGetApiMethod] = useState('wordle/index');
    const [request_params, setRequestParams] = useState<any>({});
    const [listening_channel, setListeningChannel] = useState('wordle');
    const [listening_event, setListeningEvent] = useState('WordlePosted');

    const location = useLocation();
    const {wordle_tag_id} = useParams<{wordle_tag_id: string}>();

    const [key, setKey] = useState(''); //再読み込みのためにkeyが必要

    useEffect(() => {
        console.log(wordle_tag_id);
        setInitialLoading(true);
        if(wordle_tag_id !== undefined) {
            setWordleGetApiMethod('wordle/tag');
            setRequestParams({tag_id: wordle_tag_id});
            setListeningChannel(`wordle_tag_post.${wordle_tag_id}`);
            setListeningEvent('WordleTagPosted');
            setKey(`wordle_tag.${wordle_tag_id}`);
        }
        setInitialLoading(false);
    }, [location]);

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth={'md'} sx={{padding: 0}}>
                <CssBaseline />
                    {!initial_loading ? (
                        <WordleList
                            wordle_get_api_method={wordle_get_api_method}
                            request_params={request_params}
                            listening_channel={listening_channel}
                            listening_event={listening_event}
                            key={key}
                        />
                    ) : (
                        <CircularProgress sx={{textAlign: 'center'}} />
                    )}
            </Container>
        </ThemeProvider>
    );
}

export default Top;