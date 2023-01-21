import React, { useEffect, useState, useRef } from 'react';
import { Container } from '@mui/material';
import WordleCommentList from '@/wordle/components/wordlecommentlist/components/WordleCommentList';
import ButtonGroupPrimary from '@/common/button/buttongroupprimary/components/ButtonGroupPrimary';

function Test(): React.ReactElement {
    return (
        <React.Fragment>
            <Container maxWidth={'md'}>
                <WordleCommentList
                    head={
                        <ButtonGroupPrimary
                            head={true}
                            items={[
                                {
                                    text: 'Comments',
                                    value: 'wordle_comments',
                                    active: false
                                },
                            ]}
                        />
                    }
                    request_config={{
                        api_url: 'wordle/comment/comments',
                        params: {wordle_id: 10},
                        response_keys: ['wordle_comments'],
                    }}
                    listen={false}
                    no_item_text={'No Comments'}
                />
            </Container>
        </React.Fragment>
    )
}

export default Test;