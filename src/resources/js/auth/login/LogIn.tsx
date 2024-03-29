import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
import { Snackbar, IconButton, Button, TextField, Grid, Box, Typography, Container } from '@mui/material';
import CloseIcon from '@material-ui/icons/Close';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { green } from '@mui/material/colors';
import { useAuth } from '@/contexts/AuthContext';
import { LogInData, LogInErrorData } from '@/auth/types/AuthType';

export default function LogIn(): React.ReactElement {
    const basicSchema = Yup.object().shape({
        email: Yup.string()
        .email('emailの型ではありません')
        .required('必須入力'),
        password: Yup.string()
        .min(8, '8文字以上')
        .required('必須入力')
    });
    
    const history = useHistory();
    const auth = useAuth();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setError, formState: { errors } } = useForm<LogInData>({
        mode: 'onBlur',
        defaultValues: {
        },
        resolver: yupResolver(basicSchema)
    });

    // 認証が終わってUserにデータが入ったら移動する
    useEffect(() => {
        if (auth!.user !== null) {
            history.push('/')
        }
    }, [auth!.user])
    
    const onSubmit: SubmitHandler<LogInData> = (data: LogInData) => {
        setLoading(true)
        axios.get('/sanctum/csrf-cookie').then(() => {
            auth?.signin(data).then((res: any) => {
                if (res.data.status === true) {
                    setLoading(false)
                }
                else if (res.data.status === false) {
                    // ログイン失敗時処理
                    setLoading(false)
                }
                else {
                    const obj: LogInErrorData = res.data.validation_errors;
                    (Object.keys(obj) as (keyof LogInErrorData)[]).forEach((key) => setError(key, {
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
                Log in
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    autoFocus
                    {...register('email')}
                    error={errors.email ? true : false}
                    helperText={errors.email?.message}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    {...register('password')}
                    error={errors.password ? true : false}
                    helperText={errors.password?.message}
                />
                {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                /> */}
                <LoadingButton
                    type="submit"
                    loading={loading}
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                Log in
                </LoadingButton>
                <Grid container>
                {/* <Grid item xs>
                    <Link href="#" variant="body2">
                    Forgot password?
                    </Link>
                </Grid> */}
                <Grid item>
                    <Link to="/register">
                        <Typography color='primary' sx={{':hover': {color: green[700]}}}>
                            {"Don't have an account? Sign Up"}
                        </Typography>
                    </Link>
                </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
