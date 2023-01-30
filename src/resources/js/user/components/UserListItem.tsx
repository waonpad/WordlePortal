import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography, Avatar, Button, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction } from '@mui/material';
import { grey } from '@mui/material/colors';
import { UserListItemProps } from '@/user/types/UserType';

function UserListItem(props: UserListItemProps): React.ReactElement {
    const {user, followToggle} = props;
    
    return (
        <ListItem alignItems="flex-start" sx={{paddingRight: '140px'}}>
            <ListItemAvatar>
                <Avatar src={`/storage/${user.icon}`} component={Link} to={`/user/${user.screen_name}`} />
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
            <ListItemSecondaryAction sx={{top: '35px'}}>
                {
                    user.myself ? (
                        <></>
                    ) : (
                        <Button variant='outlined' sx={{width: '110px'}} onClick={followToggle} value={user.screen_name}>{user.follow ? 'unFollow' : 'Follow'}</Button>
                    )
                }
            </ListItemSecondaryAction>
        </ListItem>
    )
}

export default UserListItem;