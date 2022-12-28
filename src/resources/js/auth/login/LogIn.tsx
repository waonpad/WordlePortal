import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
import { Snackbar, IconButton, Button, TextField, Grid, Box, Typography, Container } from '@mui/material';
import CloseIcon from '@material-ui/icons/Close';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { LogInData, LogInErrorData } from '../types/AuthType';

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

export default function LogIn(): React.ReactElement {

    const basicSchema = Yup.object().shape({
        email: Yup.string()
        .email('emailの型ではありません')
        .required('必須入力'),
        password: Yup.string()
        .min(8, '8文字以上')
        .required('必須入力')
    });

    const { register, handleSubmit, setError, formState: { errors } } = useForm<LogInData>({
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
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

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
            console.log(res);
            if (res.data.status === true) {
                // swal("Success", "登録成功", "success");
                // setTimeout((() => {history.push('/')}), 4000);
                // setLoading(false)
            }
            else {
                const obj: LogInData = res.data.validation_errors;
                
                (Object.keys(obj) as (keyof LogInErrorData)[]).forEach((key) => setError(key, {
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
        <React.Fragment>
            <Container maxWidth={'xs'} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar> */}
                <Typography component="h1" variant="h5">
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
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                    </Grid>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>

            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={errors.submit?.message ? errors.submit?.message : ''}
                action={
                <React.Fragment>
                    <Button size="small" onClick={handleClose}>
                        OK
                    </Button>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
                }
            />
        </React.Fragment>
    );
}
