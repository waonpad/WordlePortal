import React, { useState, useEffect } from 'react';
// import { Button } from '@material-ui/core';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Link } from "react-router-dom";
import axios from 'axios';
import Card from '@mui/material/Card';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Avatar } from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { borders } from '@mui/system';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { styled } from '@mui/material';
import AbcIcon from '@mui/icons-material/Abc';
import PinIcon from '@mui/icons-material/Pin';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import PersonIcon from '@mui/icons-material/Person'; // 参加者数
import AutorenewIcon from '@mui/icons-material/Autorenew'; // laps
import AlarmIcon from '@mui/icons-material/Alarm'; // 制限時間
import AlarmOffIcon from '@mui/icons-material/AlarmOff'; // 制限時間無し
import InvertColorsIcon from '@mui/icons-material/InvertColors'; // 着色
import InvertColorsOffIcon from '@mui/icons-material/InvertColorsOff'; // 着色無し
import Tooltip from '@mui/material/Tooltip';
import { useAuth } from '../../contexts/AuthContext';
import { GameListItemProps } from '../types/GameType';

function GameListItem(props: GameListItemProps): React.ReactElement {
    const {game, handleDeleteGame, handleVSPlayOptionOpen} = props;

    const auth = useAuth();

    return (
        <Grid item xs={12} sx={{minWidth: '100%'}}>
            <Card elevation={1}>
                <CardHeader
                    avatar={
                        <Avatar src={`/storage/${game.user.icon}`} />
                    }
                    action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                        {/* TODO: アクション追加 */}
                    </IconButton>
                    }
                    subheader={
                        <React.Fragment>
                            <Link to={`/user/${game.user.screen_name}`} style={{color: '#000000DE'}}>{game.user.name}</Link>
                            <Typography>{new Date(game.created_at).toLocaleString()}</Typography>
                        </React.Fragment>
                    }
                    sx={{pb: 1}}
                />
                <CardContent sx={{pt: 0, pb: 0}}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                {game.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center'}}>
                                <LocalOfferIcon sx={{color: '#757575'}} />
                                {(game.tags as any[]).map((tag: any, index: number) => (
                                    <Link to={`/wordle/tag/${tag.id}`} key={index}><Chip clickable label={tag.name} /></Link>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>{game.description}</Typography>
                        </Grid>
                        <Grid item container xs={12}>
                            <Grid item>
                                <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1}}>
                                {/* <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1, marginLeft: 'auto'}}> */}
                                    {(game.input as string[]).map((input: string, index: number) => (
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
                                    <Tooltip title={`Max Participants: ${game.max_participants}`}>
                                        <Chip sx={{borderRadius: '4px', fontWeight: 'bold', color: '#757575'}}
                                            icon={<PersonIcon />}
                                            // firebaseから現在の参加者を取得する？(めんどう・・・)
                                            label={`0 / ${game.max_participants}`}
                                        />
                                    </Tooltip>
                                    <Tooltip title={`Laps: ${game.laps}`}>
                                        <Chip sx={{borderRadius: '4px', fontWeight: 'bold', color: '#757575'}}
                                            icon={<AutorenewIcon />}
                                            label={game.laps}
                                        />
                                    </Tooltip>
                                    <Tooltip title={`Answer Time Limit: ${game.answer_time_limit ? `${game.answer_time_limit}s` : 'none'}`}>
                                        <Chip sx={{borderRadius: '4px', fontWeight: 'bold', color: '#757575'}}
                                            icon={game.answer_time_limit ? <AlarmIcon /> : <></>}
                                            label={game.answer_time_limit ? `${game.answer_time_limit}s` : <AlarmOffIcon />}
                                        />
                                    </Tooltip>
                                    <Tooltip title={`Coloring: ${game.coloring ? 'Colored' : 'Plain'}`}>
                                        <Chip sx={{borderRadius: '4px', fontWeight: 'bold', color: '#757575'}}
                                            label={game.coloring ? <InvertColorsIcon /> : <InvertColorsOffIcon />}
                                        />
                                    </Tooltip>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions disableSpacing>
                    {auth?.user?.id == game.user.id ? (
                            <React.Fragment>
                                <IconButton data-game-id={game.id} onClick={handleVSPlayOptionOpen}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton data-delete-id={game.id} onClick={handleDeleteGame}>
                                    <DeleteIcon />
                                </IconButton>
                            </React.Fragment>
                    ) : (
                        <></>
                    )}
                    <ButtonGroup variant='contained' sx={{marginLeft: 'auto'}}>
                        <Link to={`/wordle/game/${game.wordle_id}/${game.uuid}`}>
                            <Button style={{fontWeight: 'bold', color: '#fff'}}>Join</Button>
                        </Link>
                    </ButtonGroup>
                </CardActions>
            </Card>
        </Grid>
    )
}

export default GameListItem;