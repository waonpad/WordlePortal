import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../contexts/AuthContext';
import ModalPrimary from '../../common/modal/components/ModalPrimary';
import VSPlayOption from './VSPlayOption';
import { GameListProps } from '../types/GameType';
import GameListItem from './GameListItem';

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
                <Grid container spacing={2}>
                    {games.map((game, index) => (
                        <GameListItem
                            key={index}
                            game={game}
                            handleDeleteGame={handleDeleteGame}
                            handleVSPlayOptionOpen={handleVSPlayOptionOpen}
                        />
                    ))}
                </Grid>
            </Container>
        )
    }
}

export default GameList;