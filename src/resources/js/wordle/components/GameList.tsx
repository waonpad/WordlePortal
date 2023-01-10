import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { Button, Grid, Container, CircularProgress } from '@mui/material';
import axios from 'axios';
import ModalPrimary from '../../common/modal/components/ModalPrimary';
import VSPlayOption from './VSPlayOption';
import { GameListProps } from '../types/GameType';
import GameListItem from './GameListItem';
import PaginationPrimary from './PaginationPrimary';

type paginate = 'prev' | 'next'

function GameList(props: GameListProps): React.ReactElement {
    const {game_status, game_get_api_method, request_params, response_keys, listen, listening_channel, listening_event} = props;

    const [game_loading, setGameLoading] = useState(true);

    // API ///////////////////////////////////////////////////////////////////////
    const getGame = (paginate: paginate) => {
        axios.get(`/api/${game_get_api_method}`, {params: {...request_params, per_page: 10, paginate: paginate, start: games.length > 0 ? games[0].id : null , last: games.length > 0 ? games.slice(-1)[0].id : null}}).then(res => {
            console.log(res);
            if (res.data.status === true) {
                var res_data = res.data;

                response_keys.forEach(key => {
                    res_data = res_data[key];
                });

                const filtered_games = res_data.filter((game: any) => (
                    game_status.includes(game.status)
                ));

                setGames(filtered_games.reverse());
                setGameLoading(false);
                console.log('投稿取得完了');
            }
            else if(res.data.status === false) {
                console.log('取得失敗');
            }
            else {
                console.log('予期せぬエラー');
            }
        }).catch(error => {
            console.log(error)
            swal("取得失敗", "取得失敗", "error");
        })
    }
    /////////////////////////////////////////////////////////////////////////
    
    // Channel ////////////////////////////////////////////////////////////////////
    const [games, setGames] = useState<any[]>([]);

	useEffect(() => {
        console.log(game_get_api_method);
        console.log(request_params);

        getGame('prev');

        if(listen) {
            window.Echo.channel(listening_channel).listen(listening_event, (channel_event: any) => {
                console.log(channel_event);
                if(channel_event.event_type === 'create' || channel_event.event_type === 'update') {
                    console.log('create / update');
                    // 一度削除した後追加しなおし、ソートすることで
                    // 既に配列に存在しているかどうかに関わらず処理をする
                    setGames((games) => [channel_event.game, ...games.filter((game) => (game.id !== channel_event.game.id))].sort(function(a, b) {
                        return (a.id < b.id) ? 1 : -1;  //オブジェクトの降順ソート
                    }))
                }
                if(channel_event.event_type === 'destroy') {
                    console.log('destroy');
                    setGames((games) => games.filter((game) => (game.id !== channel_event.game.id)));
                }
            });
        }
	}, [])
    /////////////////////////////////////////////////////////////////////////////////////

    // Page Change ///////////////////////////////////////////////////////////////////////
    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const paginate = event.currentTarget.value;
        getGame(paginate as paginate);
    }

    /////////////////////////////////////////////////////////////////////////

    // DeleteGame //////////////////////////////////////////////////////////////
    const handleDeleteGame = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const game_id = event.currentTarget.getAttribute('data-delete-id');

        axios.post('/api/wordle/game/destroy', {game_id: game_id}).then(res => {
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
                <Grid container spacing={1}>
                    <Grid item container spacing={2}>
                        {games.map((game, index) => (
                            <Grid item xs={12} key={index} sx={{minWidth: '100%'}}>
                                <GameListItem
                                    game={game}
                                    handleDeleteGame={handleDeleteGame}
                                    handleVSPlayOptionOpen={handleVSPlayOptionOpen}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    {
                        games.length > 0 ? 
                        <Grid item xs={12}>
                            <PaginationPrimary
                                handlePageChange={handlePageChange}
                            />
                        </Grid>
                        :
                        <></>
                    }
                </Grid>
            </Container>
        )
    }
}

export default GameList;