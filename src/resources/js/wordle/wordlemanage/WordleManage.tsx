import React, { useState, useEffect } from 'react';
import swal from "sweetalert";
import { Button, Card } from '@material-ui/core';
import { Link, useParams, useHistory, useLocation } from "react-router-dom";
import axios from 'axios';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useAuth} from "../../contexts/AuthContext";
import { MuiChipsInput, MuiChipsInputChip } from 'mui-chips-input';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import { WordleData, WordleErrorData, WordleDefaultData } from '../types/WordleType';

// TODO textfieldの削除処理

const theme = createTheme();

function WordleManage(): React.ReactElement {
    const basicSchema = Yup.object().shape({
        name: Yup.string().max(50).required(),
        words: Yup.array()
                .of(Yup.string().min(5).max(10).nullable()
                .transform((value, originalValue) =>String(originalValue).trim() === '' ? null : value))
                .unique("must be unique", (val: any) => val || val === '')
                .test('', 'words field must have at least 10 items', (words: any) => words?.filter(function(word: any){
                    return !(word === null || word === undefined || word === "");
                }).length >= 10),
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
        resolver: yupResolver(basicSchema)
    });
    const [initial_load, setInitialLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    
    // Tags /////////////////////////////////////////////////////////////
    const [tags, setTags] = useState<MuiChipsInputChip[]>([]);

    const handleSelecetedTags = (selectedItem: MuiChipsInputChip[]) => {
        setTags(selectedItem);
    }
    //////////////////////////////////////////////////////////////////////

    // Words ///////////////////////////////////////////////////////
    const [words, setWords] = useState<string[]>([]);

    const handleAddWord = () => {
        setWords([...words, '']);
    }

    const handleChangeWord = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target_word_id = Number(event.currentTarget.id);
        const changed_word = event.currentTarget.value;
        setWords((words) => words.map((word, index) => (index === target_word_id ? changed_word : word)));
    }

    const handleDeleteWord = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const target_word_id = Number(event.currentTarget.id);
        setWords((words) => words.map((word, index) => (index === target_word_id ? '' : word)));
        setWords(words.filter((word, index) => (index !== target_word_id)));
    }
    ///////////////////////////////////////////////////////////////////////

    // Checkbox //////////////////////////////////////////////////////////////////
    const [input, setInput] = useState<{[key: string]: boolean}>({
        japanese: false,
        english: false,
        number: false,
        typing: false
    });
    const input_values = ['japanese', 'english', 'number', 'typing'];

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput({
            ...input,
            [event.target.id]: event.target.checked,
        });
    };

    const mergeDefaultInput = (default_input: string) => {
        setInput({
            ...input,
            [default_input]: true,
        });
    }

    useEffect(() => {
        console.log(input);
    }, [input]);

    // const { japanese, english, number, typing } = input;
    // const error = [japanese, english, number, typing].filter((v) => v).length !== 2;
    //////////////////////////////////////////////////////////////////////////////

    // Submit ////////////////////////////////////////////////////////////////////
    const onSubmit: SubmitHandler<WordleData> = (data: WordleData) => {
        data.id = Number(wordle_id) ?? null;
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
        console.log(wordle_id);
        // 作成済、管理用
        if (wordle_id !== undefined) {
            console.log(wordle_id);
            axios.get('/api/wordle/show',  {params: {wordle_id: wordle_id}}).then(res => {
                console.log(res);
                if (res.data.status === true) {
                    // 初期データ注入
                    const wordle: WordleDefaultData = res.data.wordle;
                    setWordleDefaultData(wordle);
                    setTags(wordle.tags.map(tag => tag.name));
                    wordle.input.forEach(target_input => {
                        mergeDefaultInput(target_input);
                    });
                    setWords([...wordle.words, '']);
                }
                setInitialLoad(false)
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
            setWords(['', '', '', '', '', '', '', '', '', ''])
            setInitialLoad(false);
        }
    }, [location])
    
	if (initial_load) {
		return (
			<Backdrop open={true}>
			  <CircularProgress color="inherit" />
			</Backdrop>
		)
	}
	else {
        return (
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
                                defaultValue={wordle_default_data?.name}
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
                                {input_values.map((input_value, index) => 
                                    <FormControlLabel
                                        key={index}
                                        control={
                                        <Checkbox value={input_value} checked={input[input_value]} {...register('input')} onChange={handleInputChange} id={input_value} />
                                        }
                                        label={input_value}
                                    />
                                )}
                            </FormGroup>
                            <FormHelperText sx={{color: '#d74343', mt: 1, ml: 2}}>{errors.input?.message}</FormHelperText>
                        </FormControl>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="description"
                                label="Description"
                                autoComplete="description"
                                defaultValue={wordle_default_data?.description}
                                {...register('description')}
                                error={errors.description ? true : false}
                                helperText={errors.description?.message}
                            />
                        </Grid>
                        <Grid container spacing={2} item xs={12}>
                            {words.map((word, index) => 
                                <Grid item xs={12} key={index}>
                                    <TextField
                                        fullWidth
                                        autoComplete="words"
                                        value={word}
                                        label="word"
                                        id={String(index)}
                                        InputProps={{
                                            endAdornment: 
                                                <IconButton aria-label='delete-word-by-index' id={String(index)} onClick={handleDeleteWord} style={{ textDecoration: 'none', color: "inherit" }}>
                                                    <HighlightOffIcon />
                                                </IconButton>,
                                            style: {
                                                padding: 0
                                            }
                                        }}
                                        {...register(`words.${index}`)}
                                        onChange={handleChangeWord}
                                        error={errors.words ? errors.words[index]? true : false : false}
                                        helperText={errors.words ? errors.words[index]?.message : ''}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={3} sx={{ mt: 1, mb: 1 }}>
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    onClick={handleAddWord}
                                >
                                    Add
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <FormHelperText sx={{color: '#d74343', mt: 1, ml: 2}}>{errors.words?.message}</FormHelperText>
                            </Grid>
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
        );
	}
}

export default WordleManage;