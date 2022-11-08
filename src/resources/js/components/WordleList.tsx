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
// import wordleForm from '../components/wordleForm';
import Modal from "react-modal";

function WordleList(props: any): React.ReactElement {
    const auth = useAuth();
    const [wordle_loading, setwordleLoading] = useState(true);
    
    // Channel ////////////////////////////////////////////////////////////////////
    const [wordles, setwordles] = useState<any[]>([]);

	useEffect(() => {
        console.log(props.wordle_get_api_method);
        console.log(props.request_params);
        console.log(props.listening_channel);
        console.log(props.listening_event);
        axios.get(`/api/${props.wordle_get_api_method}`, {params: props.request_params}).then(res => {
            if (res.status === 200) {
                console.log(res);
                console.log(res.data);
                console.log(res.data.wordles);
                setwordles(res.data.wordles.reverse());
                setwordleLoading(false);
                console.log('投稿取得完了');
            }
        });

        window.Echo.channel(props.listening_channel).listen(props.listening_event, (channel_event: any) => {
            console.log(channel_event);
            if(channel_event.event_type === 'create') {
                setwordles(wordles => [channel_event.wordle, ...wordles]);
                console.log('新しい投稿を受信');
            }
            if(channel_event.event_type === 'update') {
                setwordles((wordles) => wordles.map((wordle) => (wordle.id === channel_event.wordle.id ? channel_event.wordle : wordle)));
                console.log('投稿の更新を受信');
            }
        });
	}, [])
    /////////////////////////////////////////////////////////////////////////////////////

    // LikeToggle ////////////////////////////////////////////////////////////////
    const handleLikeToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const wordle_id = event.currentTarget.getAttribute('data-like-id');

        axios.post('/api/wordle/liketoggle', {wordle_id: wordle_id}).then(res => {
            console.log(res);
            if(res.data.status === true) {
                const like_status = res.data.like_status;
                const target_wordle = wordles.find((wordle) => (wordle.id == wordle_id));
                target_wordle.like_status = like_status;
                setwordles((wordles) => wordles.map((wordle) => (wordle.id === wordle_id ? target_wordle : wordle)));
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

    // Deletewordle //////////////////////////////////////////////////////////////
    const handleDeleteWordle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const wordle_id = event.currentTarget.getAttribute('data-delete-id');

        axios.post('/api/wordle/destroy', {wordle_id: wordle_id}).then(res => {
            console.log(res);
            if(res.data.status === true) {
                const target_wordle = wordles.find((wordle) => (wordle.id == wordle_id));
                setwordles(wordles.filter((wordle, index) => (wordle.id !== target_wordle.id)));
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

    return (
        <Box
            sx={{
                marginTop: 2,
            }}
        >
            <Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
                {!wordle_loading ? (
                    wordles.map((wordle, index) => (
                        <Grid item xs={12} sx={{minWidth: '100%'}} key={index}>
                            <Card elevation={3}>
                                <CardHeader
                                    action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                        {/* TODO: アクション追加 */}
                                    </IconButton>
                                    }
                                    title={wordle.title}
                                    subheader={
                                        <React.Fragment>
                                            <Link to={`/user/${wordle.user.screen_name}`}>{wordle.user.name}</Link>
                                            <Typography>{wordle.created_at}</Typography>
                                        </React.Fragment>
                                    }
                                    sx={{pb: 1}}
                                />
                                <CardContent sx={{pt: 0}}>
                                    <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                        {(wordle.tags as any[]).map((tag: any, index: number) => (
                                            // URL未決定
                                            <Link to={`/wordle/tag/${tag.id}`} key={index}><Chip label={tag.name} /></Link>
                                        ))}
                                    </Stack>
                                    {/* Main Content */}
                                </CardContent>
                                <CardActions disableSpacing>
                                    {auth?.user ?
                                        auth?.user.id == wordle.user.id ? (
                                            <React.Fragment>
                                                <IconButton component={Link} to={`/wordle/manage/${wordle.id}`}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton data-delete-id={wordle.id} onClick={handleDeleteWordle}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </React.Fragment>
                                    ) : (
                                        // いいねボタン
                                        <IconButton data-like-id={wordle.id} onClick={handleLikeToggle} aria-label="add to favorites">
                                            <FavoriteIcon color={wordle.like_status ? 'secondary' : 'inherit'} />
                                        </IconButton>
                                    ) : (
                                        // (ログインしていない(今後ログインしていなくても見れるようにするかも) いいねボタン?)
                                        <IconButton data-like-id={wordle.id} onClick={handleLikeToggle} aria-label="add to favorites">
                                            <FavoriteIcon color={wordle.like_status ? 'secondary' : 'inherit'} />
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

export default WordleList;