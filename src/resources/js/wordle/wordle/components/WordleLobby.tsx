import React, { useState, useEffect } from 'react';
import { Button, Container, Grid } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { WordleLobbyProps } from '@/wordle/types/WordleType';
import WordleGameUserList from './wordlegameuserlist/WordleGameUserList';
import WordleGamePrimaryDetail from './WordlGamePrmaryDetail';

function WordleLobby(props: WordleLobbyProps): React.ReactElement {
    const {game_status, firebase_game_data, handleGameStart} = props;

    const auth = useAuth();

    return (
        <Container maxWidth={'md'}>
            <Grid container spacing={2}>
                <Grid item xs={game_status.game.status === 'wait' ? 12 : 6}>
                    <WordleGamePrimaryDetail
                        game={game_status.game}
                    />
                </Grid>
                <Grid item xs={game_status.game.status === 'wait' ? 12 : 6}>
                    <WordleGameUserList
                        users={firebase_game_data.users}
                    />
                </Grid>
                <Grid item xs={12} sx={{display: game_status?.game?.status === 'wait' ? 'block' : 'none'}}>
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