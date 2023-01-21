import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography, Avatar, Button, IconButton, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction } from '@mui/material';
import { grey } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export type NotificationListItemFollowProps = {
    follow_notification: any;
}

function NotificationListItemFollow(props: NotificationListItemFollowProps): React.ReactElement {
    const {follow_notification} = props;
    
    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar src={`/storage/${follow_notification.resource.following.icon}`} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box>
                        <Link to={`/user/${follow_notification.resource.following.screen_name}`}>
                            <Box sx={{display: 'flex'}}>
                                <Typography color={'#000000DE'}>
                                    {follow_notification.resource.following.name}
                                </Typography>
                                <Typography color={grey[500]} sx={{marginLeft: 1}}>
                                    @{follow_notification.resource.following.screen_name}
                                </Typography>
                            </Box>
                        </Link>
                        <Typography color={grey[500]}>{new Date(follow_notification.resource.following.created_at).toLocaleString()}</Typography>
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
                        {follow_notification.resource.following.description}
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

export default NotificationListItemFollow;