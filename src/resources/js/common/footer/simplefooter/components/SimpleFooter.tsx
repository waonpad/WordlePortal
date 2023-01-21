import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

function SimpleFooter(props: any): React.ReactElement {
    return (
        <Box sx={{marginTop: 4, display: 'flex', alignItems: "center", justifyContent: "center"}}>
            <Typography color='primary'>Copryright &copy; 2023 WordlePortal.</Typography>
        </Box>
    )
}

export default SimpleFooter;