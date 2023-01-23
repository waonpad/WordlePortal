import React, { useState, forwardRef, useEffect } from 'react';
import Container from '@mui/material/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Badge } from '@mui/material';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Home, Chat, Forum, Group, Login, PersonAdd } from '@mui/icons-material';
import { Settings } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Button, Card, Box } from '@material-ui/core';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import clsx from 'clsx';
import { Link, useHistory } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { HeaderPrimaryStyle } from '@/common/header/headerprimary/styles/HeaderPrimaryStyle';
import DrawerPrimary from '@/common/drawer/drawerprimary/components/DrawerPrimary';
import HeaderSearch from '@/common/header/headerprimary/components/HeaderSearch';
import { useNotification } from '@/contexts/NotificationContext';
import SimpleFooter from '@/common/footer/simplefooter/components/SimpleFooter';
import { HeaderPrimaryProps } from '@/common/header/headerprimary/types/HeaderPrimaryType';
import { yellow, green, grey } from '@mui/material/colors';
import NotificationList from '@/common/notification/components/NotificationList';
import { NotificationListProps } from '@/common/notification/types/NotificationListType';

/////////////////////////////////////////////////////////////////////////
// muiのバージョンが違い、スタイルの書き方も違うため個別に設定しないといけない
/////////////////////////////////////////////////////////////////////////

const ReNotificationList = forwardRef<HTMLDivElement, NotificationListProps>((props, ref) => {
    return (<NotificationList no_item_text={props.no_item_text} forwardRef={ref} />);
});

