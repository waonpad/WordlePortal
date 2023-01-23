import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography, Avatar, Button, IconButton, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction } from '@mui/material';
import { grey } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

export type NotificationListItemFWordleCommentProps = {
    wordle_comment_notification: any;
}

function NotificationListItemWordleComment(props: NotificationListItemFWordleCommentProps): React.ReactElement {
    const {wordle_comment_notification} = props;
    
    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <ChatBubbleIcon sx={{fontSize: '40px'}} color='primary' />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box>
                        <Link to={`/user/${wordle_comment_notification.resource.user.screen_name}`} style={{textDecoration: 'none', color: 'inherit'}}>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Avatar src={`/storage/${wordle_comment_notification.resource.user.icon}`} />
                                <Box sx={{marginLeft: 2}}>
                                    <Box sx={{display: 'flex'}}>
                                        <Typography color={'#000000DE'}>
                                            {wordle_comment_notification.resource.user.name}
                                        </Typography>
                                        <Typography color={grey[500]} sx={{marginLeft: 1}}>
                                            @{wordle_comment_notification.resource.user.screen_name}
                                        </Typography>
                                    </Box>
                                    <Typography>commented to your Wordle</Typography>
                                </Box>
                            </Box>
                        </Link>
                        <Box sx={{ml: 7}}>
                            <Link to={`/wordle/manage/${wordle_comment_notification.resource.wordle.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color='primary'
                                    >
                                        {wordle_comment_notification.resource.wordle.name}
                                    </Typography>
                                    <ShortcutIcon sx={{marginLeft: 1}} />
                                </Box>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                >
                                    {wordle_comment_notification.resource.comment}
                                </Typography>
                            </Link>
                        </Box>
                    </Box>
                }
            />
        </ListItem>
    )
}

export default NotificationListItemWordleComment;