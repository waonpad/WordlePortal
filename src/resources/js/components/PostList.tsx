import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import axios from 'axios';
import Card from '@mui/material/Card';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {useAuth} from "../contexts/AuthContext";
import PostForm from '../components/PostForm';
import Modal from "react-modal";
import ModalPrimary from './ModalPrimary';
import { PostListProps } from '../@types/PostListType';

// const customStyles = {
//     overlay: {
//       zIndex: 100
//     },
//     content: {
//         top: '50%',
//         left: '50%',
//         right: 'auto',
//         bottom: 'auto',
//         marginRight: '-50%',
//         transform: 'translate(-50%, -50%)',
//     },
// }

// Modal.setAppElement('#app');

function PostList(props: PostListProps): React.ReactElement {

    const auth = useAuth();
    const [post_loading, setPostLoading] = useState(true);
    
    // Channel ////////////////////////////////////////////////////////////////////
    const [posts, setPosts] = useState<any[]>([]);

	useEffect(() => {
        console.log(props.post_get_api_method);
        console.log(props.request_params);
        console.log(props.listening_channel);
        console.log(props.listening_event);
        axios.get(`/api/${props.post_get_api_method}`, {params: props.request_params}).then(res => {
            if (res.status === 200) {
                console.log(res);
                console.log(res.data.posts);
                setPosts(res.data.posts.reverse());
                setPostLoading(false);
                console.log('投稿取得完了');
            }
        });

        window.Echo.channel(props.listening_channel).listen(props.listening_event, (channel_event: any) => {
            console.log(channel_event);
            if(channel_event.event_type === 'create') {
                setPosts(posts => [channel_event.post, ...posts]);
                console.log('新しい投稿を受信');
            }
            if(channel_event.event_type === 'update') {
                setPosts((posts) => posts.map((post) => (post.id === channel_event.post.id ? channel_event.post : post)));
                console.log('投稿の更新を受信');
            }
        });
	}, [])
    /////////////////////////////////////////////////////////////////////////////////////

    // LikeToggle ////////////////////////////////////////////////////////////////
    const handleLikeToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const post_id = event.currentTarget.getAttribute('data-like-id');

        axios.post('/api/post/liketoggle', {post_id: post_id}).then(res => {
            console.log(res);
            if(res.data.status === true) {
                const like_status = res.data.like_status;
                const target_post = posts.find((post) => (post.id == post_id));
                target_post.like_status = like_status;
                setPosts((posts) => posts.map((post) => (post.id === post_id ? target_post : post)));
                console.log(`いいね状態: ${like_status}`);
            }
            else {
                console.log(res);
            }
        })
        .catch(error => {
            console.log(error)
        })
    };
    //////////////////////////////////////////////////////////////////////////////////////////

    // DeletePost //////////////////////////////////////////////////////////////
    const handleDeletePost = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const post_id = event.currentTarget.getAttribute('data-delete-id');

        axios.post('/api/post/destroy', {post_id: post_id}).then(res => {
            console.log(res);
            if(res.data.status === true) {
                const target_post = posts.find((post) => (post.id == post_id));
                setPosts(posts.filter((post, index) => (post.id !== target_post.id)));
                console.log('投稿削除成功');
            }
            else {
                console.log(res);
            }
        })
        .catch(error => {
            console.log(error)
        })
    };
    ////////////////////////////////////////////////////////////////////////////////////

    // EditPost in Modal ////////////////////////////////////////////////////////////////
    const [modalIsOpen, setIsOpen] = useState(false);
    const [edit_target_post, setEditTargetPost] = useState<any[]>([]);

    const handleEditPost = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const post_id = event.currentTarget.getAttribute('data-edit-id');
        const target_post = posts.find((post) => (post.id == post_id));
        setEditTargetPost(target_post);
        setIsOpen(true);

    };
    ////////////////////////////////////////////////////////////////////////////////

    return (
        <Box
            sx={{
                marginTop: 2,
            }}
        >
            <ModalPrimary isOpen={modalIsOpen}>
                <PostForm post={edit_target_post} handleModalClose={setIsOpen}/>
                <Button onClick={() => setIsOpen(false)}>Close Modal</Button>
            </ModalPrimary>
            {/* <Modal isOpen={modalIsOpen} style={customStyles}>
                <PostForm post={edit_target_post} handleModalClose={setIsOpen}/>
                <Button onClick={() => setIsOpen(false)}>Close Modal</Button>
            </Modal> */}
            <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
                {!post_loading ? (
                    posts.map((post, index) => (
                        <Grid item xs={12} sx={{minWidth: '100%'}} key={index}>
                            <Card elevation={3}>
                                <CardHeader
                                    action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                        {/* TODO: アクション追加 */}
                                    </IconButton>
                                    }
                                    title={post.title}
                                    subheader={
                                        <React.Fragment>
                                            <Link to={`/user/${post.user.screen_name}`}>{post.user.name}</Link>
                                            <Typography>{post.created_at}</Typography>
                                        </React.Fragment>
                                    }
                                    sx={{pb: 1}}
                                />
                                <CardContent sx={{pt: 0}}>
                                    <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                        {(post.categories as any[]).map((category: any, index: number) => (
                                            // <Chip label={category.name} key={index} component={Link} to={`/category/${category.id}`} />
                                            <Link to={`/category/${category.id}`} key={index}><Chip label={category.name} /></Link>
                                        ))}
                                    </Stack>
                                    <Typography variant="body2" component="div" color="text.secondary" dangerouslySetInnerHTML={{ __html: post.comment }} sx={{pt: 2}} />
                                </CardContent>
                                <CardActions disableSpacing>
                                    {auth?.user ?
                                        auth?.user.id == post.user.id ? (
                                            <React.Fragment>
                                                <IconButton data-edit-id={post.id} onClick={handleEditPost}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton data-delete-id={post.id} onClick={handleDeletePost}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </React.Fragment>
                                    ) : (
                                        // いいねボタン
                                        <IconButton data-like-id={post.id} onClick={handleLikeToggle} aria-label="add to favorites">
                                            <FavoriteIcon color={post.like_status ? 'secondary' : 'inherit'} />
                                        </IconButton>
                                    ) : (
                                        // (ログインしていない(今後ログインしていなくても見れるようにするかも) いいねボタン?)
                                        <IconButton data-like-id={post.id} onClick={handleLikeToggle} aria-label="add to favorites">
                                            <FavoriteIcon color={post.like_status ? 'secondary' : 'inherit'} />
                                        </IconButton>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <CircularProgress />
                )}
            </Grid>
        </Box>
    )
}

export default PostList;