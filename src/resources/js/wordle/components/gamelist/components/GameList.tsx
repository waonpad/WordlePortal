import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { Button, Grid, Container, CircularProgress } from '@mui/material';
import axios from 'axios';
import ModalPrimary from '@/common/modal/modalprimary/components/ModalPrimary';
import VSPlayOption from '@/wordle/components/VSPlayOption';
import { GameListProps } from '@/wordle/types/GameType';
import GameListItem from '@/wordle/components/gamelist/components/GameListItem';
import PaginationPrimary from '@/common/pagination/paginationprimary/components/PaginationPrimary';
import SimpleTextCard from '@/common/card/simpletextcard/components/SimpleTextCard';
import AreYouSureDialog from '@/common/dialog/areyousuredialog/components/AreYouSureDialog';
import { AreYouSureDialogProps } from '@/common/dialog/areyousuredialog/types/AreYouSureDialogType';
import SuspensePrimary from '@/common/suspense/suspenseprimary/components/SuspensePrimary';
import NewPostSnackbar from '@/common/snackbar/newpostsnackbar/components/NewPostSnackbar';
import { useElementClientRect } from '@/common/hooks/ElementClientRect';

declare var window: {
    Echo: any;
}

function GameList(props: GameListProps): React.ReactElement {
    const {game_status, request_config, listen} = props;

    const [game_loading, setGameLoading] = useState(true);
    const [games, setGames] = useState<any[]>([]);
    const [are_you_sure_dialog_config, setAreYouSureDialogConfig] = useState<AreYouSureDialogProps | undefined>();
    const [vs_target_game, setVSTargetGame] = useState<any>();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [snackbar_open, setSnackbarOpen] = useState<boolean>(false);
    const {ref, client_rect, setDOMLoading} = useElementClientRect();

    useEffect(() => {
        setDOMLoading(game_loading);
    }, [game_loading])

    // API ///////////////////////////////////////////////////////////////////////
    const getGames = (paginate: 'prev' | 'next', latest?: boolean) => {
        axios.get(`/api/${request_config.api_url}`, {params: {...request_config.params, game_status: game_status, per_page: 10, paginate: paginate, start: games.length === 0 || latest ? null : games[0].id, last: games.length > 0 ? games.slice(-1)[0].id : null}}).then(res => {
            if (res.data.status === true) {
                var res_data = res.data;
                request_config.response_keys.forEach(key => {
                    res_data = res_data[key];
                });

                setGames(res_data.reverse());
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
        getGames('prev');

        if(listen) {
            window.Echo.channel(request_config.listening_channel).listen(request_config.listening_event, (channel_event: any) => {
                console.log(channel_event);
                if(channel_event.event_type === 'create') {
                    setSnackbarOpen(true); // 新規投稿があったらsnackbarで通知する
                }
                if(channel_event.event_type === 'update') {
                    setGames((games) => games.map((game) => (
                        game.id === channel_event.game.id ? channel_event.game : game
                    ))); // 投稿の更新があったらリアルタイムに更新する
                }
                if(channel_event.event_type === 'destroy') {
                    // 削除された時の処理
                }
            });
        }
	}, [])
    /////////////////////////////////////////////////////////////////////////////////////

    // new /////////////////////////////////////////////////////////////////////////
    const getGamesLeatest = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        getGames('prev', true);
        setSnackbarOpen(false);
    }

    const handleSnackbarCloce = (event: React.SyntheticEvent | Event) => {
        setSnackbarOpen(false);
    }
    /////////////////////////////////////////////////////////////////////////

    // Page Change ///////////////////////////////////////////////////////////////////////
    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        getGames(event.currentTarget.value as 'prev' | 'next');
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

    if(game_loading || ref === null) {
        return (<SuspensePrimary open={true} backdrop={false} />)
    }
    return (
        <Container maxWidth={'md'} disableGutters ref={ref} sx={{position: 'relative'}}>
            <ModalPrimary isOpen={modalIsOpen} maxWidth={'540px'}>
                <VSPlayOption game={vs_target_game} handleModalClose={setIsOpen} />
                <Button onClick={() => setIsOpen(false)}>Close Modal</Button>
            </ModalPrimary>
            {are_you_sure_dialog_config && (<AreYouSureDialog {...are_you_sure_dialog_config} />)}
            <NewPostSnackbar
                open={snackbar_open}
                handleApiGet={getGamesLeatest}
                handleClose={handleSnackbarCloce}
                message={'New Game'}
                position={{
                    top: 0,
                    left: client_rect ? client_rect!.width / 2 : 0
                }}
            />
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
                            <SimpleTextCard text={'No Item'} />
                        </Grid>
                    </Grid>
                }
            </Grid>
        </Container>
    )
}

export default GameList;