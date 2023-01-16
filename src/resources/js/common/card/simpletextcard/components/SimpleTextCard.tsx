import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

type SimpleTextCardProps = {
    text: string;
}

function SimpleTextCard(props: SimpleTextCardProps): React.ReactElement {
    const {text} = props;

    return (
        <Card elevation={1}>
            <CardContent sx={{minHeight: '150px', display: 'flex', alignItems: "center", justifyContent: "center"}}>
                <Typography color={'primary'} sx={{fontWeight: 'bold'}}>{text}</Typography>
            </CardContent>
        </Card>
    )
}

export default SimpleTextCard;