import React, { useState, useEffect } from 'react';
import { Button, Container, Grid } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { WordleLobbyProps } from '@/wordle/types/WordleType';
import WordleGameUserList from '@/wordle/wordle/components/wordlegameuserlist/WordleGameUserList';
import WordleGamePrimaryDetail from '@/wordle/wordle/components/WordlGamePrmaryDetail';

function WordleLobby(props: WordleLobbyProps): React.ReactElement {
    const {game_status, firebase_game_data, handleGameStart} = props;

    const auth = useAuth();

    return (
        <Container maxWidth={'md'}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <WordleGamePrimaryDetail
                        game_status={game_status}
                    />
                </Grid>
                <Grid item xs={12}>
                    <WordleGameUserList
                        users={firebase_game_data.users}
                        firebase_game_data={firebase_game_data}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        fullWidth
                        variant='contained'
                        disabled={
                            auth!.user!.id === firebase_game_data.host ? false //自分がゲーム作成者ならstartできる
                            :
                            (Object.keys(firebase_game_data.users).filter((key) => (
                                firebase_game_data.users[key].status === 'connect'
                            ))).includes(`u${firebase_game_data.host}`) === false // ゲーム作成者がいなくて
                            &&
                            `u${auth!.user!.id.toString()}` === Object.keys(firebase_game_data.users).filter((key) => (
                                firebase_game_data.users[key].status === 'connect'
                            ))[0] ? false // 自分が一番idが若いならstartできる
                            :
                            true
                        }
                        onClick={handleGameStart}
                    >
                        Game Start
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )
}

export default WordleLobby;