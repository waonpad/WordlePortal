import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button, Grid, Card, CardHeader, CardContent, Chip, Stack, Avatar, IconButton, Typography, ButtonGroup } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AbcIcon from '@mui/icons-material/Abc';
import PinIcon from '@mui/icons-material/Pin';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth } from '../../contexts/AuthContext';
import { WordleListItemProps } from '../types/WordleType';

function WordleListItem(props: WordleListItemProps): React.ReactElement {
    const {wordle, handleLikeToggle, handleDeleteWordle, handleVSPlayOptionOpen} = props;

    const auth = useAuth();

    return (
        <Grid item xs={12} sx={{minWidth: '100%'}}>
            <Card elevation={1}>
                <CardHeader
                    avatar={
                        <Avatar src={`/storage/${wordle.user.icon}`} />
                    }
                    action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                        {/* TODO: アクション追加 */}
                    </IconButton>
                    }
                    subheader={
                        <React.Fragment>
                            <Link to={`/user/${wordle.user.screen_name}`} style={{color: '#000000DE'}}>{wordle.user.name}</Link>
                            <Typography>{new Date(wordle.created_at).toLocaleString()}</Typography>
                        </React.Fragment>
                    }
                    sx={{pb: 1}}
                />
                <CardContent sx={{pt: 0, "&:last-child": {pb: 1}}}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography variant="h5">
                                {wordle.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center'}}>
                                <LocalOfferIcon sx={{color: '#757575'}} />
                                {(wordle.tags as any[]).map((tag: any, index: number) => (
                                    <Link to={`/wordle/tag/${tag.id}`} key={index}><Chip clickable label={tag.name} /></Link>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>{wordle.description}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1}}>
                            {/* <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1, marginLeft: 'auto'}}> */}
                                {(wordle.input as string[]).map((input: string, index: number) => (
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
                        <Grid item xs={12} sx={{display: 'flex'}}>
                            {auth?.user?.id == wordle.user.id ? (
                                    <React.Fragment>
                                        <IconButton component={Link} to={`/wordle/manage/${wordle.id}`}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton data-delete-id={wordle.id} onClick={handleDeleteWordle}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </React.Fragment>
                            ) : (
                                // いいねボタン
                                <IconButton data-like-id={wordle.id} onClick={handleLikeToggle} aria-label="add to favorites">
                                    <FavoriteIcon color={wordle.like_status ? 'secondary' : 'inherit'} />
                                </IconButton>
                            )}
                            <ButtonGroup variant='contained' sx={{marginLeft: 'auto'}}>
                                <Button style={{fontWeight: 'bold', color: '#fff'}}>Single Play</Button>
                                <Button style={{fontWeight: 'bold', color: '#fff'}} data-wordle-id={wordle.id} onClick={handleVSPlayOptionOpen}>VS Play</Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </CardContent>
                {/* <CardActions disableSpacing>
                </CardActions> */}
            </Card>
        </Grid>
    )
}

export default WordleListItem;