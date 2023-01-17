import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams, useLocation } from "react-router-dom";
import axios from 'axios';
import { Box, Button, Container, Grid, Paper, Typography } from '@mui/material';
import { useCustomPath } from '../../../../contexts/CustomPathContext';

export type ParticalRenderLinkProps = {
    path: string;
    children: React.ReactElement;
    partical_render_path: string[];
}

function ParticalRenderLink(props: ParticalRenderLinkProps): React.ReactElement {
    const {path, children, partical_render_path} = props;

    const location = useLocation();
    const custom_path = useCustomPath();

    const handleRenderCheck = (event: any) => {
        console.log(path);
        if(partical_render_path.includes(location.pathname)) {
            console.log('partical');

            event.preventDefault();
            history.pushState(null, '', path);
            custom_path?.changePath(path);
        }
        else {
            console.log('full');
            return null;
        }
    }

    return (
        // <Box>
            <Link to={path} onClick={handleRenderCheck}>
                {/* <Box onClick={handleRenderCheck}> */}
                    {children}
                {/* </Box> */}
            </Link>
        // </Box>
    )
}

export default ParticalRenderLink;