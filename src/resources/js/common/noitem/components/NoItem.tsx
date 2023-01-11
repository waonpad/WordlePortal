import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Grid, Container, CircularProgress } from '@mui/material';

function NoItem(props: any): React.ReactElement {
    return (
        <Card elevation={1}>
            <CardContent sx={{minHeight: '150px', display: 'flex', alignItems: "center", justifyContent: "center"}}>
                <Typography color={'primary'} sx={{fontWeight: 'bold'}}>No Item</Typography>
            </CardContent>
        </Card>
    )
}

export default NoItem;