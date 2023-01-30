import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography, Avatar, Button, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction } from '@mui/material';
import { grey } from '@mui/material/colors';

export type WordleGameUserListItemProps = {
    user: any;
    firebase_game_data: any;
}

function WordleGameUserListItem(props: WordleGameUserListItemProps): React.ReactElement {
    const {user, firebase_game_data} = props;

    useEffect(() => {
        console.log(user)
    }, [user])
    
    return (
        <ListItem alignItems="flex-start" sx={{paddingRight: '140px'}} component={Link} to={`/user/${user.screen_name}`}>
            <ListItemAvatar>
                <Avatar src={`/storage/${user.icon}`} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Link to={`/user/${user.screen_name}`} style={{color: '#000000DE', display: 'inline-block'}}>
                        <Box sx={{display: 'flex', ':hover': {backgroundColor: grey[50]}}}>
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
            {firebase_game_data.status !== 'wait' && (
                <ListItemSecondaryAction sx={{top: '35px'}}>
                    <Typography fontWeight={'bold'} fontSize='large' color='primary'>Order {firebase_game_data.users[`u${user.id}`].order}</Typography>
                    {firebase_game_data.status === 'end' && <Typography fontWeight={'bold'} fontSize='large' color='primary'>Result {firebase_game_data.users[`u${user.id}`].result}</Typography>}
                </ListItemSecondaryAction>
            )}
        </ListItem>
    )
}

export default WordleGameUserListItem;