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
import { WordleData, WordleErrorData, WordleDefaultData } from '@/wordle/types/WordleType';
import SuspensePrimary from '@/common/suspense/suspenseprimary/components/SuspensePrimary';
import WordleCommentList from '@/wordle/components/wordlecommentlist/components/WordleCommentList';
import ButtonGroupPrimary from '@/common/button/buttongroupprimary/components/ButtonGroupPrimary';
import WordlePrimaryManage from '@/wordle/wordlemanage/components/WordlePrimaryManage';
import SimpleTextCard from '@/common/card/simpletextcard/components/SimpleTextCard';
import { WordleCommentData, WordleCommentErrorData } from '../types/WordleCommentType';

function WordleManage(): React.ReactElement {
    const basicSchemaWordleManage = Yup.object().shape({
        name: Yup.string().max(50).required(),
        words: Yup.array()
                // .of(
                //     Yup.string().min(5).max(10).nullable()
                //     .transform((value, originalValue) =>String(originalValue).trim() === '' ? null : value)
                // )
                // TextFieldを消しても実際のデータが消えないので本来無いデータがバリデーションされる
                // ここでは処理せずバックエンドでバリデーションする
                .unique("must be unique", (val: any) => val || val === '') // TODO: カタカナひらがなを同一のものとして扱いたい
                // .test('', 'words field must have at least 10 items', (words: any) => words?.filter(function(word: any){
                //     return !(word === null || word === undefined || word === "");
                // }).length >= 10)
                // 挙動がおかしい
                // TextFieldを消しても実際のデータが消えないのでonSubmit内でstateを参照して対処する
                ,
        // input: Yup.array().min(1).of(Yup.string()),
        description: Yup.string().max(255),
        // tagsはMuiChipsInputでバリデーションしている
    });
    const basicSchemaWordleComment = Yup.object().shape({
        comment: Yup.string().max(255),
    });
    const location = useLocation();
    const {wordle_id} = useParams<{wordle_id: string}>();
    const [wordle_default_data, setWordleDefaultData] = useState<WordleDefaultData>();
    const [initial_load, setInitialLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    const [wordle_comment_submit_loading, setWordleCommentSubmitLoading] = useState(false);
    const [tags, setTags] = useState<MuiChipsInputChip[]>([]);
    const [words, setWords] = useState<string[]>([]);
    const [input, setInput] = useState<{[key: string]: boolean}>({japanese: false, english: false, number: false, typing: false});
    const input_values = ['japanese', 'english', 'number', 'typing'];

    const { register: registerWordleManage, handleSubmit: handleSubmitWordleManage, setError: setErrorWordleManage, clearErrors: clearErrorsWordleManage, formState: { errors: errorsWordleManage } } = useForm<WordleData>({
        mode: 'onBlur',
        resolver: yupResolver(basicSchemaWordleManage)
    });
    
    const { register: registerWordleComment, handleSubmit: handleSubmitWordleComment, setError: setErrorWordleComment, clearErrors: clearErrorsWordleComment, formState: { errors: errorsWordleComment } } = useForm<WordleCommentData>({
        mode: 'onBlur',
        resolver: yupResolver(basicSchemaWordleComment)
    });

    useEffect(() => {
        console.log(errorsWordleManage)
    },[errorsWordleManage])

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
        setWords((words) => words.filter((word, index) => (index !== target_word_id)));
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
    const onSubmitWordleManage: SubmitHandler<WordleData> = (data: WordleData) => {
        data.id = Number(wordle_id) ?? null;
        data.tags = tags;
        data.words = words;
        setLoading(true);

        console.log(data);

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
                (Object.keys(obj) as (keyof WordleErrorData)[]).forEach((key) => setErrorWordleManage(key, {
                    type: 'manual',
                    message: obj[key]
                }))
    
                setLoading(false)
            }
        })
    }
    /////////////////////////////////////////////////////////////////////////////////////

    // Submit Wordle Comment ////////////////////////////////////////////////////////////////////
    const onSubmitWordleComment: SubmitHandler<WordleCommentData> = (data: WordleCommentData) => {
        data.wordle_id = Number(wordle_id);
        setWordleCommentSubmitLoading(true);

        axios.post('/api/wordle/comment/upsert', data).then(res => {
            if (res.data.status === true) {
                setWordleCommentSubmitLoading(false)
            }
            else if (res.data.status === false) {
                // 失敗時の処理
            }
            else {
                const obj: WordleCommentErrorData = res.data.validation_errors;
                (Object.keys(obj) as (keyof WordleCommentErrorData)[]).forEach((key) => setErrorWordleComment(key, {
                    type: 'manual',
                    message: obj[key]
                }))
    
                setWordleCommentSubmitLoading(false)
            }
        })
    }
    /////////////////////////////////////////////////////////////////////////////////////

	useEffect(() => {
        // 作成済、管理用
        if (location.pathname ===  `/wordle/manage/${wordle_id}`) {
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
        <Container maxWidth={'lg'}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography component="h1" variant="h5">
                        Wordle {wordle_id ? 'Manage' : 'Create'}
                    </Typography>
                </Grid>
                {/* 左のエリア */}
                <Grid item container xs={6} spacing={2} height={'fit-content'}>
                    <Grid item xs={12}>
                        <WordlePrimaryManage
                            handleSubmit={handleSubmitWordleManage}
                            onSubmit={onSubmitWordleManage}
                            wordle_default_data={wordle_default_data}
                            register={registerWordleManage}
                            errors={errorsWordleManage}
                            tags={tags}
                            handleSelecetedTags={handleSelecetedTags}
                            input_values={input_values}
                            input={input}
                            handleInputChange={handleInputChange}
                            words={words}
                            handleDeleteWord={handleDeleteWord}
                            handleChangeWord={handleChangeWord}
                            handleAddWord={handleAddWord}
                            loading={loading}
                            wordle_id={wordle_id}
                        />
                    </Grid>
                </Grid>
                {/* 右のエリア */}
                <Grid item container xs={6} spacing={2} height={'fit-content'}>
                    {/* コメントリスト */}
                    <Grid item xs={12}>
                        {
                            wordle_id !== undefined ?
                            <Grid item container xs={12} spacing={2}>
                                {/* コメント投稿 */}
                                <Grid item xs={12}>
                                    <Box component="form" noValidate onSubmit={handleSubmitWordleComment(onSubmitWordleComment)}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    id="comment"
                                                    label="Comment"
                                                    autoComplete="comment"
                                                    {...registerWordleComment('comment')}
                                                    error={errorsWordleComment.comment ? true : false}
                                                    helperText={errorsWordleComment.comment?.message}
                                                />
                                            </Grid>
                                        </Grid>
                                        <LoadingButton
                                            type="submit"
                                            loading={wordle_comment_submit_loading}
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 2, mb: 2 }}
                                        >
                                            Comment Submit
                                        </LoadingButton>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <WordleCommentList
                                        head={
                                            <ButtonGroupPrimary
                                                head={true}
                                                items={[
                                                    {
                                                        text: 'Comments',
                                                        value: 'wordle_comments',
                                                        active: false
                                                    },
                                                ]}
                                            />
                                        }
                                        request_config={{
                                            api_url: 'wordle/comment/comments',
                                            params: {wordle_id: wordle_id},
                                            response_keys: ['wordle_comments'],
                                        }}
                                        listen={false}
                                        no_item_text={'No Comments'}
                                    />
                                </Grid>
                            </Grid>
                            :
                            // TODO: createの時に表示するものを決める
                            <SimpleTextCard
                                text={'Comment Area'}
                            />
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}

export default WordleManage;