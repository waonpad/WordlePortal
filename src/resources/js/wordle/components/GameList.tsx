import React, { useState, useEffect } from 'react';
// import { Button } from '@material-ui/core';
import Button from '@mui/material/Button';
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
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { borders } from '@mui/system';
import { useAuth } from '../../contexts/AuthContext';
import Modal from "react-modal";
import ModalPrimary from '../../common/modal/components/ModalPrimary';
import VSPlayOption from './VSPlayOption';
import PrimaryButton from '../../common/button/primarybutton/components/PrimaryButton';

type GameListProps = {
    game_get_api_method: string;
    request_params: object;
    response_keys: string[];
    listen: boolean;
    listening_channel?: string;
    listening_event?: string;
}

function GameList(props: GameListProps): React.ReactElement {
    const {game_get_api_method, request_params, response_keys, listen, listening_channel, listening_event} = props;

    const auth = useAuth();
    const [game_loading, setGameLoading] = useState(true);
    
    // Channel ////////////////////////////////////////////////////////////////////
    const [games, setGames] = useState<any[]>([]);

	useEffect(() => {
        axios.get(`/api/${game_get_api_method}`, {params: request_params}).then(res => {
            if (res.status === 200) {
                console.log(res);
                var res_data = res.data;

                response_keys.forEach(key => {
                    res_data = res_data[key];
                });

                setGames(res_data.reverse());
                setGameLoading(false);
                console.log('投稿取得完了');
            }
        });

        if(listen) {
            window.Echo.channel(listening_channel).listen(listening_event, (channel_event: any) => {
                console.log(channel_event);
                if(channel_event.event_type === 'create' || 'update') {
                    // 一度削除した後追加しなおし、ソートすることで
                    // 既に配列に存在しているかどうかに関わらず処理をする
                    setGames((games) => [channel_event.game, ...games.filter((game) => (game.id !== channel_event.game.id))].sort(function(a, b) {
                        return (a.id < b.id) ? 1 : -1;  //オブジェクトの降順ソート
                    }))
                }
                if(channel_event.event_type === 'destroy') {
                    setGames((games) => games.filter((game) => (game.id !== channel_event.game.id)));
                }
            });
        }
	}, [])
    /////////////////////////////////////////////////////////////////////////////////////

    // DeleteGame //////////////////////////////////////////////////////////////
    const handleDeleteGame = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const game_id = event.currentTarget.getAttribute('data-delete-id');

        axios.post('/api/game/destroy', {game_id: game_id}).then(res => {
            console.log(res);
            if(res.data.status === true) {
                const target_game = games.find((game) => (game.id == game_id));
                setGames(games.filter((game, index) => (game.id !== target_game.id)));
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

    // VSPlay /////////////////////////////////////////////////////////////////////////////
    const [vs_target_game, setVSTargetGame] = useState<any>();
    const [modalIsOpen, setIsOpen] = useState(false);

    const handleVSPlayOptionOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const target = games.find((game) => game.id === Number(event.currentTarget.getAttribute('data-game-id')));
        console.log(target);
        setVSTargetGame(target);
        setIsOpen(true);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////

    if(game_loading) {
		return (
			<CircularProgress/>
		)
    }
    else {
        return (
            <Container maxWidth={'md'} disableGutters>
                <ModalPrimary isOpen={modalIsOpen}>
                    <VSPlayOption game={vs_target_game} handleModalClose={setIsOpen} />
                    <Button onClick={() => setIsOpen(false)}>Close Modal</Button>
                </ModalPrimary>
                <Grid container spacing={2}>
                    {games.map((game, index) => (
                        <Grid item xs={12} sx={{minWidth: '100%'}} key={index}>
                            <Card elevation={1}>
                                <CardHeader
                                    action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                        {/* TODO: アクション追加 */}
                                    </IconButton>
                                    }
                                    title={game.title}
                                    subheader={
                                        <React.Fragment>
                                            <Link to={`/user/${game.user.screen_name}`}>{game.user.name}</Link>
                                            <Typography>{new Date(game.created_at).toLocaleString()}</Typography>
                                        </React.Fragment>
                                    }
                                    sx={{pb: 1}}
                                />
                                <CardContent sx={{pt: 0}}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                                {(game.tags as any[]).map((tag: any, index: number) => (
                                                    // URL未決定
                                                    <Link to={`/game/tag/${tag.id}`} key={index}><Chip label={tag.name} /></Link>
                                                ))}
                                            </Stack>
                                        </Grid>
                                        {/* Main Content */}
                                        <Grid item xs={12}>
                                            <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1}}>
                                                {(game.input as string[]).map((input: string, index: number) => (
                                                    // あ, Ａ, １とかに変更する？]
                                                    // TODO: クリックした時にそのタグがついた投稿を表示するページに遷移する
                                                    <Chip key={index} sx={{borderRadius: '7px', border: 'solid 1px rgba(0, 0, 0, 0.54)', boxSizing: 'border-box'}} label={input} />
                                                ))}
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>{game.description}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack spacing={2} direction="row">
                                                <Button variant="contained" style={{fontWeight: 'bold', color: '#fff'}}>Single Play</Button>
                                                <Button variant="contained" style={{fontWeight: 'bold', color: '#fff'}} data-game-id={game.id} onClick={handleVSPlayOptionOpen}>VS Play</Button>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardActions disableSpacing>
                                    {auth?.user?.id == game.user.id ? (
                                            <React.Fragment>
                                                <IconButton component={Link} to={`/game/manage/${game.id}`}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton data-delete-id={game.id} onClick={handleDeleteGame}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </React.Fragment>
                                    ) : <></>
                                    }
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        )
    }
}

export default GameList;