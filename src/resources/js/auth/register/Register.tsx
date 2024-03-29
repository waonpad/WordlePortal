import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
import { Radio, RadioGroup, TextField, FormLabel, FormControl, FormControlLabel, FormHelperText, Grid, Box, Typography, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { green } from '@mui/material/colors';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterData, RegisterErrorData } from '@/auth/types/AuthType';
import CropImage from '@/common/cropimage/components/CropImage';

export default function Register(): React.ReactElement {
    const basicSchema = Yup.object().shape({
        screen_name: Yup.string()
        .required('必須入力'),
        name: Yup.string()
        .required('必須入力'),
        email: Yup.string()
        .email('emailの型ではありません')
        .required('必須入力'),
        password: Yup.string()
        .min(8, '8文字以上')
        .required('必須入力'),
        password_confirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'passwordが一致しません。')
        .required('必須入力'),
        description: Yup.string().max(191),
        age: Yup.number().min(0).max(130).required(),
        // gender: Yup.string().oneOf(['male', 'female']).required()
    });

    const history = useHistory();
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [gender, setGender] = useState<'male' | 'female'>('male');

    const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterData>({
        mode: 'onBlur',
        defaultValues: {
        },
        resolver: yupResolver(basicSchema)
    });

    // 認証が終わってUserにデータが入ったら移動する
    useEffect(() => {
        if (auth?.user !== null) {
            history.push('/')
        }
    }, [auth?.user])

    const handleChangeGender = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGender(event.target.value as 'male' | 'female');
    };

    const onSubmit: SubmitHandler<RegisterData> = (data: RegisterData) => {
        setLoading(true)

        const target = document.querySelector('[data-key="user_icon"]');
        const croppedimgsrc = target!.getAttribute('data-cropped-img-src');
        data.icon = croppedimgsrc;
        data.gender = gender;

        axios.get('/sanctum/csrf-cookie').then(() => {
            auth?.register(data).then((res: any) => {
                if (res.data.status === true) {
                    setLoading(false)
                }
                else if (res.data.status === false) {
                    // 登録失敗時処理
                    setLoading(false)
                }
                else {
                    const obj: RegisterErrorData = res.data.validation_errors;
                    (Object.keys(obj) as (keyof RegisterErrorData)[]).forEach((key) => setError(key, {
                    type: 'manual',
                    message: obj[key]
                    }))

                    setLoading(false)
                }
            })
        })
    }

    return (
        <Container maxWidth={'xs'} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography component="h1" variant="h5" color='primary' fontWeight='bold'>
                Register
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CropImage
                            crop_width={100}
                            aspect_ratio={1}
                            display_radius={'50%'}
                            component_key={'user_icon'}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="id"
                            label="ID"
                            autoComplete="screen-name"
                            {...register('screen_name')}
                            error={errors.screen_name ? true : false}
                            helperText={errors.screen_name?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            autoComplete="name"
                            {...register('name')}
                            error={errors.name ? true : false}
                            helperText={errors.name?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            autoComplete="email"
                            {...register('email')}
                            error={errors.email ? true : false}
                            helperText={errors.email?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            {...register('password')}
                            error={errors.password ? true : false}
                            helperText={errors.password?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Password Confirmation"
                            type="password"
                            id="password_confirmation"
                            autoComplete="password-confirmation"
                            {...register('password_confirmation')}
                            error={errors.password_confirmation ? true : false}
                            helperText={errors.password_confirmation?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            // required
                            fullWidth
                            id="description"
                            label="Description"
                            autoComplete="description"
                            multiline
                            rows={4}
                            {...register('description')}
                            error={errors.description ? true : false}
                            helperText={errors.description?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="age"
                            label="Age"
                            autoComplete="age"
                            {...register('age')}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            error={errors.age ? true : false}
                            helperText={errors.age?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl error={errors.gender ? true : false}>
                            <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                id="gender"
                                value={gender}
                                {...register('gender')}
                                onChange={handleChangeGender}
                            >
                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                            </RadioGroup>
                            <FormHelperText>{errors.gender?.message}</FormHelperText>
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
                    Register
                </LoadingButton>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link to="/login">
                            <Typography color='primary' sx={{':hover': {color: green[700]}}}>
                                Already have an account? Log in
                            </Typography>
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}