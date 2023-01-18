import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography, Avatar, Button, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction } from '@mui/material';
import { grey } from '@mui/material/colors';
import { WordleCommentListItemProps } from '../types/WordleCommentListType';

function WordleCommentListItem(props: WordleCommentListItemProps): React.ReactElement {
    const {wordle_comment} = props;
    
    return (
        <ListItem
            alignItems="flex-start"
        >
            <ListItemAvatar>
                <Avatar src={`/storage/${wordle_comment.user.icon}`} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Link to={`/user/${wordle_comment.user.screen_name}`}>
                        <Box sx={{display: 'flex'}}>
                            <Typography color={'#000000DE'}>
                                {wordle_comment.user.name}
                            </Typography>
                            <Typography color={grey[500]} sx={{marginLeft: 1}}>
                                @{wordle_comment.user.screen_name}
                            </Typography>
                        </Box>
                    </Link>
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
            {/* <ListItemSecondaryAction sx={{top: '35px'}}>
            </ListItemSecondaryAction> */}
        </ListItem>
    )
}

export default WordleCommentListItem;