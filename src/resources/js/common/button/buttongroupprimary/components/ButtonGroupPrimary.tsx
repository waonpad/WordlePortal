import React from 'react';
import { Link } from "react-router-dom";
import { Box, Grid, Button, Divider } from '@mui/material';
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
    const {head, items} = props;

    return (
        <Box minWidth={'100%'} sx={{backgroundColor: '#fff'}}>
            <Grid container spacing={0}>
                {items.map((item, index) => (
                    <Grid item key={index} xs={12 / items.length}>
                        <ButtonTypeSwitcher link={item.link}>
                            <Button
                                fullWidth
                                variant={'outlined'}
                                value={item.value}
                                onClick={item.onClick}
                                style={
                                    head ?
                                    items.length === 1 ? {pointerEvents: 'none', borderLeft: 'none', borderTop: 'none', borderRight: 'none', borderBottom: 'none'}
                                    : index === 0 ? {borderLeft: 'none', borderTop: 'none', borderBottom: 'none'}
                                    : index === items.length - 1 ? {borderRight: 'none', borderTop: 'none', borderBottom: 'none'}
                                    : {borderTop: 'none', borderBottom: 'none'}
                                    :
                                    items.length === 1 ? {pointerEvents: 'none', borderRadius: '4px 4px 4px 4px'}
                                    : index === 0 ? {borderRadius: '4px 0px 0px 4px'}
                                    : index === items.length - 1 ? {borderRadius: '0px 4px 4px 0px'}
                                    : {borderRadius: '0px 0px 0px 0px'}
                                }
                                sx={
                                    head ?
                                    item.active ? {fontWeight: 'bold', color: '#fff', backgroundColor: globalTheme.palette.primary.main, ":hover": {backgroundColor: globalTheme.palette.primary.main}, borderRadius: '0px'}
                                    : {fontWeight: 'bold', backgroundColor: '#fff', borderRadius: '0px'}
                                    :
                                    item.active ? {fontWeight: 'bold', color: '#fff', backgroundColor: globalTheme.palette.primary.main, ":hover": {backgroundColor: globalTheme.palette.primary.main}}
                                    : {fontWeight: 'bold', backgroundColor: '#fff'}
                                }
                            >
                                {item.text}
                            </Button>
                        </ButtonTypeSwitcher>
                    </Grid>
                ))}
            </Grid>
            {head ? <Divider sx={{opacity: 1, borderColor: globalTheme.palette.primary.main}} /> : <></>}
        </Box>
    )
}

export default ButtonGroupPrimary;