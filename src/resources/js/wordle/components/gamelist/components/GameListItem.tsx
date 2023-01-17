import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button, Grid, Card, CardHeader, CardContent, Chip, Stack, Avatar, IconButton, Typography, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AbcIcon from '@mui/icons-material/Abc';
import PinIcon from '@mui/icons-material/Pin';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import PersonIcon from '@mui/icons-material/Person'; // 参加者数
import AutorenewIcon from '@mui/icons-material/Autorenew'; // laps
import AlarmIcon from '@mui/icons-material/Alarm'; // 制限時間
import AlarmOffIcon from '@mui/icons-material/AlarmOff'; // 制限時間無し
import InvertColorsIcon from '@mui/icons-material/InvertColors'; // 着色
import InvertColorsOffIcon from '@mui/icons-material/InvertColorsOff'; // 着色無し
import { yellow } from '@mui/material/colors';
import { useAuth } from '../../../../contexts/AuthContext';
import { GameListItemProps } from '../../../types/GameType';
import ParticalRenderLink from '../../../../common/link/particalrenderlink/components/ParticalRenderLink';

function GameListItem(props: GameListItemProps): React.ReactElement {
    const {game, handleDeleteGame, handleVSPlayOptionOpen} = props;

    const auth = useAuth();
    
    const user_partical_render_route_paths = [
        `/user/:screen_name`,
        `/user/:screen_name/follows`,
        `/user/:screen_name/followers`,
        `/user/:screen_name/wordle`,
        `/user/:screen_name/wordle/game`,
        `/user/:screen_name/wordle/like`,
    ];

    const game_partical_render_route_paths = [
        '/',
        '/wordle/index',
        '/wordle/follows',
        `/wordle/tag/:wordle_tag_id`,
        `/wordle/search/:wordle_search_param`,
        `/wordle/game/index`,
        `/wordle/game/follows`,
        `/wordle/game/tag/:game_tag_id`,
        `/wordle/game/search/:wordle_game_search_param`
    ];

    return (
        <Card elevation={1}>
            <CardHeader
                avatar={
                    <Avatar src={`/storage/${game.user.icon}`} />
                }
                action={
                <IconButton aria-label="settings">
                    <MoreVertIcon />
                    {/* TODO: アクション追加 */}
                </IconButton>
                }
                subheader={
                    <React.Fragment>
                        <ParticalRenderLink
                            path={{
                                path: `/user/${game.user.screen_name}`,
                                route_path: `/user/:screen_name`,
                                params: {screen_name: game.user.screen_name}
                            }}
                            partical_render_params={{screen_name: game.user.screen_name}}
                            partical_render_route_paths={user_partical_render_route_paths}
                        >
                            <Typography color='#000000DE'>{game.user.name}</Typography>
                        </ParticalRenderLink>
                        <Typography>{new Date(game.created_at).toLocaleString()}</Typography>
                    </React.Fragment>
                }
                sx={{pb: 1}}
            />
            <CardContent sx={{pt: 0, "&:last-child": {pb: 1}}}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            {game.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center'}}>
                            <LocalOfferIcon sx={{color: '#757575'}} />
                            {(game.tags as any[]).map((tag: any, index: number) => (
                                <ParticalRenderLink
                                    path={{
                                        path: `/wordle/game/tag/${tag.id}`,
                                        route_path: `/wordle/game/tag/:game_tag_id`,
                                        params: {game_tag_id: tag.id}
                                    }}
                                    partical_render_params={{game_tag_id: tag.id}}
                                    partical_render_route_paths={game_partical_render_route_paths}
                                    key={index}
                                >
                                    <Chip clickable label={tag.name} />
                                </ParticalRenderLink>
                            ))}
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>{game.description}</Typography>
                    </Grid>
                    <Grid item container xs={12}>
                        <Grid item>
                            <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1}}>
                            {/* <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1, marginLeft: 'auto'}}> */}
                                {(game.input as string[]).map((input: string, index: number) => (
                                    <Chip key={index} sx={{borderRadius: '4px', fontWeight: 'bold', color: '#757575'}} label={
                                        input === 'japanese' ? 'あ'
                                        : input === 'english' ? <AbcIcon />
                                        : input === 'number' ? <PinIcon />
                                        : input === 'typing' ? <KeyboardIcon />
                                        : ''
                                    } />
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item sx={{marginLeft: 'auto'}}>
                            <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1}}>
                                <Tooltip title={`Max Participants: ${game.max_participants}`}>
                                    <Chip sx={{borderRadius: '4px', fontWeight: 'bold', color: '#757575'}}
                                        icon={<PersonIcon />}
                                        // firebaseから現在の参加者を取得する？(めんどう・・・)
                                        // label={`0 / ${game.max_participants}`}
                                        label={game.status === 'end' ? game.game_users.length : game.max_participants}
                                    />
                                </Tooltip>
                                <Tooltip title={`Laps: ${game.laps}`}>
                                    <Chip sx={{borderRadius: '4px', fontWeight: 'bold', color: '#757575'}}
                                        icon={<AutorenewIcon />}
                                        label={game.laps}
                                    />
                                </Tooltip>
                                <Tooltip title={`Answer Time Limit: ${game.answer_time_limit ? `${game.answer_time_limit}s` : 'none'}`}>
                                    <Chip sx={{borderRadius: '4px', fontWeight: 'bold', color: '#757575'}}
                                        icon={game.answer_time_limit ? <AlarmIcon /> : <></>}
                                        label={game.answer_time_limit ? `${game.answer_time_limit}s` : <AlarmOffIcon />}
                                    />
                                </Tooltip>
                                <Tooltip title={`Coloring: ${game.coloring ? 'Colored' : 'Plain'}`}>
                                    <Chip sx={{borderRadius: '4px', fontWeight: 'bold', color: '#757575'}}
                                        label={game.coloring ? <InvertColorsIcon /> : <InvertColorsOffIcon />}
                                    />
                                </Tooltip>
                            </Stack>
                        </Grid>
                    </Grid>
                    {
                        game.status === 'wait' ? (
                            // waitの時はEdit,Delete,Joinができる
                            <Grid item xs={12} sx={{display: 'flex'}}>
                                {auth?.user?.id == game.user.id ? (
                                        <React.Fragment>
                                            <IconButton data-game-id={game.id} onClick={handleVSPlayOptionOpen}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton data-delete-id={game.id} onClick={handleDeleteGame}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </React.Fragment>
                                ) : (
                                    <></>
                                )}
                                <Link to={`/wordle/game/play/${game.uuid}`} style={{marginLeft: 'auto'}}>
                                    <Button variant='contained' style={{fontWeight: 'bold', color: '#fff'}}>Join</Button>
                                </Link>
                            </Grid>
                        )
                        :
                        game.status === 'start' ? (
                            // startの時はJoinができる
                            <Grid item xs={12} sx={{display: 'flex'}}>
                                <Link to={`/wordle/game/play/${game.uuid}`} style={{marginLeft: 'auto'}}>
                                    <Button variant='contained' style={{fontWeight: 'bold', color: '#fff'}}>Join</Button>
                                </Link>
                            </Grid>
                        )
                        :
                        game.status === 'end' ? (
                            // endの時はリザルトが表示される
                            <Grid item xs={12}>
                                <Stack direction="row" spacing={0} sx={{ flexWrap: 'wrap', gap: 1}}>
                                    {(game.game_users.filter((game_user: any) => (
                                        game_user.result === 1
                                    ))).map((game_user: any, index: number) => (
                                        <ParticalRenderLink
                                            path={{
                                                path: `/user/${game_user.user.screen_name}`,
                                                route_path: `/user/:screen_name`,
                                                params: {screen_name: game_user.user.screen_name}
                                            }}
                                            partical_render_params={{screen_name: game_user.user.screen_name}}
                                            partical_render_route_paths={user_partical_render_route_paths}
                                            key={index}
                                        >
                                            <Chip
                                                avatar={<Avatar alt="" src={`/storage/${game_user.user.icon}`} />}
                                                label={game_user.user.name}
                                                variant="filled"
                                                color={'primary'}
                                                // sx={{backgroundColor: yellow[200]}}
                                                clickable
                                            />
                                        </ParticalRenderLink>
                                    ))}
                                    {(game.game_users.filter((game_user: any) => (
                                        game_user.result !== 1
                                    ))).map((game_user: any, index: number) => (
                                        <ParticalRenderLink
                                            path={{
                                                path: `/user/${game_user.user.screen_name}`,
                                                route_path: `/user/:screen_name`,
                                                params: {screen_name: game_user.user.screen_name}
                                            }}
                                            partical_render_params={{screen_name: game_user.user.screen_name}}
                                            partical_render_route_paths={user_partical_render_route_paths}
                                            key={index}
                                        >
                                            <Chip
                                                avatar={<Avatar alt="" src={`/storage/${game_user.user.icon}`} />}
                                                label={game_user.user.name}
                                                variant="outlined"
                                                clickable
                                            />
                                        </ParticalRenderLink>
                                    ))}
                                </Stack>
                            </Grid>
                        )
                        :
                        <></>
                    }
                </Grid>
            </CardContent>
            {/* <CardActions disableSpacing>
            </CardActions> */}
        </Card>
    )
}

export default GameListItem;