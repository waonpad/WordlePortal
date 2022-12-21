import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import PostForm from './components/PostForm';
import PostList from './components/PostList';

function Chat(): React.ReactElement {
    const [initial_loading, setInitialLoading] = useState(true);

    const [post_get_api_method, setPostGetApiMethod] = useState('post/index');
    const [request_params, setRequestParams] = useState<any>({});
    const [listening_channel, setListeningChannel] = useState('post');
    const [listening_event, setListeningEvent] = useState('Posted');

    const location = useLocation();
    const {category_id} = useParams<{category_id: string}>();

    const [key, setKey] = useState(''); //再読み込みのためにkeyが必要

    useEffect(() => {
        console.log(category_id);
        setInitialLoading(true);
        if(category_id !== undefined) {
            setPostGetApiMethod('post/category');
            setRequestParams({category_id: category_id});
            setListeningChannel(`category_post.${category_id}`);
            setListeningEvent('CategoryPosted');
            setKey(`category.${category_id}`);
        }
        setInitialLoading(false);
    }, [location]);

    return (
        <Container maxWidth={'md'}>
            <PostForm />
            {!initial_loading ? (
                <PostList
                post_get_api_method={post_get_api_method}
                request_params={request_params}
                listening_channel={listening_channel}
                listening_event={listening_event}
                key={key}
                />
            ) : (
                <CircularProgress sx={{textAlign: 'center'}} />
            )}
        </Container>
    );
}

export default Chat;