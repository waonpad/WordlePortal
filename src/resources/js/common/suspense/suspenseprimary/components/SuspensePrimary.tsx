import React, { useEffect, useState, useRef } from 'react';
import { Backdrop, CircularProgress, Box } from '@mui/material';
import { SuspensePrimaryProps } from '../types/SuspensePrimaryType';

// CAUTION: TODO: 囲んでいるやつの中身の読み込みはされるのでchildrenを囲む意味がない！！

function SuspensePrimary(props: SuspensePrimaryProps): React.ReactElement {
    const {open, backdrop, children} = props;

    if(backdrop) {
        return (
            <>
                {
                    open ? (
                        <Backdrop open={true}>
                            <CircularProgress/>
                        </Backdrop>
                    )
                    : children
                }
            </>
        )
    }
    else {
        return (
            <>
                {
                    open ? (
                        <Box sx={{mt: 5, mb: 5, display: 'flex', alignItems: "center", justifyContent: "center"}}>
                            <CircularProgress/>
                        </Box>
                    )
                    : children
                }
            </>
        )
    }
}

export default SuspensePrimary;