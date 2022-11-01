import React, { useState, useEffect } from 'react';
import swal from "sweetalert";
import ReactDOM from 'react-dom';
import { Button, Card } from '@material-ui/core';
import { Link, useParams, useHistory, useLocation } from "react-router-dom";
import axios from 'axios';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ReactLoading from 'react-loading';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Hidden from '@mui/material/Hidden';
import {useAuth} from "../contexts/AuthContext";
import { MuiChipsInput, MuiChipsInputChip } from 'mui-chips-input';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

// idはhiddenで送る？
interface WordleData {
    id: number | null;
    name: string;
    words: string[];
    input: string[];
    description: string;
    tags: string[];
    submit: string;
}

interface WordleErrorData {
    id: string;
    name: string;
    words: string;
    input: string;
    description: string;
    tags: string;
    submit: string;
}

interface WordleDefaultData {
    id: number | null;
    name: string;
    words: string[];
    input: string[];
    description: string;
    tags: string[];
}

const theme = createTheme();

function WordleManage(): React.ReactElement {

    const basicSchema = Yup.object().shape({
        name: Yup.string().max(50).required(),
        words: Yup.array().min(10).of(Yup.string().min(5).max(10)), // 要調整
        input: Yup.array().min(1).of(Yup.string()),
        description: Yup.string().max(255),
        // tagsはMuiChipsInputでバリデーションしている
    });

    const auth = useAuth();
    const location = useLocation();
    const history = useHistory();
    const {wordle_id} = useParams<{wordle_id: string}>();

    const [wordle_default_data, setWordleDefaultData] = useState<WordleDefaultData>()

    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<WordleData>({
        mode: 'onBlur',
        defaultValues: {
            id: wordle_default_data?.id,
        },
        resolver: yupResolver(basicSchema)
    });
    const [initial_load, setInitialLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    
    // Tags /////////////////////////////////////////////////////////////
    const [tags, setTags] = useState<MuiChipsInputChip[]>([]);

    // 更新画面の初期表示時にタグを入れる処理を追加しないといけない
    const handleSelecetedTags = (selectedItem: MuiChipsInputChip[]) => {
        setTags(selectedItem);
    }
    //////////////////////////////////////////////////////////////////////

    // Words ///////////////////////////////////////////////////////
    const words = wordle_id ? (
        // Update
        <React.Fragment>
            {wordle_default_data?.words.map((word, index) => 
                <Grid item xs={12} key={index}>
                    <TextField
                        fullWidth
                        autoComplete="words"
                        value={word}
                        label="word"
                        {...register('words')}
                        // error={errors.words ? true : false}
                        // helperText={errors.words?.message}
                    />
                </Grid>
            )}
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    autoComplete="words"
                    label="word"
                    {...register('words')}
                    // error={errors.words ? true : false}
                    // helperText={errors.words?.message}
                />
            </Grid>
        </React.Fragment>
    ) : (
        // Create
        <React.Fragment>
            {[...Array(10).keys()].map((index) => 
                <Grid item xs={12} key={index}>
                    <TextField
                        fullWidth
                        autoComplete="words"
                        label="word"
                        {...register(`words.${index}`)}
                        error={errors.words ? errors.words[index]? true : false : false}
                        helperText={errors.words ? errors.words[index]?.message : ''}
                    />
                </Grid>
            )}
        </React.Fragment>
    );
    ///////////////////////////////////////////////////////////////////////

    // Checkbox //////////////////////////////////////////////////////////////////
    const [input, setInput] = React.useState({
        japanese: false,
        english: false,
        number: false,
        typing: false
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
        ...input,
        [event.target.id]: event.target.checked,
    });
    console.log(errors);
    };

    const { japanese, english, number, typing } = input;
    // const error = [japanese, english, number, typing].filter((v) => v).length !== 2;
    //////////////////////////////////////////////////////////////////////////////

    // Submit ////////////////////////////////////////////////////////////////////
    const onSubmit: SubmitHandler<WordleData> = (data: WordleData) => {
        console.log(tags);
        data.tags = tags;
        console.log(data);
        setLoading(true);

        axios.post('/api/wordle/upsert', data).then(res => {
            console.log(res);
            if (res.data.status === true) {
                swal("Success", "登録成功", "success");
                // setTimeout((() => {history.push('/')}), 4000);
                setLoading(false)
            }
            else {
                const obj: WordleErrorData = res.data.validation_errors;
                (Object.keys(obj) as (keyof WordleErrorData)[]).forEach((key) => setError(key, {
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
            // setOpen(true);
            
            setLoading(false)
        })
    }
    /////////////////////////////////////////////////////////////////////////////////////

	useEffect(() => {
        // 作成済、管理用
        if (wordle_id) {
            console.log(wordle_id);
            axios.get('/api/wordle/show',  {params: {wordle_id: wordle_id}}).then(res => {
                console.log(res);
                if (res.data.status === true) {
                    setWordleDefaultData(res.data);
    
                    setInitialLoad(false)
                }
                else {
                    setInitialLoad(false)
                }
            })
            .catch((error) => {
                console.log(error)
                
                setError('submit', {
                    type: 'manual',
                    message: '予期せぬエラーが発生しました'
                })
                // setOpen(true);
                
                setInitialLoad(false)
            })
        }
        // 作成用
        else {
            console.log('Create');
            setInitialLoad(false);
        }
    }, [])
    
	if (initial_load) {
		return (
			<Backdrop open={true}>
			  <CircularProgress color="inherit" />
			</Backdrop>
		)
	}
	else {
        return (
            <ThemeProvider theme={theme}>
              <Container component="main" maxWidth={false}>
                <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                        >
                        <Typography component="h1" variant="h5">
                            Wordle {wordle_id ? 'Manage' : 'Create'}
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="wordle_name"
                                        label="Wordle Name"
                                        autoComplete="wordle-name"
                                        value={wordle_default_data?.name}
                                        {...register('name')}
                                        error={errors.name ? true : false}
                                        helperText={errors.name?.message}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <MuiChipsInput
                                        value={(tags as string[])}
                                        onChange={handleSelecetedTags}
                                        fullWidth
                                        variant='outlined'
                                        id='tags'
                                        // name='tags'
                                        label='Tags'
                                        placeholder=''
                                        aria-multiline
                                        maxRows={10}
                                        validate={(chipValue) => {
                                            return {
                                                isError: chipValue.length > 50,
                                                textError: 'the value must be at least 50 characters long'
                                            }
                                        }}
                                    />
                                    <FormHelperText sx={{mt: 1, ml: 2}}>Double click to edit a tag</FormHelperText>
                                </Grid>
                                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                    <FormLabel component="legend">Using Language Set</FormLabel>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                            <Checkbox value='japanese' checked={japanese} {...register('input')} onChange={handleInputChange} id="japanese"/>
                                            }
                                            label="Japanese"
                                        />
                                        <FormControlLabel
                                            control={
                                            <Checkbox value='english' checked={english} {...register('input')} onChange={handleInputChange} id="english"/>
                                            }
                                            label="English"
                                        />
                                        <FormControlLabel
                                            control={
                                            <Checkbox value='number' checked={number} {...register('input')} onChange={handleInputChange} id="number"/>
                                            }
                                            label="Number"
                                        />
                                        <FormControlLabel
                                            control={
                                            <Checkbox value='typing' checked={typing} {...register('input')} onChange={handleInputChange} id="typing"/>
                                            }
                                            label="Typing"
                                        />
                                    </FormGroup>
                                    <FormHelperText sx={{color: '#f6685e'}}>{errors.input?.message}</FormHelperText>
                                </FormControl>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="description"
                                        label="Description"
                                        autoComplete="description"
                                        value={wordle_default_data?.description}
                                        {...register('description')}
                                        error={errors.description ? true : false}
                                        helperText={errors.description?.message}
                                    />
                                </Grid>
                                <Grid container spacing={2} item xs={12}>
                                    {words}
                                    {/* <FormHelperText sx={{color: '#f6685e'}}>{errors.words?.message}</FormHelperText> */}
                                </Grid>
                            </Grid>
                            <LoadingButton
                                type="submit"
                                loading={loading}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                            Wordle {wordle_id ? 'Update' : 'Create'}
                            </LoadingButton>
                        </Box>
                    </Box>
                </Container>
        
              {/* <Snackbar
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
                    <Button color="secondary" size="small" onClick={handleClose}>
                      OK
                    </Button>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </React.Fragment>
                }
              /> */}
              {/* Alert？ */}
            </ThemeProvider>
        );
	}
}

export default WordleManage;