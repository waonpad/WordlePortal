import React, { useState, useEffect } from 'react';
import swal from "sweetalert";
import ReactDOM from 'react-dom';
import { Button, Card } from '@material-ui/core';
import { Link, useParams, useHistory } from "react-router-dom";
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form";
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import ReactLoading from 'react-loading';

import {useAuth} from "../../contexts/AuthContext";

interface PrivatePostData {
    disp_user_id: number;
    text: string;
    submit: string;
}

declare global {
    interface Window {
        Echo: any;
    }
}

function PrivateChat(): React.ReactElement {

    const auth = useAuth();
    const history = useHistory();
    
    const {id} = useParams<{id: string}>();
    const [disp_user_id, setDispUserId] = useState(Number);

    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<PrivatePostData>();
    const [initial_load, setInitialLoad] = useState(true);
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<PrivatePostData> = (data: PrivatePostData) => {
        setLoading(true)

        data.disp_user_id = disp_user_id;

        axios.post('/api/privatepost', data).then(res => {
            swal("送信成功", "送信成功", "success");
            console.log(res);
            setLoading(false);
        }).catch(error => {
            console.log(error)
            setError('submit', {
            type: 'manual',
            message: '送信に失敗しました'
        })
            setLoading(false);
        })
    }

    const initialState = [
        {
            text: 'sample1',
        },
        {
            text: 'sample2',
        },
        {
            text: 'sample3',
        },     
    ]

    const [private_posts, setPrivatePosts] = useState(initialState);

	useEffect(() => {

        const data = {
            screen_name: id
        };

        axios.get('/api/user/show', {params: data}).then(res => {
            if (res.status === 200) {
                console.log(res);
                setDispUserId(res.data.user.id);

                const channelname = auth!.user!.id < res.data.id ? auth!.user!.id.toString() + '-' + res.data.user.id.toString() : res.data.user.id.toString() + '-' + auth!.user!.id.toString();

                console.log(channelname);

                window.Echo.private('private_post.' + channelname).listen('PrivatePosted', (e: any) => {
                    console.log(e);
                    console.log(e.private_post.text);
                    setPrivatePosts(private_posts => [...private_posts,{text: e.private_post.text}]);
                });

                setInitialLoad(false);
            }
        }).catch((error) => {
            console.log(error);
            swal("ユーザーがいない", "そのユーザーは存在しません", "error");
            // history.push('/');
            setInitialLoad(false);
        });
	}, [])

    
	if (initial_load) {
		return (
			<ReactLoading type="spin" height="100px" width="100px" />
		)
	}
	else {
        return (
            <React.Fragment>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header">
                                    <ul id='board'>
                                        { private_posts.map((private_post, index) => (
                                        <li key={ index }>{ private_post.text }</li>
                                        ))}
                                    </ul>
                                </div>
    
                                <form className="py-4" onSubmit={e => {clearErrors(); handleSubmit(onSubmit)(e)}}>
                                    <div className="card-body">
                                        <div className="py-4">
                                            <TextField
                                                fullWidth
                                                variant="outlined" 
                                                id="text"
                                                label="メッセージ" 
                                                {...register('text', {
                                                required: '入力してください'
                                                })} 
                                            />
                                        </div>
                                            
                                        <div>
                                            <LoadingButton loading={loading} type="submit" variant="contained" fullWidth>Submit</LoadingButton>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
	}
}

export default PrivateChat;