export default function HeaderPrimary({children}: HeaderPrimaryProps) {
    const project_name = 'Wordle Portal';
    const location = useLocation();
    const history = useHistory();
    const auth = useAuth();
    const notification = useNotification();
    const [open, setOpen] = useState(false);
    const classes = HeaderPrimaryStyle();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [settingAnchorEl, setSettingAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);
    const isSettingMenuOpen = Boolean(settingAnchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isNotificationOpen = Boolean(notificationAnchorEl);

    useEffect(() => {
        setAnchorEl(null);
        setSettingAnchorEl(null);
        setNotificationAnchorEl(null);
        setMobileMoreAnchorEl(null);
    }, [location])

    // notification ///////////////////////////////////////////////////////////////////////
    const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationAnchorEl(event.currentTarget);
    }

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
        // notification?.readAllNotifications(); // TODO: テスト用に既読処理を外している 後でコメントアウトを解除
    }
    
    const notificationPopoverId = 'primary--notification';
    const renderNotificationPopover = (
        <Popover
            anchorEl={notificationAnchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            id={notificationPopoverId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isNotificationOpen}
            onClose={handleNotificationClose}
            BackdropProps={{ invisible: true }}
        >
            <Box sx={{width: '500px', maxWidth: '90vw'}}>
                <ReNotificationList
                    no_item_text={'No Notification'}
                />
            </Box>
        </Popover>
    );
    /////////////////////////////////////////////////////////////////////////

    // Logout //////////////////////////////////////////////////
    const logout = () => {
        auth?.signout().then((res: any) => {
            if (res.data.status === true) {
                history.push('/');
                window.location.reload();
            }
            else if (res.data.status === false) {
                // 失敗時の処理
            }
        })
    }
    ////////////////////////////////////////////////////////////

    // Drawer /////////////////////////////////////////////////
    const handleDrawerOpen = (event: React.MouseEvent<HTMLElement>) => {
        open ? setOpen(false) : setOpen(true);
    };
    //////////////////////////////////////////////////////////////

    // AppBar ////////////////////////////////////////////////////////////////////////////////////
    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSettingMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setSettingAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSettingAnchorEl(null)
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            <MenuItem onClick={logout}>Log Out</MenuItem>
        </Menu>
    );

    const settingMenuId = 'primary-search-setting-menu';
    const renderSettingMenu = (
        <Menu
            anchorEl={settingAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={settingMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isSettingMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose} component={Link} to={'/setting'} style={{ textDecoration: 'none', color: 'inherit' }}>Setting</MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to={'/about'} style={{ textDecoration: 'none', color: 'inherit' }}>About</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = !auth?.user ? (
        // ログインしていない
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handleMenuClose} component={Link} to={'/login'} style={{ textDecoration: 'none', color: 'inherit' }}>
                <IconButton aria-label="go to login" color="inherit">
                    <Login />
                </IconButton>
                <Typography>Login</Typography>
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to={'/register'} style={{ textDecoration: 'none', color: 'inherit' }}>
                <IconButton aria-label="go to register" color="inherit">
                    <PersonAdd />
                </IconButton>
                <Typography>Register</Typography>
            </MenuItem>
        </Menu>
    ) : (
        // ログインしている
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem aria-label="show new notifications" onClick={handleNotificationOpen}>
                <IconButton aria-label="show new notifications" color="inherit">
                    <Badge badgeContent={notification?.unread_notifications ? notification?.unread_notifications.length : 0} max={99} sx={{"& .MuiBadge-badge": {fontWeight: 'bold', color: '#fff', backgroundColor: green[700]}}}>
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <Typography>Notifications</Typography>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose}  aria-label='go to current user' component={Link} to={'/user/' + auth?.user!.screen_name} style={{ textDecoration: 'none', color: "inherit" }}>
                <IconButton color="inherit">
                    <AccountCircle />
                </IconButton>
                <Typography>Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose} component={Link} to={'/setting'} style={{ textDecoration: 'none', color: 'inherit' }}>
                <IconButton
                    // aria-label="show setting and others"
                    // aria-controls={settingMenuId}
                    // aria-haspopup="true"
                    // onClick={handleSettingMenuOpen}
                    color="inherit"
                >
                    <Settings />
                </IconButton>
                <Typography>Setting</Typography>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose} component={Link} to={'/about'} style={{ textDecoration: 'none', color: 'inherit' }}>
                <IconButton color="inherit">
                    <InfoIcon />
                </IconButton>
                <Typography>About</Typography>
            </MenuItem>
            <MenuItem onClick={logout}>
                <IconButton color="inherit">
                    <LogoutIcon />
                </IconButton>
                <Typography>Logout</Typography>
            </MenuItem>
        </Menu>
    )

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                className={classes.appBar}
            >
                <Toolbar>
                <IconButton
                    edge="start"
                    className={clsx(classes.menuButton, open)}
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                >
                    <MenuIcon />
                </IconButton>
                <Typography className={classes.title} variant="h6" noWrap component={Link} to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {project_name}
                </Typography>
                <HeaderSearch classes={classes} />
                <div className={classes.grow} />

                {!auth?.user ? (
                    // ログインしていない
                    <div className={classes.sectionDesktop}>
                        <Button component={Link} to='/login' style={{ textDecoration: 'none', color: 'inherit' }}>Login</Button>
                        <Button component={Link} to='/register' style={{ textDecoration: 'none', color: 'inherit' }}>Register</Button>
                    </div>
                ) : (
                    // ログインしている
                    <div className={classes.sectionDesktop}>
                    
                    <IconButton aria-label="show new notifications" onClick={handleNotificationOpen} style={{color: "inherit"}}>
                        <Badge badgeContent={notification?.unread_notifications ? notification?.unread_notifications.length : 0} max={99} sx={{"& .MuiBadge-badge": {fontWeight: 'bold', color: green[700], backgroundColor: yellow[400]}}}>
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <IconButton aria-label='go to current user' component={Link} to={'/user/' + auth?.user!.screen_name} style={{ textDecoration: 'none', color: "inherit" }}>
                        <AccountCircle />
                    </IconButton>

                    <IconButton
                        edge="end"
                        aria-label="show setting and others"
                        aria-controls={settingMenuId}
                        aria-haspopup="true"
                        onClick={handleSettingMenuOpen}
                        color="inherit"
                    >
                        <Settings />
                    </IconButton>
                    </div>
                )}

                <div className={classes.sectionMobile}>
                    <IconButton
                        aria-label="show more"
                        aria-controls={mobileMenuId}
                        aria-haspopup="true"
                        onClick={handleMobileMenuOpen}
                        color="inherit"
                    >
                    <MoreIcon />
                    </IconButton>
                </div>
                </Toolbar>
            </AppBar>
            <DrawerPrimary open={open} classes={classes} handleDrawerOpen={handleDrawerOpen} />
            <Box
                className={clsx(classes.content, {
                    [classes.contentShift]: open
                })}
            >
                <div className={classes.drawerHeader} />
                <Container
                    component="main"
                    maxWidth={false}
                >
                    {children}
                </Container>
                <SimpleFooter />
            </Box>
            {renderMobileMenu}
            {renderMenu}
            {renderSettingMenu}
            {renderNotificationPopover}
        </div>
    );
}
