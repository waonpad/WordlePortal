import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import swal from "sweetalert";
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form";
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import FormHelperText from '@mui/material/FormHelperText';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import { VSPlayOptionProps, VSPlayOptionData, VSPlayOptionErrorData } from '../types/VSPlayOptionType';
import firebaseApp from '../../contexts/FirebaseConfig';
import { getDatabase, push, ref, set, update, onValue, onDisconnect, child, orderByChild, equalTo, startAt, endAt } from '@firebase/database'
import { serverTimestamp } from 'firebase/database';

function VSPlayOption(props: VSPlayOptionProps): React.ReactElement {
    const basicSchema = Yup.object().shape({
        max_participants: Yup.number().required(),
        laps: Yup.number().required(),
        visibility: Yup.boolean().oneOf([true, false]).required(),
        answer_time_limit: Yup.number().required(),
        coloring: Yup.boolean().oneOf([true, false]).required(),
    });

    const { register, handleSubmit, setError, clearErrors, formState: { errors }, reset } = useForm<VSPlayOptionData>({
        mode: 'onBlur',
        defaultValues: {
        },
        resolver: yupResolver(basicSchema)
    });
    
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(errors);
    }, [errors]);

    // Visibility ///////////////////////////////////////////////////////////////////////
    const [visibility, setVisibility] = React.useState(true);

    const handleChangeVisibility = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target);
        console.log(event.target.value);
        setVisibility((event.target.value as any));
    };
    //////////////////////////////////////////////////////////////////////////

    // Coloring ///////////////////////////////////////////////////////////////////////
    const [coloring, setColoring] = React.useState(true);

    const handleChangeColoring = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target);
        console.log(event.target.value);
        setColoring((event.target.value as any));
    };
    /////////////////////////////////////////////////////////////////////////
    
    // Submit //////////////////////////////////////////////////////////
    const onSubmit: SubmitHandler<VSPlayOptionData> = (data: VSPlayOptionData) => {
        setLoading(true);
        data.wordle_id = props.wordle.id;
        console.log(data);
        
        axios.post('/api/wordle/game/create', data).then(res => {
            console.log(res);
            if(res.data.status === true) {
                swal("送信成功", "送信成功", "success");
                setLoading(false);
                // if(props?.game) {
                //     props?.handleModalClose(false);
                // }
                
                const game = res.data.game;

                firebaseApp.database().ref(`wordle/games/${game.uuid}`).set({
                    created_at: serverTimestamp(),
                    host: game.game_create_user_id,
                    status: 'create'
                });

                history.push(`/wordle/game/${game.wordle_id}/${game.uuid}`);
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
                <Grid item xs={12}>
                    <FormControl error={errors.visibility ? true : false}>
                        <FormLabel id="demo-controlled-radio-buttons-group">Visibility</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            id="visibility"
                            value={visibility}
                            {...register('visibility')}
                            onChange={handleChangeVisibility}
                        >
                            <FormControlLabel value={true} control={<Radio />} label="Visible" />
                            <FormControlLabel value={false} control={<Radio />} label="Invisible" />
                        </RadioGroup>
                        <FormHelperText>{errors.visibility?.message}</FormHelperText>
                    </FormControl>
                </Grid>
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
                <Grid item xs={12}>
                    <FormControl error={errors.visibility ? true : false}>
                        <FormLabel id="demo-controlled-radio-buttons-group">Coloring</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            id="coloring"
                            value={coloring}
                            {...register('coloring')}
                            onChange={handleChangeColoring}
                        >
                            <FormControlLabel value={true} control={<Radio />} label="Colored" />
                            <FormControlLabel value={false} control={<Radio />} label="Plain" />
                        </RadioGroup>
                        <FormHelperText>{errors.coloring?.message}</FormHelperText>
                    </FormControl>
                </Grid>
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