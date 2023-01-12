import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import swal from "sweetalert";
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form";
import { Grid, TextField, FormHelperText, Box, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { VSPlayOptionProps, VSPlayOptionData, VSPlayOptionErrorData } from '../types/VSPlayOptionType';
import firebaseApp from '../../contexts/FirebaseConfig';
import { serverTimestamp } from 'firebase/database';
import { useErrorHandler } from 'react-error-boundary';
import { useAuth } from '../../contexts/AuthContext';

function VSPlayOption(props: VSPlayOptionProps): React.ReactElement {
    const {game, wordle, handleModalClose} = props;

    const handleError = useErrorHandler();
    const auth = useAuth();

    const basicSchema = Yup.object().shape({
        max_participants: Yup.number().min(game ? game.max_participants : 0).required(),
        laps: Yup.number().required(),
        // visibility: Yup.boolean().oneOf([true, false]).required(),
        answer_time_limit: Yup.number().required(),
        // coloring: Yup.boolean().oneOf([true, false]).required(),
    });

    const { register, handleSubmit, setError, clearErrors, formState: { errors }, reset } = useForm<VSPlayOptionData>({
        mode: 'onBlur',
        defaultValues: {
        },
        resolver: yupResolver(basicSchema)
    });
    
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    // Visibility ///////////////////////////////////////////////////////////////////////
    const [visibility, setVisibility] = useState<'true' | 'false'>(game ? game.visibility === 1 ? 'true' : 'false' : 'true');

    const handleChangeVisibility = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target);
        console.log(event.target.value);
        setVisibility((event.target.value as any));
    };
    //////////////////////////////////////////////////////////////////////////

    // Coloring ///////////////////////////////////////////////////////////////////////
    const [coloring, setColoring] = useState<'true' | 'false'>(game ? game.coloring === 1 ? 'true' : 'false' : 'true');

    const handleChangeColoring = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target);
        console.log(event.target.value);
        setColoring((event.target.value as any));
    };
    /////////////////////////////////////////////////////////////////////////
    
    // Submit //////////////////////////////////////////////////////////
    const onSubmit: SubmitHandler<VSPlayOptionData> = (data: VSPlayOptionData) => {
        if(auth!.user === null) {
            history.push('/login');
            return;
        }
        
        setLoading(true);
        data.game_id = game ? game.id : null;
        data.wordle_id = game ? game.wordle_id : wordle.id;
        data.visibility = visibility === 'true' ? true : false;
        data.coloring = coloring === 'true' ? true : false;
        console.log(data);
        
        axios.post('/api/wordle/game/upsert', data).then(res => {
            console.log(res);
            if(res.data.status === true) {
                const game = res.data.game;

                if(data.game_id === null) {
                    firebaseApp.database().ref(`wordle/games/${game.uuid}`).set({
                        created_at: serverTimestamp(),
                        host: game.game_create_user_id,
                        status: 'wait',
                        joined: false,
                    });
                }

                setLoading(false);
                history.push(`/wordle/game/play/${game.uuid}`);
            }
            else if(res.data.status === false) {
                // 失敗時の処理
                setLoading(false)
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
                        defaultValue={game ? game.max_participants : null}
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
                        defaultValue={game ? game.laps : null}
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
                            <FormControlLabel value={'true'} control={<Radio />} label="Visible" />
                            <FormControlLabel value={'false'} control={<Radio />} label="Invisible" />
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
                        defaultValue={game ? game.answer_time_limit : null}
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
                            <FormControlLabel value={'true'} control={<Radio />} label="Colored" />
                            <FormControlLabel value={'false'} control={<Radio />} label="Plain" />
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
                {game ? 'Update' : 'Create'} Game
            </LoadingButton>
        </Box>
    )
}

export default VSPlayOption;