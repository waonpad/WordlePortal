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
import TimelineIcon from '@mui/icons-material/Timeline';
import { Link, useHistory } from "react-router-dom";
import { Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { DrawerPrimaryProps } from '@/common/drawer/drawerprimary/types/DrawerPrimaryType';
import SimpleFooter from '@/common/footer/simplefooter/components/SimpleFooter';

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
            style={{height: '100vh', position: 'relative'}}
        >
        <div className={props.classes.drawerHeader}>
            <IconButton onClick={handleDrawerOpen}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
        </div>
        <Divider />
        <List style={{paddingTop: 0}}>
            <ListItem button component={Link} to='/' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemIcon><Home /></ListItemIcon>
                <ListItemText primary='Home'></ListItemText>
            </ListItem>
            <Divider />
            <ListItem button component={Link} to='/wordle/follows' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemIcon><TimelineIcon /></ListItemIcon>
                <ListItemText primary='TimeLine'></ListItemText>
            </ListItem>
            <Divider />
            <ListItem button component={Link} to='/wordle/create' style={{ textDecoration: 'none', color: "inherit" }}>
                <ListItemIcon><EditIcon /></ListItemIcon>
                <ListItemText primary='Wordle Create'></ListItemText>
            </ListItem>
            <Divider />
        </List>
        <Box sx={{position: 'absolute', bottom: '8px', display: 'flex', alignItems: "center", justifyContent: "center", width: '100%'}}>
            <SimpleFooter wrap={true} />
        </Box>
        </Drawer>
    )
};

export default DrawerPrimary;