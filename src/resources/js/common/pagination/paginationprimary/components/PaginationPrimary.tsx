import React, { useState, useEffect } from 'react';
import { Button, IconButton, Grid, Container, CircularProgress } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CircleIcon from '@mui/icons-material/Circle';
import { PaginationPrimaryProps } from '@/common/pagination/paginationprimary/types/PaginationPrimaryType';

function PaginationPrimary(props: PaginationPrimaryProps): React.ReactElement {
    const {handlePageChange} = props;

    return (
        <Container sx={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
            <IconButton value='prev' onClick={handlePageChange}>
                <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton>
                <CircleIcon />
            </IconButton>
            <IconButton value='next' onClick={handlePageChange}>
                <KeyboardArrowRightIcon />
            </IconButton>
        </Container>
    )
}

export default PaginationPrimary;