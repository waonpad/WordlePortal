import React, { useEffect, useState, ReactNode } from 'react';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { Button, Card, Box } from '@material-ui/core';
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, SubmitHandler } from "react-hook-form";

export type HeaderSearchProps = {
    classes: any;
}

type SearchData = {
    search: string;
}

function HeaderSearch(props: HeaderSearchProps): React.ReactElement {
    const {classes} = props;
    
    const history = useHistory();

    const basicSchema = Yup.object().shape({
        search: Yup.string()
    });

    const { register, handleSubmit, setError, clearErrors, formState: { errors }, reset } = useForm<SearchData>({
        mode: 'onBlur',
        defaultValues: {
        },
        resolver: yupResolver(basicSchema)
    });

    const onSubmit: SubmitHandler<SearchData> = (data: SearchData) => {
        if(data.search === '') {
            history.push(`/wordle/index`);
        }
        else {
            history.push(`/wordle/search/${data.search}`);
        }
    }

    return (
        <Box className={classes.search} component="form" onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            {...register('search')}
          />
        </Box>
    )
}

export default HeaderSearch;