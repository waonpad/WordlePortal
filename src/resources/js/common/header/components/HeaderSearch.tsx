import React, { useEffect, useState, ReactNode } from 'react';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { Button, Card, Box } from '@material-ui/core';
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, SubmitHandler } from "react-hook-form";

type SearchData = {
    search: string;
}

function HeaderSearch(props: any): React.ReactElement {
    
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
        axios.post('/api/post/search', data).then(res => {
            console.log(res);
            if(res.data.status === true) {
                if(res.data.category) {
                    const category_id = res.data.category.id;
                    history.push(`/category/${category_id}`);
                }
                else {
                    console.log('カテゴリーが存在しない');
                }
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    return (
        <Box className={props.classes.search} component="form" onSubmit={handleSubmit(onSubmit)}>
          <div className={props.classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: props.classes.inputRoot,
              input: props.classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            {...register('search')}
          />
        </Box>
    )
}

export default HeaderSearch;