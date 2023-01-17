import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography, Avatar, Button, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction } from '@mui/material';
import { grey } from '@mui/material/colors';
import { UserListItemProps } from '../types/UserType';
import ParticalRenderLink from '../../common/link/particalrenderlink/components/ParticalRenderLink';

function UserListItem(props: UserListItemProps): React.ReactElement {
    const {user, followToggle} = props;
    
    const partical_render_route_paths = [
        `/user/:screen_name`,
        `/user/:screen_name/follows`,
        `/user/:screen_name/followers`,
        `/user/:screen_name/wordle`,
        `/user/:screen_name/wordle/game`,
        `/user/:screen_name/wordle/like`,
    ];
    
    return (
        <ListItem
            alignItems="flex-start"
            sx={{paddingRight: '140px'}} // もっと良い調整方法あるかも
        >
            <ListItemAvatar>
                <Avatar src={`/storage/${user.icon}`} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <ParticalRenderLink
                        path={{
                            path: `/user/${user.screen_name}`,
                            route_path: `/user/:screen_name`,
                            params: {screen_name: user.screen_name}
                        }}
                        partical_render_params={{screen_name: user.screen_name}}
                        partical_render_route_paths={partical_render_route_paths}
                    >
                        <Box sx={{display: 'flex'}}>
                            <Typography color={'#000000DE'}>
                                {user.name}
                            </Typography>
                            <Typography color={grey[500]} sx={{marginLeft: 1}}>
                                @{user.screen_name}
                            </Typography>
                        </Box>
                    </ParticalRenderLink>
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