import React, { useState, useEffect } from 'react';
import swal from "sweetalert";
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form";
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import { Editor } from '@tinymce/tinymce-react';
import { MuiChipsInput, MuiChipsInputChip } from 'mui-chips-input';
import FormHelperText from '@mui/material/FormHelperText';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { VSPlayOptionProps, VSPlayOptionData, VSPlayOptionErrorData } from '../@types/VSPlayOptionType';

function VSPlayOption(props: VSPlayOptionProps): React.ReactElement {
    const basicSchema = Yup.object().shape({
        max_participants: Yup.number().required(),
        laps: Yup.number().required(),
        Visibility: Yup.boolean().required(),
        answer_time_limit: Yup.number().required(),
        coloring: Yup.boolean().required(),
    });

    const { register, handleSubmit, setError, clearErrors, formState: { errors }, reset } = useForm<VSPlayOptionData>({
        mode: 'onBlur',
        defaultValues: {
        },
        resolver: yupResolver(basicSchema)
    });

    const [loading, setLoading] = useState(false);
    
    // Submit //////////////////////////////////////////////////////////
    const onSubmit: SubmitHandler<VSPlayOptionData> = (data: VSPlayOptionData) => {
        axios.post('/api/wordle/game/create', data).then(res => {
            console.log(res);
            if(res.data.status === true) {
                swal("送信成功", "送信成功", "success");
                setLoading(false);
                // if(props?.post) {
                //     props?.handleModalClose(false);
                // }
            }
            else {
                const obj: VSPlayOptionErrorData = res.data.validation_errors;
                (Object.keys(obj) as (keyof VSPlayOptionErrorData)[]).forEach((key) => setError(key, {
                    type: 'manual',
                    message: obj[key]
                }))
    
                setLoading(false)
            }
        })
        .catch(error => {
            console.log(error)
            setError('submit', {
            type: 'manual',
            message: '送信に失敗しました'
        })
            setLoading(false);
        })
    }
    /////////////////////////////////////////////////////////////////////////

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, minWidth: '100%' }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="max_participants"
                        label="Max Participants"
                        autoComplete="max-participants"
                        {...register('max_participants')}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        error={errors.max_participants ? true : false}
                        helperText={errors.max_participants?.message}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="laps"
                        label="Laps"
                        autoComplete="laps"
                        {...register('laps')}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        error={errors.laps ? true : false}
                        helperText={errors.laps?.message}
                    />
                </Grid>
                {/* visibility */}
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="answer_time_limit"
                        label="Answer Time Limit"
                        autoComplete="answer_time_limit"
                        {...register('answer_time_limit')}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        error={errors.answer_time_limit ? true : false}
                        helperText={errors.answer_time_limit?.message}
                    />
                </Grid>
                {/* coloring */}
            </Grid>
            <LoadingButton
                type="submit"
                loading={loading}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Create Game
            </LoadingButton>
        </Box>
    )
}

export default VSPlayOption;