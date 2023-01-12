import React, { useEffect, useState, useRef } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { SuspensePrimaryProps } from '../types/SuspensePrimaryType';

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
                        <CircularProgress/>
                    )
                    : children
                }
            </>
        )
    }
}

export default SuspensePrimary;