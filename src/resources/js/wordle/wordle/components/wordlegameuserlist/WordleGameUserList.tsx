import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, List, Divider } from '@mui/material';
import WordleGameUserListItem from './WordleGameUserListItem';
import ButtonGroupPrimary from '@/common/button/buttongroupprimary/components/ButtonGroupPrimary';

export type WordleGameUserListProps = {
    users: any;
}

function WordleGameUserList(props: WordleGameUserListProps): React.ReactElement {
    const {users} = props;

    return (
        <Card elevation={1}>
            <ButtonGroupPrimary
                head={true}
                items={[
                    {
                        text: 'Members',
                        value: 'members',
                        active: false
                    },
                ]}
            />
            <List sx={{minWidth: '100%', bgcolor: 'background.paper', pt: 0, pb: 0}}>
                {
                    Object.keys(users).filter((key: string) => (
                        users[key].status === 'connect' // startした場合disconnectでも表示して、ハイライトする
                    )).map((key: string, index: number) => (
                        <React.Fragment key={index}>
                            <WordleGameUserListItem
                                user={users[key].user}
                            />
                            <Divider />
                        </React.Fragment>
                    ))
                }
            </List>
        </Card>
    )
}

export default WordleGameUserList;