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

import {useAuth} from "../contexts/AuthContext";

interface GroupPostData {
    group_id: number;
    text: string;
    submit: string;
}

declare global {
    interface Window {
        Echo: any;
    }
}

function GroupChat(): React.ReactElement {

    const auth = useAuth();
    const history = useHistory();
    
    const {id} = useParams<{id: string}>();
    const [group_id, setGroupId] = useState(Number);

    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<GroupPostData>();
    const [initial_load, setInitialLoad] = useState(true);
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<GroupPostData> = (data: GroupPostData) => {
        setLoading(true)

        data.group_id = group_id;

        axios.post('/api/group/post', data).then(res => {
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

    const [group_posts, setGroupPosts] = useState(initialState);

	useEffect(() => {

        const data = {
            screen_name: id
        };

        axios.get('/api/group/show', {params: data}).then(res => {
            if (res.status === 200) {
                setGroupId(res.data.group.id);
                console.log(res);

                console.log(res.data.id);
                
                // グループにユーザーを登録する処理 後からつくる

                // https://readouble.com/laravel/8.x/ja/broadcasting.html

                window.Echo.join('group_post.' + res.data.id)
                .listen('GroupPosted', (e: any) => {
                    console.log(e);
                    console.log(e.group_post.text);
                    setGroupPosts(group_posts => [...group_posts,{text: e.group_post.text}]);
                })
                .here((users: any)=> {
                    console.log('here');
                    console.log(users);
                })
                .joining((user: any) => {
                    console.log('joining');
                    console.log(user);
                })
                .leaving((user: any) => {
                    console.log('leaving');
                    console.log(user);
                })
                .error((error: any) => {
                    console.log(error);
                });

                setInitialLoad(false);
            }
        }).catch((error) => {
            // console.log(error);
            swal("グループがない", "そのグループは存在しません", "error");
            history.push('/');
            // setInitialLoad(false);
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
                                        { group_posts.map((group_post, index) => (
                                        <li key={ index }>{ group_post.text }</li>
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

export default GroupChat;