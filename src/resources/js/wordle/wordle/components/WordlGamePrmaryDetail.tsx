import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Box, Button, Grid, Card, CardHeader, CardContent, Chip, Stack, Avatar, IconButton, Typography, Tooltip } from '@mui/material';
import { grey } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AbcIcon from '@mui/icons-material/Abc';
import PinIcon from '@mui/icons-material/Pin';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import PersonIcon from '@mui/icons-material/Person'; // 参加者数
import AutorenewIcon from '@mui/icons-material/Autorenew'; // laps
import AlarmIcon from '@mui/icons-material/Alarm'; // 制限時間
import AlarmOffIcon from '@mui/icons-material/AlarmOff'; // 制限時間無し
import InvertColorsIcon from '@mui/icons-material/InvertColors'; // 着色
import InvertColorsOffIcon from '@mui/icons-material/InvertColorsOff'; // 着色無し
import { useAuth } from '@/contexts/AuthContext';

export type WordleGamePrimaryDetailProps = {
    game_status: any;
}

function WordleGamePrimaryDetail(props: WordleGamePrimaryDetailProps): React.ReactElement {
    const {game_status} = props;

    const auth = useAuth();

    return (
        <Card elevation={1}>
            <CardContent sx={{pt: 1.5, "&:last-child": {pb: 1.5}}}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {game_status.game.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center'}}>
                            <LocalOfferIcon sx={{color: '#757575'}} />
                            {(game_status.game.tags as any[]).map((tag: any, index: number) => (
                                <Link to={`/wordle/game/tag/${tag.id}`} key={index}><Chip clickable label={tag.name} /></Link>
                            ))}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sx={{display: game_status.game.status === 'wait' ? 'block' : 'none'}}>
                        <Typography sx={{whiteSpace: 'pre-line'}}>{game_status.game.description}</Typography>
                    </Grid>
                    <Grid item container xs={12}>
                        <Grid item>
                            <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1}}>
                            {/* <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1, marginLeft: 'auto'}}> */}
                                {(game_status.game.input as string[]).map((input: string, index: number) => (
                                    <Chip key={index} sx={{borderRadius: '4px', fontWeight: 'bold', color: '#757575'}} label={
                                        input === 'japanese' ? 'あ'
                                        : input === 'english' ? <AbcIcon />
                                        : input === 'number' ? <PinIcon />
                                        : input === 'typing' ? <KeyboardIcon />
                                        : ''
                                    } />
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item sx={{marginLeft: 'auto'}}>
                            <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1}}>
                                <Tooltip title={`Max Participants: ${game_status.game.max_participants}`}>
                                    <Chip sx={{borderRadius: '4px', fontWeight: 'bold', color: '#757575'}}
                                        icon={<PersonIcon />}
                                        // firebaseから現在の参加者を取得する？(めんどう・・・)
                                        // label={`0 / ${game_status.game.max_participants}`}
                                        label={game_status.game.status === 'end' ? game_status.game_users.length : game_status.game.max_participants}
                                    />
                                </Tooltip>
                                <Tooltip title={`Laps: ${game_status.game.laps}`}>
                                    <Chip sx={{borderRadius: '4px', fontWeight: 'bold', color: '#757575'}}
                                        icon={<AutorenewIcon />}
                                        label={game_status.game.laps}
                                    />
                                </Tooltip>
                                <Tooltip title={`Answer Time Limit: ${game_status.game.answer_time_limit ? `${game_status.game.answer_time_limit}s` : 'none'}`}>
                                    <Chip sx={{borderRadius: '4px', fontWeight: 'bold', color: '#757575'}}
                                        icon={game_status.game.answer_time_limit ? <AlarmIcon /> : <></>}
                                        label={game_status.game.answer_time_limit ? `${game_status.game.answer_time_limit}s` : <AlarmOffIcon />}
                                    />
                                </Tooltip>
                                <Tooltip title={`Coloring: ${game_status.game.coloring ? 'Colored' : 'Plain'}`}>
                                    <Chip sx={{borderRadius: '4px', fontWeight: 'bold', color: '#757575'}}
                                        label={game_status.game.coloring ? <InvertColorsIcon /> : <InvertColorsOffIcon />}
                                    />
                                </Tooltip>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default WordleGamePrimaryDetail;