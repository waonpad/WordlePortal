import React from 'react';
import { Link } from "react-router-dom";
import { Box, Grid, Button, } from '@mui/material';
import { globalTheme } from '../../../../Theme';
import { ButtonGroupPrimaryProps } from '../types/ButtonGroupPrimaryType';

function ButtonTypeSwitcher(props: {link?: string, children: React.ReactElement}): React.ReactElement {
    const {link, children} = props;

    if(link) {
        return (<Link to={link}>{children}</Link>);
    }
    else {
        return children;
    }
}

function ButtonGroupPrimary(props: ButtonGroupPrimaryProps): React.ReactElement {
    const {items} = props;

    return (
        <Box minWidth={'100%'}>
            <Grid container spacing={0}>
                {items.map((item, index) => (
                    <Grid item key={index} xs={12 / items.length}>
                        <ButtonTypeSwitcher link={item.link}>
                            <Button
                                fullWidth
                                variant='outlined'
                                value={item.value}
                                onClick={item.onClick}
                                style={items.length === 1 ? {borderRadius: '4px 4px 4px 4px'} : index === 0 ? {borderRadius: '4px 0px 0px 4px'} : index === items.length - 1 ? {borderRadius: '0px 4px 4px 0px'} : {borderRadius: '0px 0px 0px 0px'} }
                                sx={item.active ? {fontWeight: 'bold', color: '#fff', backgroundColor: globalTheme.palette.primary.main, ":hover": {backgroundColor: globalTheme.palette.primary.main}} : {fontWeight: 'bold', backgroundColor: '#fff'}}
                            >
                                {item.text}
                            </Button>
                        </ButtonTypeSwitcher>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default ButtonGroupPrimary;