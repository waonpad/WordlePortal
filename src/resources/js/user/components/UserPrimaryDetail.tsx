import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import swal from "sweetalert";
import { Grid, Typography, Avatar, Card, CardContent, Button, Collapse, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ExpandMore, ExpandLess, MoreHoriz } from '@mui/icons-material';
import { MenuItem, Menu } from '@material-ui/core';
import { UserPrimaryDetailProps } from '../types/UserType';

function UserPrimaryDetail(props: UserPrimaryDetailProps): React.ReactElement {
    const {user_data, myself, follow, setFollow, expanded, setExpanded} = props;

    const [user_menu_anchor_el, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
    const is_menu_open = Boolean(user_menu_anchor_el);
    
    // descriptionの展開 ///////////////////////////////////////////////////////////////////////
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    /////////////////////////////////////////////////////////////////////////

    // 設定メニュー関連 /////////////////////////////////////////////////////////////////////////
    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchorEl(event.currentTarget);
    };
    
    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    const more_horiz_id = 'user-menu';
    const render_user_menu = (
        <Menu
            anchorEl={user_menu_anchor_el}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            id={more_horiz_id}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={is_menu_open}
            onClose={handleUserMenuClose}
        >
            {/* 後で設定する */}
            <MenuItem onClick={handleUserMenuClose}>項目</MenuItem>
            <MenuItem onClick={handleUserMenuClose}>項目</MenuItem>
        </Menu>
    )
    /////////////////////////////////////////////////////////////////////////
    
    // フォロー /////////////////////////////////////////////////////////////////////////
    const followToggle = () => {
        axios.post('/api/user/followtoggle', {screen_name: user_data.screen_name}).then(res => {
            console.log(res);
            if(res.data.status === true) {
                setFollow(res.data.follow);
            }
            else {
                swal("処理失敗", "処理失敗", "error");
            }
        }).catch(error => {
            console.log(error)
            swal("処理失敗", "処理失敗", "error");
        });
    }
    /////////////////////////////////////////////////////////////////////////

    return (
        <Card elevation={1} sx={{minWidth: '100%'}}>
            {render_user_menu}
            <CardContent sx={{paddingBottom: 0}}>
                <Grid container spacing={1} sx={{textAlign: 'center', position: 'relative'}}>
                    {/* 設定メニュー */}
                    <IconButton
                        sx={{position: 'absolute', top: 0, right: '12px'}}
                        edge="end"
                        aria-controls={more_horiz_id}
                        aria-haspopup="true"
                        onClick={handleUserMenuOpen}
                    >
                        <MoreHoriz />
                    </IconButton>
                    <Grid item xs={12} sx={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
                        {user_data.icon !== null ? <Avatar src={`/storage/${user_data.icon}`} sx={{height: '100px', width: '100px'}} /> : <Avatar sx={{height: '100px', width: '100px'}}>A</Avatar>}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography fontSize={28}>
                            {user_data.name}
                        </Typography>
                        <Typography color={grey[500]}>
                            @{user_data.screen_name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{marginTop: 1}}>
                        {
                            myself ? (
                                <Button variant='outlined' fullWidth>Edit Profile</Button>
                            ) : (
                                <Button variant='outlined' fullWidth onClick={followToggle}>{follow ? 'unFollow' : 'Follow'}</Button>
                            )
                        }
                    </Grid>
                    <Grid item container xs={12} spacing={1} sx={{marginTop: 0.5}}>
                        <Grid item xs={4}>
                            {/* 投稿数をカウント */}
                            <Typography color={grey[700]}>0</Typography>
                            <Typography color={grey[500]}>Post</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography color={grey[700]}>{user_data.follows.length}</Typography>
                            <Typography color={grey[500]}>Follow</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography color={grey[700]}>{user_data.followers.length}</Typography>
                            <Typography color={grey[500]}>Follower</Typography>
                        </Grid>
                    </Grid>
                    {/* description */}
                    <Grid item xs={12} sx={{marginTop: 2, textAlign: 'left', whiteSpace: 'pre-line'}}>
                        <Collapse in={expanded} collapsedSize={'9em'}>
                            <Typography sx={{color: grey[700]}}>{user_data.description}</Typography>
                        </Collapse>
                    </Grid>
                </Grid>
            </CardContent>
            {/* descriptionを展開するボタン */}
            {/* 高さが設定値未満でもMOREが出てしまうが、手間なので妥協している */}
            <Button
                fullWidth
                onClick={handleExpandClick}
                startIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            >
                {expanded ? "LESS" : "MORE"}
            </Button>
        </Card>
    )
}

export default UserPrimaryDetail;