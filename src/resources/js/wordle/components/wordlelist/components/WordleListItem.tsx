import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button, Grid, Card, CardHeader, CardContent, Chip, Stack, Avatar, IconButton, Typography, ButtonGroup, CircularProgress, Box } from '@mui/material';
import { grey } from '@mui/material/colors';
import { LoadingButton } from '@mui/lab';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AbcIcon from '@mui/icons-material/Abc';
import PinIcon from '@mui/icons-material/Pin';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth } from '@/contexts/AuthContext';
import { WordleListItemProps } from '@/wordle/types/WordleType';

function WordleListItem(props: WordleListItemProps): React.ReactElement {
    const {wordle, handleLikeToggle, handleDeleteWordle, handleSinglePlayStart, handleVSPlayOptionOpen} = props;

    const auth = useAuth();

    return (
        <Card elevation={1}>
            <CardHeader
                avatar={
                    <Avatar src={`/storage/${wordle.user.icon}`} component={Link} to={`/user/${wordle.user.screen_name}`} />
                }
                action={
                <IconButton aria-label="settings">
                    <MoreVertIcon />
                    {/* TODO: アクション追加 */}
                </IconButton>
                }
                subheader={
                    <React.Fragment>
                        <Link to={`/user/${wordle.user.screen_name}`} style={{color: '#000000DE', display: 'inline-block'}}>
                            <Box sx={{display: 'flex', ':hover': {backgroundColor: grey[50]}}}>
                                <Typography color={'#000000DE'}>
                                    {wordle.user.name}
                                </Typography>
                                <Typography color={grey[500]} sx={{marginLeft: 1}}>
                                    @{wordle.user.screen_name}
                                </Typography>
                            </Box>
                        </Link>
                        <Typography color={grey[500]}>{new Date(wordle.created_at).toLocaleString()}</Typography>
                    </React.Fragment>
                }
                sx={{pb: 1}}
            />
            <CardContent sx={{pt: 0, "&:last-child": {pb: 1.5}}}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {wordle.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {/* タグが無かったらどうする？ */}
                        <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center'}}>
                            <LocalOfferIcon sx={{color: '#757575'}} />
                            {(wordle.tags as any[]).map((tag: any, index: number) => (
                                <Link to={`/wordle/tag/${tag.id}`} key={index}><Chip clickable label={tag.name} /></Link>
                            ))}
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography sx={{whiteSpace: 'pre-line'}}>{wordle.description}</Typography>
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
                                    <IconButton component={Link} to={`/wordle/manage/${wordle.id}`} sx={{':hover': {color: 'rgba(0, 0, 0, 0.54)'}}}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton data-delete-id={wordle.id} onClick={handleDeleteWordle}>
                                        <DeleteIcon />
                                    </IconButton>
                                </React.Fragment>
                        ) : (
                            // いいねボタン
                            <IconButton data-like-id={wordle.id} onClick={handleLikeToggle} aria-label="add to favorites">
                                <FavoriteIcon color={wordle.like_status ? 'primary' : 'inherit'} />
                            </IconButton>
                        )}
                        <ButtonGroup variant='contained' sx={{marginLeft: 'auto'}}>
                            <Button style={{fontWeight: 'bold', color: '#fff'}} data-wordle-id={wordle.id} onClick={handleSinglePlayStart}>Single Play</Button>
                            <Button style={{fontWeight: 'bold', color: '#fff'}} data-wordle-id={wordle.id} onClick={handleVSPlayOptionOpen}>VS Play</Button>
                        </ButtonGroup>
                        {/* <Box sx={{marginLeft: 'auto'}}>
                            <LoadingButton variant='contained' loading={singleplay_loading} style={{fontWeight: 'bold', color: '#fff', borderTopRightRadius: 0, borderBottomRightRadius: 0}} data-wordle-id={wordle.id} onClick={handleSinglePlayStart}>Single Play</LoadingButton>
                            <Button variant='contained' style={{fontWeight: 'bold', color: '#fff', borderTopLeftRadius: 0, borderBottomLeftRadius: 0}} data-wordle-id={wordle.id} onClick={handleVSPlayOptionOpen}>VS Play</Button>
                        </Box> */}
                    </Grid>
                </Grid>
            </CardContent>
            {/* <CardActions disableSpacing>
            </CardActions> */}
        </Card>
    )
}

export default WordleListItem;