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
                <CardContent sx={{pt: 0, pb: 0}}>
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
                    </Grid>
                </CardContent>
                <CardActions disableSpacing>
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
                </CardActions>
            </Card>
        </Grid>
    )
}

export default WordleListItem;