import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Grid, Typography, Avatar, Card, CardContent, Button, Collapse, IconButton, List, ListItem, Divider } from '@mui/material';
import PaginationPrimary from '@/common/pagination/paginationprimary/components/PaginationPrimary';
import SuspensePrimary from '@/common/suspense/suspenseprimary/components/SuspensePrimary';
import SimpleTextListItem from '@/common/listitem/simpletextlistitem/components/SimpleTextListItem';
import WordleCommentListItem from '@/wordle/components/wordlecommentlist/components/WordleCommentListItem';
import { WordleCommentListProps } from '@/wordle/components/wordlecommentlist/types/WordleCommentListType';
import NewPostSnackbar from '@/common/snackbar/newpostsnackbar/components/NewPostSnackbar';
import { useElementClientRect } from '@/common/hooks/ElementClientRect';

declare var window: {
    Echo: any;
}

function WordleCommentList(props: WordleCommentListProps): React.ReactElement {
    const {head, request_config, listen, no_item_text} = props;

    const [wordle_comments, setWordleComments] = useState<any[]>([]);
    const [wordle_comments_loading, setWordleCommentsLoading] = useState<boolean>(true);
    const [snackbar_open, setSnackbarOpen] = useState<boolean>(false);
    const {ref, client_rect, setDOMLoading} = useElementClientRect();

    useEffect(() => {
        setDOMLoading(wordle_comments_loading);
    }, [wordle_comments_loading])

    // API /////////////////////////////////////////////////////////////////////////
    const getWordleComments = (paginate: 'prev' | 'next', latest?: boolean) => {
        axios.get(`/api/${request_config.api_url}`, {params: {...request_config.params, per_page: 10, paginate: paginate, start: wordle_comments.length === 0 || latest ? null : wordle_comments[0].id, last: wordle_comments.length > 0 ? wordle_comments.slice(-1)[0].id : null}}).then(res => {
            if(res.data.status === true) {
                var res_data = res.data;
                request_config.response_keys.forEach(key => {
                    res_data = res_data[key];
                });

                setWordleComments(res_data.reverse());
                setWordleCommentsLoading(false);
            }
            else if (res.data.status === false) {
                // 失敗時の処理
            }
        })
    }

    useEffect(() => {
        getWordleComments('prev');

        if(listen) {
            window.Echo.channel(request_config.listening_channel).listen(request_config.listening_event, (channel_event: any) => {
                console.log(channel_event);
                if(channel_event.event_type === 'create') {
                    setSnackbarOpen(true); // 新規投稿があったらsnackbarで通知する
                }
                if(channel_event.event_type === 'update') {
                    setWordleComments((wordle_comments) => wordle_comments.map((wordle_comment) => (
                        wordle_comment.id === channel_event.wordle_comment.id ? channel_event.wordle_comment : wordle_comment
                    ))); // 投稿の更新があったらリアルタイムに更新する
                }
                if(channel_event.event_type === 'destroy') {
                    // 削除された時の処理
                }
            });
        }
    }, []);

    // new /////////////////////////////////////////////////////////////////////////
    const getWordleCommentsLeatest = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        getWordleComments('prev', true);
        setSnackbarOpen(false);
    }

    const handleSnackbarCloce = (event: React.SyntheticEvent | Event) => {
        setSnackbarOpen(false);
    }
    /////////////////////////////////////////////////////////////////////////

    // Page Change ///////////////////////////////////////////////////////////////////////
    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        getWordleComments(event.currentTarget.value as 'prev' | 'next');
    }
    /////////////////////////////////////////////////////////////////////////

    return (
        <Card elevation={1}>
            {head}
            <List sx={{minWidth: '100%', bgcolor: 'background.paper', position: 'relative'}} ref={ref}>
                <NewPostSnackbar
                    open={snackbar_open}
                    handleApiGet={getWordleCommentsLeatest}
                    handleClose={handleSnackbarCloce}
                    message={'New Comment'}
                    position={{
                        top: 0,
                        left: client_rect ? client_rect!.width / 2 : 0
                    }}
                />
                {
                    wordle_comments_loading ?
                    <SuspensePrimary open={true} backdrop={false} />
                    :
                    wordle_comments.length > 0 ?
                    <React.Fragment>
                        {
                            wordle_comments.map((wordle_comment: any, index: number) => (
                                <React.Fragment key={index}>
                                    <WordleCommentListItem
                                        wordle_comment={wordle_comment}
                                    />
                                    <Divider />
                                </React.Fragment>
                            ))
                        }
                        <PaginationPrimary
                            handlePageChange={handlePageChange}
                        />
                    </React.Fragment>
                    :
                    <SimpleTextListItem text={no_item_text} />
                }
            </List>
        </Card>
    )
}

export default WordleCommentList;