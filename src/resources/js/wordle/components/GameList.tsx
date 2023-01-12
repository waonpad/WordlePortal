import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { Button, Grid, Container, CircularProgress } from '@mui/material';
import axios from 'axios';
import ModalPrimary from '../../common/modal/modalprimary/components/ModalPrimary';
import VSPlayOption from './VSPlayOption';
import { GameListProps } from '../types/GameType';
import GameListItem from './GameListItem';
import PaginationPrimary from '../../common/pagination/paginationprimary/components/PaginationPrimary';
import NoItem from '../../common/noitem/components/NoItem';
import AreYouSureDialog from '../../common/dialog/areyousuredialog/components/AreYouSureDialog';
import { AreYouSureDialogProps } from '../../common/dialog/areyousuredialog/types/AreYouSureDialogType';
import SuspensePrimary from '../../common/suspense/suspenseprimary/components/SuspensePrimary';

function GameList(props: GameListProps): React.ReactElement {
    const {game_status, game_get_api_method, request_params, response_keys, listen, listening_channel, listening_event} = props;

    const [game_loading, setGameLoading] = useState(true);
    const [games, setGames] = useState<any[]>([]);
    const [are_you_sure_dialog_config, setAreYouSureDialogConfig] = useState<AreYouSureDialogProps | undefined>();
    const [vs_target_game, setVSTargetGame] = useState<any>();
    const [modalIsOpen, setIsOpen] = useState(false);

    // API ///////////////////////////////////////////////////////////////////////
    const getGame = (paginate: 'prev' | 'next') => {
        axios.get(`/api/${game_get_api_method}`, {params: {...request_params, per_page: 10, paginate: paginate, start: games.length > 0 ? games[0].id : null , last: games.length > 0 ? games.slice(-1)[0].id : null}}).then(res => {
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
            }
            else if(res.data.status === false) {
                // 失敗時の処理
            }
        })
    }
    /////////////////////////////////////////////////////////////////////////
    
    // Channel ////////////////////////////////////////////////////////////////////
	useEffect(() => {
        getGame('prev');

        if(listen) {
            window.Echo.channel(listening_channel).listen(listening_event, (channel_event: any) => {
                console.log(channel_event);
                if(channel_event.event_type === 'create' || channel_event.event_type === 'update') {
                    setGames((games) => [channel_event.game, ...games.filter((game) => (game.id !== channel_event.game.id))].sort(function(a, b) {
                        return (a.id < b.id) ? 1 : -1;
                    }))
                }
                if(channel_event.event_type === 'destroy') {
                    setGames((games) => games.filter((game) => (game.id !== channel_event.game.id)));
                }
            });
        }
	}, [])
    /////////////////////////////////////////////////////////////////////////////////////

    // Page Change ///////////////////////////////////////////////////////////////////////
    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        getGame(event.currentTarget.value as 'prev' | 'next');
    }
    /////////////////////////////////////////////////////////////////////////

    // DeleteGame //////////////////////////////////////////////////////////////
    const handleDeleteGame = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const game_id = Number(event.currentTarget.getAttribute('data-delete-id'));
        
        const ret = await new Promise<string>((resolve) => {
            setAreYouSureDialogConfig({ onClose: resolve });
        });
        setAreYouSureDialogConfig(undefined);

        if (ret === "ok") {
            axios.post('/api/wordle/game/destroy', {game_id: game_id}).then(res => {
                if(res.data.status === true) {
                    setGames(games.filter((game, index) => (game.id !== game_id)));
                }
                else if (res.data.status === false) {
                    // 失敗時の処理
                }
            })
        }
        if (ret === "cancel") {
        }
    };
    ////////////////////////////////////////////////////////////////////////////////////

    // VSPlay /////////////////////////////////////////////////////////////////////////////
    const handleVSPlayOptionOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setVSTargetGame(games.find((game) => game.id === Number(event.currentTarget.getAttribute('data-game-id'))));
        setIsOpen(true);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <SuspensePrimary open={game_loading} backdrop={false}>
            <Container maxWidth={'md'} disableGutters>
                <ModalPrimary isOpen={modalIsOpen} maxWidth={'540px'}>
                    <VSPlayOption game={vs_target_game} handleModalClose={setIsOpen} />
                    <Button onClick={() => setIsOpen(false)}>Close Modal</Button>
                </ModalPrimary>
                {are_you_sure_dialog_config && (<AreYouSureDialog {...are_you_sure_dialog_config} />)}
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
                        <Grid item container spacing={2} xs={12}>
                            <Grid item xs={12} sx={{minWidth: '100%'}}>
                                <NoItem />
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Container>
        </SuspensePrimary>
    )
}

export default GameList;