import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import swal from "sweetalert";
import { Grid, Typography, Avatar, Card, CardContent, Button, Collapse, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ExpandMore, ExpandLess, MoreHoriz } from '@mui/icons-material';
import { MenuItem, Menu } from '@material-ui/core';
import { UserPrimaryDetailProps } from '../types/UserType';
import ModalPrimary from '../../common/modal/modalprimary/components/ModalPrimary';
import EditProfile from './EditProfile';

function UserPrimaryDetail(props: UserPrimaryDetailProps): React.ReactElement {
    const {user, myself, follow, setFollow, expanded, setExpanded} = props;

    const [user_menu_anchor_el, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
    const is_menu_open = Boolean(user_menu_anchor_el);
    const [modalIsOpen, setIsOpen] = useState(false);
    
    // descriptionの展開 ///////////////////////////////////////////////////////////////////////
    const handleExpandClick = (event: React.MouseEvent<HTMLElement>) => {
        setExpanded(!expanded);
    };
    /////////////////////////////////////////////////////////////////////////

    // 設定メニュー関連 /////////////////////////////////////////////////////////////////////////
    const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchorEl(event.currentTarget);
    };
    
    const handleUserMenuClose = (event: React.MouseEvent<HTMLElement>) => {
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
        axios.post('/api/user/followtoggle', {screen_name: user.screen_name}).then(res => {
            if(res.data.status === true) {
                setFollow(res.data.follow);
            }
            else if (res.data.status === false) {
                // TODO: 失敗時の処理
            }
        })
    }
    /////////////////////////////////////////////////////////////////////////

    // Edit Profile /////////////////////////////////////////////////////////////////////////////
    const handleEditProfileOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setIsOpen(true);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <Card elevation={1} sx={{minWidth: '100%'}}>
            {render_user_menu}
            <ModalPrimary isOpen={modalIsOpen} maxWidth={'540px'}>
                <EditProfile user={user} handleModalClose={setIsOpen} />
                <Button onClick={() => setIsOpen(false)}>Close Modal</Button>
            </ModalPrimary>
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
                        {<Avatar src={`/storage/${user.icon}`} sx={{height: '100px', width: '100px'}} />}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography fontSize={28}>
                            {user.name}
                        </Typography>
                        <Typography color={grey[500]}>
                            @{user.screen_name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{marginTop: 1}}>
                        {
                            myself ? (
                                <Button variant='outlined' fullWidth onClick={handleEditProfileOpen}>Edit Profile</Button>
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
                            <Typography color={grey[700]}>{user.follows.length}</Typography>
                            <Typography color={grey[500]}>Follow</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography color={grey[700]}>{user.followers.length}</Typography>
                            <Typography color={grey[500]}>Follower</Typography>
                        </Grid>
                    </Grid>
                    {/* description */}
                    <Grid item xs={12} sx={{marginTop: 2, textAlign: 'left', whiteSpace: 'pre-line'}}>
                        <Collapse in={expanded} collapsedSize={'9em'}>
                            <Typography sx={{color: grey[700]}}>{user.description}</Typography>
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