import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography, Avatar, Button, IconButton, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction } from '@mui/material';
import { grey } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { NotificationListItemFWordleLikeProps } from '@/common/notification/types/NotificationListType';

function NotificationListItemWordleLike(props: NotificationListItemFWordleLikeProps): React.ReactElement {
    const {wordle_like_notification} = props;
    
    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <FavoriteIcon sx={{fontSize: '40px'}} color='primary' />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box>
                        <Link to={`/user/${wordle_like_notification.resource.user.screen_name}`} style={{display: 'inline-block', textDecoration: 'none', color: 'inherit'}}>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Avatar src={`/storage/${wordle_like_notification.resource.user.icon}`} />
                                <Box sx={{marginLeft: 2}}>
                                    <Box sx={{display: 'flex', ':hover': {backgroundColor: grey[50]}}}>
                                        <Typography color={'#000000DE'}>
                                            {wordle_like_notification.resource.user.name}
                                        </Typography>
                                        <Typography color={grey[500]} sx={{marginLeft: 1}}>
                                            @{wordle_like_notification.resource.user.screen_name}
                                        </Typography>
                                    </Box>
                                    <Typography>liked your Wordle</Typography>
                                </Box>
                            </Box>
                        </Link>
                        <Link to={`/wordle/manage/${wordle_like_notification.resource.wordle.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', ml: 7}}>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color='primary'
                                >
                                    {wordle_like_notification.resource.wordle.name}
                                </Typography>
                                <ShortcutIcon sx={{marginLeft: 1}} />
                            </Box>
                        </Link>
                    </Box>
                }
            />
        </ListItem>
    )
}

export default NotificationListItemWordleLike;