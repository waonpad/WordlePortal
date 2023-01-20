import React, { useEffect, useState, useRef } from 'react';
import { Backdrop, CircularProgress, Box } from '@mui/material';
import { SuspensePrimaryProps } from '../types/SuspensePrimaryType';
import { Typography } from '@material-ui/core';

// CAUTION: TODO: 囲んでいるやつの中身の読み込みはされるのでchildrenを囲む意味がない！！

function SuspensePrimary(props: SuspensePrimaryProps): React.ReactElement {
    const {open, backdrop} = props;

    if(open) {
        return (
            <React.Fragment>
                {
                    backdrop ?
                    <Backdrop open={true}>
                        <CircularProgress/>
                    </Backdrop>
                    :
                    <Box sx={{mt: 5, mb: 5, display: 'flex', alignItems: "center", justifyContent: "center"}}>
                        <CircularProgress/>
                    </Box>
                }
            </React.Fragment>
        )
    }
    else {
        return (
            <Typography>コンポーネントを表示</Typography>
        )
    }
}

export default SuspensePrimary;