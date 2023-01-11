import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form";
import { Radio, RadioGroup, TextField, FormLabel, FormControl, FormControlLabel, FormHelperText, Grid, Box, Typography, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import SnackbarPrimary from '../../common/snackbar/snackbarprimary/components/SnackbarPrimary';
import CropImage from '../../common/cropimage/components/CropImage';
import { EditProfileData, EditProfileErrorData } from '../../auth/types/AuthType';
import { useAuth } from '../../contexts/AuthContext';

type EditProfileProps = {
    user: any;
    handleModalClose: React.Dispatch<React.SetStateAction<boolean>>
}

export default function EditProfile(props: EditProfileProps): React.ReactElement {
    const {user, handleModalClose} = props;

    const auth = useAuth();

    const basicSchema = Yup.object().shape({
        name: Yup.string()
        .required('必須入力'),
        description: Yup.string().max(191),
        age: Yup.number().min(0).max(130).required(),
        // gender: Yup.string().oneOf(['male', 'female']).required()
    });

    const { register, handleSubmit, setError, formState: { errors } } = useForm<EditProfileData>({
        mode: 'onBlur',
        defaultValues: {
        },
        resolver: yupResolver(basicSchema)
    });

    const [loading, setLoading] = useState(false);
    const [snackbar_open, setSnackbarOpen] = useState(false);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    const [gender, setGender] = useState<'male' | 'female'>(user.gender);

    const handleChangeGender = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGender(event.target.value as any);
    };

    const onSubmit: SubmitHandler<EditProfileData> = (data: EditProfileData) => {
        setLoading(true)

        const target = document.querySelector('[data-key="user_icon"]');
        const croppedimgsrc = target!.getAttribute('data-cropped-img-src');
        data.icon = croppedimgsrc;
        data.gender = gender;

        console.log(data);

        auth?.update_profile(data).then((res: any) => {
            console.log(res);
            if (res.data.status === true) {
                setLoading(false);
                handleModalClose(false);

                // TODO: 画面に表示されているプロフィールをどう更新するか
                // auth.userをそれぞれのコンポーネントで監視する？
            }
            else {
                const obj: EditProfileErrorData = res.data.validation_errors;

                (Object.keys(obj) as (keyof EditProfileErrorData)[]).forEach((key) => setError(key, {
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
            setSnackbarOpen(true);
            
            setLoading(false)
        })
    }

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, minWidth: '100%' }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CropImage
                        default_img_src={user.icon}
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
                        id="name"
                        label="Name"
                        autoComplete="name"
                        defaultValue={user.name}
                        {...register('name')}
                        error={errors.name ? true : false}
                        helperText={errors.name?.message}
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
                        defaultValue={user.description}
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
                        defaultValue={user.age}
                        {...register('age')}
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        error={errors.age ? true : false}
                        helperText={errors.age?.message}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl error={errors.gender ? true : false}>
                        <FormLabel>Gender</FormLabel>
                        <RadioGroup
                            row
                            id="gender"
                            value={gender}
                            {...register('gender')}
                            onChange={handleChangeGender}
                        >
                            <FormControlLabel value={"male"} control={<Radio />} label="Male" />
                            <FormControlLabel value={"female"} control={<Radio />} label="Female" />
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
                Update Profile
            </LoadingButton>
            <SnackbarPrimary
                open={snackbar_open}
                handleClose={handleClose}
                message={errors.submit?.message ? errors.submit?.message : ''}
            />
            {/* Alert？ */}
        </Box>
    );
}