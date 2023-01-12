import React, { useEffect, useState, ReactNode } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { alpha, makeStyles, Theme, useTheme, createStyles } from '@material-ui/core/styles';
import { Home, Chat, Forum, Group, Login, PersonAdd } from '@mui/icons-material';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link, useHistory } from "react-router-dom";
import { DrawerPrimaryProps } from '../types/DrawerPrimaryType';

function DrawerPrimary(props: DrawerPrimaryProps): React.ReactElement {
    const {classes, open, handleDrawerOpen, } = props;
    
    const theme = useTheme();

    return (
        <Drawer
            className={classes.drawer}
            variant='persistent'
            anchor="left"
            open={open}
            classes={{
            paper: classes.drawerPaper,
        }}
        >
        <div className={props.classes.drawerHeader}>
            <IconButton onClick={handleDrawerOpen}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
        </div>
        <Divider />
        <List>
            <ListItem button component={Link} to='/' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemIcon><Home /></ListItemIcon>
                <ListItemText primary='Home'></ListItemText>
            </ListItem>
            <ListItem button component={Link} to='/chat' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemIcon><Chat /></ListItemIcon>
                <ListItemText primary='Chat'></ListItemText>
            </ListItem>
            <ListItem button component={Link} to='/privatechat/waonpad' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemIcon><Forum /></ListItemIcon>
                <ListItemText primary='Private Chat'></ListItemText>
            </ListItem>
            <ListItem button component={Link} to='/groupchat/test' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemIcon><Group /></ListItemIcon>
                <ListItemText primary='Group Chat'></ListItemText>
            </ListItem>
            <ListItem button component={Link} to='/wordle/create' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemText primary='Wordle Create'></ListItemText>
            </ListItem>
            <ListItem button component={Link} to='/wordle/manage/1' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemText primary='Wordle Manage 1'></ListItemText>
            </ListItem>
            <ListItem button component={Link} to='/search' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemText primary='Search'></ListItemText>
            </ListItem>
            <ListItem button component={Link} to='/wordle/game/1' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemText primary='Wordle Game 1'></ListItemText>
            </ListItem>
            <ListItem button component={Link} to='/wordle/game/1/1' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemText primary='Wordle Game 1 - 1'></ListItemText>
            </ListItem>
        </List>
        </Drawer>
    )
};

export default DrawerPrimary;