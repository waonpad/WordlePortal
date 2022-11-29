import React, { useState, useEffect } from 'react';
import swal from "sweetalert";
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form";
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import { Editor } from '@tinymce/tinymce-react';
import { MuiChipsInput, MuiChipsInputChip } from 'mui-chips-input';
import FormHelperText from '@mui/material/FormHelperText';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { PostData, PostErrorData } from '../types/PostType';

// Edit Comment Props
// -------------------
// post: any
// handleModalClose: Function

function PostForm(props: any): React.ReactElement {
    const basicSchema = Yup.object().shape({
        title: Yup.string().max(50).required()
    });

    const { register, handleSubmit, setError, clearErrors, formState: { errors }, reset } = useForm<PostData>({
        mode: 'onBlur',
        defaultValues: {
        },
        resolver: yupResolver(basicSchema)
    });

    const [loading, setLoading] = useState(false);

    // 編集時に初期データを注入する ////////////////////////////////////////////////
    const [post_id, setPostId] = useState<number | null>(null)
    useEffect(() => {
        if(props?.post) {
            const post_id = props.post.id;
            setPostId(post_id);

            const belonged_categories = props.post.categories;
            const belonged_categories_name = (belonged_categories as any[]).map(category => category['name']);
            setCategories(belonged_categories_name);

            const comment = props.post.comment;
            setComment(comment);
        }
    }, [])
    ///////////////////////////////////////////////////////////////////////////

    // tinyMCE /////////////////////////////////////////////////////////////
    const [comment, setComment] = useState('');
    const [comment_error, setCommentError] = useState(false);
    const handleEditorChange = (content: any, editor: any) => {
        // console.log("Content was updated:", content);
        setComment(content);
        if(content === '') {
            setCommentError(true);
        }
        else {
            setCommentError(false);
        }
    };
    /////////////////////////////////////////////////////////////////////////

    // Categoriess /////////////////////////////////////////////////////////////
    const [categories, setCategories] = useState<MuiChipsInputChip[]>([]);

    const handleSelecetedCategories = (selectedItem: MuiChipsInputChip[]) => {
        setCategories(selectedItem);
    }
    //////////////////////////////////////////////////////////////////////

    // Submit //////////////////////////////////////////////////////////
    const onSubmit: SubmitHandler<PostData> = (data: PostData) => {
        if(comment === '') {
            setCommentError(true);
            return false;
        }
        else {
            setCommentError(false);
        }
        data.id = post_id;
        data.comment = comment;
        data.categories = categories;
        console.log(data);
        setLoading(true);
        setCategories([]);
        setComment('');
        reset();
        // Enterしていないカテゴリーの入力欄はリセットされない
        // Commentが空白になるのでrequiredが出る

        axios.post('/api/post/upsert', data).then(res => {
            console.log(res);
            if(res.data.status === true) {
                swal("送信成功", "送信成功", "success");
                setLoading(false);
                if(props?.post) {
                    props?.handleModalClose(false);
                }
            }
            else {
                const obj: PostErrorData = res.data.validation_errors;
                (Object.keys(obj) as (keyof PostErrorData)[]).forEach((key) => setError(key, {
                    type: 'manual',
                    message: obj[key]
                }))
    
                setLoading(false)
            }
        })
        .catch(error => {
            console.log(error)
            setError('submit', {
            type: 'manual',
            message: '送信に失敗しました'
        })
            setLoading(false);
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
                        defaultValue={props?.post?.title ?? ''}
                        id="post-title"
                        label="Post Title"
                        autoComplete="post-title"
                        {...register('title')}
                        error={errors.title ? true : false}
                        helperText={errors.title?.message}
                    />
                </Grid>
                <Grid item xs={12}>
                    <MuiChipsInput
                        value={(categories as string[])}
                        onChange={handleSelecetedCategories}
                        fullWidth
                        variant='outlined'
                        id='categories'
                        label='Categories'
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
                    <FormHelperText sx={{mt: 1, ml: 2}}>Double click to edit a category</FormHelperText>
                </Grid>
                <Grid item xs={12}>
                    <Editor
                        apiKey={process.env.MIX_APP_TINY_MCE_APP_KEY}
                        initialValue={props?.post?.comment ?? ''}
                        init={{
                        skin: "material-classic",
                        content_css: 'material-classic',
                        icons: "material",
                        placeholder: "Comment",
                        height: 200,
                        menubar: true,
                        textcolor_rows: "4",
                        toolbar:
                            "undo redo | styleselect | fontsizeselect| code | bold italic | alignleft aligncenter alignright alignjustify | outdent indent "
                        }}
                        onEditorChange={handleEditorChange}
                    />
                    <FormHelperText sx={{mt: 1, ml: 2, color: '#d32f2f'}}>{comment_error ? 'comment is a required field' : ''}</FormHelperText>
                </Grid>
            </Grid>
            <LoadingButton
                type="submit"
                loading={loading}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Post
            </LoadingButton>
        </Box>
    );
}

export default PostForm;