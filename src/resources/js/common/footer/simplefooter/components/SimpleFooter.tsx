import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

type SimpleFooterProps = {
    wrap?: boolean
}

function SimpleFooter(props: SimpleFooterProps): React.ReactElement {
    const {wrap} = props;

    return (
        <Box sx={{marginTop: 4, display: 'flex', alignItems: "center", justifyContent: "center"}}>
            <Typography color='primary' sx={{whiteSpace: 'pre-line', textAlign: 'center'}}>Copryright &copy; 2023 {wrap && "\n"} WordlePortal.</Typography>
        </Box>
    )
}

export default SimpleFooter;