import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
import { Radio, RadioGroup, TextField, FormLabel, FormControl, FormControlLabel, FormHelperText, Grid, Box, Typography, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterData, RegisterErrorData } from '../types/AuthType';
import SnackbarPrimary from '../../common/snackbar/components/SnackbarPrimary';
import CropImage from '../../common/cropimage/components/CropImage';

function Copyright(props: any) {
return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" to="https://mui.com/">
            Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
    </Typography>
);
}

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

    const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterData>({
        mode: 'onBlur',
        defaultValues: {
        },
        resolver: yupResolver(basicSchema)
    });

    const history = useHistory();
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // SnackBarの操作
    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    // 認証が終わってUserにデータが入ったら移動する
    useEffect(() => {
        if (auth?.user !== null) {
            history.push('/')
        }
    }, [auth?.user])

    const [gender, setGender] = React.useState('');

    const handleChangeGender = (event: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(event.target);
        // console.log(event.target.value);
        setGender(event.target.value);
    };

    const onSubmit: SubmitHandler<RegisterData> = (data: RegisterData) => {
        setLoading(true)

        // アイコンは取り敢えずここで代入してしまう
        const target = document.querySelector('[data-key="user_icon"]');
        const croppedimgsrc = target!.getAttribute('data-cropped-img-src');
        data.icon = croppedimgsrc;

        // console.log(data);
        axios.get('/sanctum/csrf-cookie').then(() => {
            auth?.register(data).then((res: any) => {
            console.log(res);
            if (res.data.status === true) {
                // swal("Success", "登録成功", "success");
                // setTimeout((() => {history.push('/')}), 4000);
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
            .catch((error) => {
                console.log(error)
                
                setError('submit', {
                    type: 'manual',
                    message: '予期せぬエラーが発生しました'
                })
                setOpen(true);
                
                setLoading(false)
            })
        })
    }

    return (
        <Container maxWidth={'xs'} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar> */}
            <Typography component="h1" variant="h5">
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
                        Already have an account? Log in
                        </Link>
                    </Grid>
                </Grid>
            </Box>
            <Copyright sx={{ mt: 5 }} />
            <SnackbarPrimary
                open={open}
                handleClose={handleClose}
                message={errors.submit?.message ? errors.submit?.message : ''}
            />
            {/* Alert？ */}
        </Container>
    );
}