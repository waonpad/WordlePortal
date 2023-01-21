import React, { useState, useEffect } from 'react';
import swal from "sweetalert";
import { useParams, useHistory, useLocation } from "react-router-dom";
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form";
import { Backdrop, CircularProgress, IconButton, TextField, Button, FormLabel, FormControl, FormGroup, FormControlLabel, FormHelperText, Checkbox, Grid, Box, Typography, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { MuiChipsInput, MuiChipsInputChip } from 'mui-chips-input';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { WordleData, WordleErrorData, WordleDefaultData } from '@/wordle/types/WordleType';
import SuspensePrimary from '@/common/suspense/suspenseprimary/components/SuspensePrimary';

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
    const location = useLocation();
    const {wordle_id} = useParams<{wordle_id: string}>();
    const [wordle_default_data, setWordleDefaultData] = useState<WordleDefaultData>();
    const [initial_load, setInitialLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState<MuiChipsInputChip[]>([]);
    const [words, setWords] = useState<string[]>([]);
    const [input, setInput] = useState<{[key: string]: boolean}>({japanese: false, english: false, number: false, typing: false});
    const input_values = ['japanese', 'english', 'number', 'typing'];

    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<WordleData>({
        mode: 'onBlur',
        resolver: yupResolver(basicSchema)
    });
    
    // Tags /////////////////////////////////////////////////////////////
    const handleSelecetedTags = (selectedItem: MuiChipsInputChip[]) => {
        setTags(selectedItem);
    }
    //////////////////////////////////////////////////////////////////////

    // Words ///////////////////////////////////////////////////////
    const handleAddWord = () => {
        setWords([...words, '']);
    }

    const handleChangeWord = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target_word_id = Number(event.currentTarget.getAttribute('data-word-id'));
        const changed_word = event.currentTarget.value;
        setWords((words) => words.map((word, index) => (index === target_word_id ? changed_word : word)));
    }

    const handleDeleteWord = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const target_word_id = Number(event.currentTarget.getAttribute('data-word-id'));
        setWords((words) => words.map((word, index) => (index === target_word_id ? '' : word)));
        setWords(words.filter((word, index) => (index !== target_word_id)));
    }
    ///////////////////////////////////////////////////////////////////////

    // Checkbox //////////////////////////////////////////////////////////////////
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

    // Submit ////////////////////////////////////////////////////////////////////
    const onSubmit: SubmitHandler<WordleData> = (data: WordleData) => {
        data.id = Number(wordle_id) ?? null;
        data.tags = tags;
        setLoading(true);

        axios.post('/api/wordle/upsert', data).then(res => {
            if (res.data.status === true) {
                swal("Success", "登録成功", "success");
                // setTimeout((() => {history.push('/')}), 4000);
                setLoading(false)
            }
            else if (res.data.status === false) {
                // 失敗時の処理
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
    }
    /////////////////////////////////////////////////////////////////////////////////////

	useEffect(() => {
        // 作成済、管理用
        if (wordle_id !== undefined) {
            axios.get('/api/wordle/show',  {params: {wordle_id: wordle_id}}).then(res => {
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
                else if (res.data.status === false) {
                    // wordleが存在しなかった時の処理
                }
                setInitialLoad(false)
            })
        }
        // 作成用
        else {
            setWords(['', '', '', '', '', '', '', '', '', ''])
            setInitialLoad(false);
        }
    }, [location])

    if(initial_load) {
        return (<SuspensePrimary open={true} backdrop={true} />)
    }

    return (
        <Container maxWidth={'md'}>
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
                                    data-word-id={index}
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
        </Container>
    );
}

export default WordleManage;