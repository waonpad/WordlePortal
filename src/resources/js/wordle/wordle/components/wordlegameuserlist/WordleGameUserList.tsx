import React, { useEffect, useState, useRef } from 'react';
import { Card, List, Divider } from '@mui/material';
import WordleGameUserListItem from './WordleGameUserListItem';
import ButtonGroupPrimary from '@/common/button/buttongroupprimary/components/ButtonGroupPrimary';
import { WordleGameUserListProps } from '@/wordle/types/GameType';

function WordleGameUserList(props: WordleGameUserListProps): React.ReactElement {
    const {users, firebase_game_data} = props;

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
            <List sx={{minWidth: '100%', bgcolor: 'background.paper'}}>
                {
                    Object.keys(users).filter((key: string) => (
                        firebase_game_data.status !== 'wait' ? 'order' in users[key] : users[key].status === 'connect'
                    )).map((key: string, index: number) => (
                        <React.Fragment key={index}>
                            {
                                users[key].user !== undefined &&
                                <WordleGameUserListItem
                                    user={users[key].user}
                                    firebase_game_data={firebase_game_data}
                                />
                            }
                            <Divider />
                        </React.Fragment>
                    ))
                }
            </List>
        </Card>
    )
}

export default WordleGameUserList;