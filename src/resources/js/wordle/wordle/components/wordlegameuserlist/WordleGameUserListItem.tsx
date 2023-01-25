import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography, Avatar, Button, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction } from '@mui/material';
import { grey } from '@mui/material/colors';

export type WordleGameUserListItemProps = {
    user: any;
}

function WordleGameUserListItem(props: WordleGameUserListItemProps): React.ReactElement {
    const {user} = props;

    useEffect(() => {
        console.log(user)
    }, [user])
    
    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar src={`/storage/${user.icon}`} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Link to={`/user/${user.screen_name}`}>
                        <Box sx={{display: 'flex'}}>
                            <Typography color={'#000000DE'}>
                                {user.name}
                            </Typography>
                            <Typography color={grey[500]} sx={{marginLeft: 1}}>
                                @{user.screen_name}
                            </Typography>
                        </Box>
                    </Link>
                }
                secondary={
                <React.Fragment>
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color={grey[700]}
                    >
                        {user.description}
                    </Typography>
                </React.Fragment>
                }
            />
        </ListItem>
    )
}

export default WordleGameUserListItem;