import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Grid, Typography, Avatar, Card, CardContent, Button, Collapse, IconButton, List, ListItem, Divider } from '@mui/material';
import PaginationPrimary from '@/common/pagination/paginationprimary/components/PaginationPrimary';
import SuspensePrimary from '@/common/suspense/suspenseprimary/components/SuspensePrimary';
import SimpleTextListItem from '@/common/listitem/simpletextlistitem/components/SimpleTextListItem';
import WordleCommentListItem from '@/wordle/components/wordlecommentlist/components/WordleCommentListItem';
import { WordleCommentListProps } from '@/wordle/components/wordlecommentlist/types/WordleCommentListType';

function WordleCommentList(props: WordleCommentListProps): React.ReactElement {
    const {head, request_config, listen, no_item_text} = props;

    const [wordle_comments, setWordleComments] = useState<any[]>([]);
    const [wordle_comments_loading, setWordleCommentsLoading] = useState<boolean>(true);

    // API /////////////////////////////////////////////////////////////////////////
    const getWordleComments = (paginate: 'prev' | 'next') => {
        axios.get(`/api/${request_config.api_url}`, {params: {...request_config.params, per_page: 10, paginate: paginate, start: wordle_comments.length > 0 ? wordle_comments[0].id : null, last: wordle_comments.length > 0 ? wordle_comments.slice(-1)[0].id : null}}).then(res => {
            if(res.data.status === true) {
                var res_data = res.data;
                request_config.response_keys.forEach(key => {
                    res_data = res_data[key];
                });

                setWordleComments(res_data.reverse());
                setWordleCommentsLoading(false);
            }
            else if (res.data.status === false) {
                // TODO: ユーザーが存在しない時の処理
            }
        })
    }

    useEffect(() => {
        getWordleComments('prev');
    }, []);

    /////////////////////////////////////////////////////////////////////////
    // チャンネル関連のコードは今は必要無いので書いていない
    /////////////////////////////////////////////////////////////////////////

    // Page Change ///////////////////////////////////////////////////////////////////////
    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        getWordleComments(event.currentTarget.value as 'prev' | 'next');
    }
    /////////////////////////////////////////////////////////////////////////

    return (
        <Card elevation={1}>
            {head}
            <List sx={{minWidth: '100%', bgcolor: 'background.paper', pt: 0, pb: 0}}>
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