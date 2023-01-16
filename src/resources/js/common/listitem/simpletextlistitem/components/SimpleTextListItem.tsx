import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Box, Grid, Typography, Avatar, Button, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction } from '@mui/material';

type SimpleTextListItemProps = {
    text: string;
}

function SimpleTextListItem(props: SimpleTextListItemProps): React.ReactElement {
    const {text} = props;

    return (
        <ListItem sx={{padding: 0}}>
            <Box sx={{minHeight: '150px', minWidth: '100%', display: 'flex', alignItems: "center", justifyContent: "center"}}>
                <Typography color={'primary'} sx={{fontWeight: 'bold'}}>{text}</Typography>
            </Box>
        </ListItem>
    )
}

export default SimpleTextListItem;