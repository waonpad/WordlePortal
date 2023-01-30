import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography, Avatar, Button, IconButton, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction } from '@mui/material';
import { grey } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { WordleCommentListItemProps } from '@/wordle/components/wordlecommentlist/types/WordleCommentListType';

function WordleCommentListItem(props: WordleCommentListItemProps): React.ReactElement {
    const {wordle_comment} = props;
    
    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar src={`/storage/${wordle_comment.user.icon}`} component={Link} to={`/user/${wordle_comment.user.screen_name}`} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box>
                        <Link to={`/user/${wordle_comment.user.screen_name}`} style={{color: '#000000DE', display: 'inline-block'}}>
                            <Box sx={{display: 'flex', ':hover': {backgroundColor: grey[50]}}}>
                                <Typography color={'#000000DE'}>
                                    {wordle_comment.user.name}
                                </Typography>
                                <Typography color={grey[500]} sx={{marginLeft: 1}}>
                                    @{wordle_comment.user.screen_name}
                                </Typography>
                            </Box>
                        </Link>
                        <Typography color={grey[500]}>{new Date(wordle_comment.created_at).toLocaleString()}</Typography>
                    </Box>
                }
                secondary={
                <React.Fragment>
                    <Typography
                        sx={{display: 'inline', whiteSpace: 'pre-line'}}
                        component="span"
                        variant="body2"
                        color={grey[700]}
                    >
                        {wordle_comment.comment}
                    </Typography>
                </React.Fragment>
                }
            />
            <ListItemSecondaryAction sx={{top: '35px'}}>
                <IconButton aria-label="settings">
                    <MoreVertIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default WordleCommentListItem;