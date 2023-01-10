import React from 'react';
import Container from '@mui/material/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Badge } from '@mui/material'; // @material-ui/core/だと怒られる
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Home, Chat, Forum, Group, Login, PersonAdd } from '@mui/icons-material';
import { Settings } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Button, Card, Box } from '@material-ui/core';
import clsx from 'clsx';
import { Link, useHistory } from "react-router-dom";
import swal from 'sweetalert';
import { useAuth } from '../../../contexts/AuthContext';
import { HeaderStyle } from '../styles/HeaderStyle';
import DrawerPrimary from "./DrawerPrimary";
import HeaderSearch from "./HeaderSearch";
import { useNotification } from '../../../contexts/NotificationContext';
import SimpleFooter from '../../footer/simplefooter/components/SimpleFooter';

/////////////////////////////////////////////////////////////////////////
// muiのバージョンが違い、スタイルの書き方も違うため個別に設定しないといけない
/////////////////////////////////////////////////////////////////////////

type Props = {
    children: React.ReactNode
}

export default function HeaderPrimary({children}: Props) {
    
    const history = useHistory();
    const auth = useAuth();
    const notification = useNotification();

    // Logout //////////////////////////////////////////////////
    const logout = () => {
        auth?.signout().then(() => {
            swal("ログアウトしました", "ログアウト成功", "success");
            history.push('/');
            location.reload();
        })
    }
    ////////////////////////////////////////////////////////////

    // Drawer /////////////////////////////////////////////////
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        open ? setOpen(false) : setOpen(true);
    };
    //////////////////////////////////////////////////////////////

    // AppBar ////////////////////////////////////////////////////////////////////////////////////
    const classes = HeaderStyle();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [settingAnchorEl, setSettingAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isSettingMenuOpen = Boolean(settingAnchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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
        <MenuItem aria-label="show new notifications" component={Link} to='/' style={{ textDecoration: 'none', color: "inherit" }}>
            <IconButton color="inherit">
                <Badge badgeContent={notification.unread_notifications ? Object.keys(notification.unread_notifications).length : 0} color="secondary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Typography>Notifications</Typography>
        </MenuItem>
        <MenuItem aria-label='go to current user' component={Link} to={'/user/' + auth?.user!.screen_name} style={{ textDecoration: 'none', color: "inherit" }}>
            <IconButton color="inherit">
                <AccountCircle />
            </IconButton>
            <Typography>Profile</Typography>
        </MenuItem>
        <MenuItem>
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
            <Typography>Setting</Typography>
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
                    Material-UI
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
                    // https://zenn.dev/cryptobox/articles/2dc6fe0951eeca

                    <div className={classes.sectionDesktop}>
                    
                    <IconButton aria-label="show new notifications" component={Link} to='/' style={{ textDecoration: 'none', color: "inherit" }}>
                        <Badge badgeContent={notification.unread_notifications ? Object.keys(notification.unread_notifications).length : 0} color="secondary">
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
        </div>
    );
}
