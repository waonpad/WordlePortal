import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography, Avatar, Button, IconButton, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction } from '@mui/material';
import { grey } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

export type NotificationListItemFollowProps = {
    follow_notification: any;
}

function NotificationListItemFollow(props: NotificationListItemFollowProps): React.ReactElement {
    const {follow_notification} = props;
    
    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <PersonAddAlt1Icon sx={{fontSize: '40px'}} color='primary' />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Box>
                        <Link to={`/user/${follow_notification.resource.following.screen_name}`} style={{textDecoration: 'none', color: 'inherit'}}>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Avatar src={`/storage/${follow_notification.resource.following.icon}`} />
                                <Box sx={{marginLeft: 2}}>
                                    <Box sx={{display: 'flex'}}>
                                        <Typography color={'#000000DE'}>
                                            {follow_notification.resource.following.name}
                                        </Typography>
                                        <Typography color={grey[500]} sx={{marginLeft: 1}}>
                                            @{follow_notification.resource.following.screen_name}
                                        </Typography>
                                    </Box>
                                    <Typography>followed you</Typography>
                                </Box>
                            </Box>
                        </Link>
                    </Box>
                }
            />
        </ListItem>
    )
}

export default NotificationListItemFollow;