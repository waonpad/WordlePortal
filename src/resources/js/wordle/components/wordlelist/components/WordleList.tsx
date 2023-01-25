import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import axios from 'axios';
import { Button, Grid, Container, CircularProgress } from '@mui/material';
import ModalPrimary from '@/common/modal/modalprimary/components/ModalPrimary';
import VSPlayOption from '@/wordle/components/VSPlayOption';
import { WordleListProps } from '@/wordle/types/WordleType';
import WordleListItem from '@/wordle/components/wordlelist/components/WordleListItem';
import PaginationPrimary from '@/common/pagination/paginationprimary/components/PaginationPrimary';
import SimpleTextCard from '@/common/card/simpletextcard/components/SimpleTextCard';
import AreYouSureDialog from '@/common/dialog/areyousuredialog/components/AreYouSureDialog';
import { AreYouSureDialogProps } from '@/common/dialog/areyousuredialog/types/AreYouSureDialogType';
import firebaseApp from '@/contexts/FirebaseConfig';
import { serverTimestamp } from 'firebase/database';
import { VSPlayOptionData } from '@/wordle/types/VSPlayOptionType';
import { useAuth } from '@/contexts/AuthContext';
import SuspensePrimary from '@/common/suspense/suspenseprimary/components/SuspensePrimary';
import { useWindowDimensions } from '@/common/hooks/WindowDimensions';
import NewPostSnackbar from '@/common/snackbar/newpostsnackbar/components/NewPostSnackbar';

declare var window: {
    Echo: any;
    scrollY: any;
    addEventListener: any;
    removeEventListener: any;
}

function WordleList(props: WordleListProps): React.ReactElement {
    const {request_config, listen} = props;

    const [wordle_loading, setWordleLoading] = useState(true);
    const history = useHistory();
    const auth = useAuth();
    const {width, height} = useWindowDimensions();
    const wordle_list_ref = useRef(null);
    const [wordles, setWordles] = useState<any[]>([]);
    const [are_you_sure_dialog_config, setAreYouSureDialogConfig] = useState<AreYouSureDialogProps | undefined>();
    const [vs_target_wordle, setVSTargetWordle] = useState<any>();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [snackbar_position, setSnackbarPosition] = useState({top: 0, left: 0});
    const [snackbar_open, setSnackbarOpen] = useState<boolean>(false);

    useEffect(() => {
        if(wordle_list_ref.current !== null) {
            const client_rect = (wordle_list_ref.current as any).getBoundingClientRect();
            setSnackbarPosition({ top: client_rect.top, left: client_rect.left + client_rect.width / 2 });
        }

        const handleScroll = () => {
            if (wordle_list_ref.current !== null) {
                const client_rect = (wordle_list_ref.current as any).getBoundingClientRect();
                setSnackbarPosition({ top: client_rect.top, left: client_rect.left + client_rect.width / 2 });
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
    }, [wordle_loading, wordle_list_ref, width, height])

    // API ///////////////////////////////////////////////////////////////////////
    const getWordles = (paginate: 'prev' | 'next') => {
        axios.get(`/api/${request_config.api_url}`, {params: {...request_config.params, per_page: 10, paginate: paginate, start: wordles.length > 0 ? wordles[0].id : null , last: wordles.length > 0 ? wordles.slice(-1)[0].id : null}}).then(res => {
            if (res.data.status === true) {
                var res_data = res.data;
                request_config.response_keys.forEach(key => {
                    res_data = res_data[key];
                });

                setWordles(res_data.reverse());
                setWordleLoading(false);
            }
            else if(res.data.status === false) {
                // 失敗時の処理
            }
        })
    }
    /////////////////////////////////////////////////////////////////////////
    
    // Channel ////////////////////////////////////////////////////////////////////
	useEffect(() => {
        getWordles('prev');
        if(listen) {
            window.Echo.channel(request_config.listening_channel).listen(request_config.listening_event, (channel_event: any) => {
                console.log(channel_event);
                if(channel_event.event_type === 'create' || channel_event.event_type === 'update') {
                    // setWordles((wordles) => [channel_event.wordle, ...wordles.filter((wordle) => (wordle.id !== channel_event.wordle.id))].sort(function(a, b) {
                    //     return (a.id < b.id) ? 1 : -1;
                    // }))
                }
                if(channel_event.event_type === 'destroy') {
                    setWordles((wordles) => wordles.filter((wordle) => (wordle.id !== channel_event.wordle.id)));
                }
            });
        }
	}, [])
    /////////////////////////////////////////////////////////////////////////////////////

    // new /////////////////////////////////////////////////////////////////////////
    const getWordlesLeatest = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        console.log('leatest');

        // 更新処理
        // wordle_loadingをtrueにしてwordlesを[]にする?

        setSnackbarOpen(false);
    }

    const handleSnackbarCloce = (event: React.SyntheticEvent | Event) => {
        setSnackbarOpen(false);
    }

    const test = () => {
        setSnackbarOpen(true);
    }

    // Page Change ///////////////////////////////////////////////////////////////////////
    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        getWordles(event.currentTarget.value as 'prev' | 'next');
    }

    /////////////////////////////////////////////////////////////////////////

    // LikeToggle ////////////////////////////////////////////////////////////////
    const handleLikeToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const wordle_id = Number(event.currentTarget.getAttribute('data-like-id'));

        axios.post('/api/wordle/liketoggle', {wordle_id: wordle_id}).then(res => {
            if(res.data.status === true) {
                setWordles((wordles) => wordles.map((wordle) => (wordle.id === wordle_id ? {...wordle, like_status: res.data.like_status} : wordle)));
            }
            else if (res.data.status === false) {
                // 失敗時の処理
            }
        })
    };
    //////////////////////////////////////////////////////////////////////////////////////////

    // Deletewordle //////////////////////////////////////////////////////////////
    const handleDeleteWordle = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const wordle_id = Number(event.currentTarget.getAttribute('data-delete-id'));
        
        const ret = await new Promise<string>((resolve) => {
            setAreYouSureDialogConfig({ onClose: resolve });
        });
        setAreYouSureDialogConfig(undefined);

        if (ret === "ok") {
            axios.post('/api/wordle/destroy', {wordle_id: wordle_id}).then(res => {
                if(res.data.status === true) {
                    setWordles(wordles.filter((wordle, index) => (wordle.id !== wordle_id)));
                }
                else if (res.data.status === false) {
                    // 失敗時の処理
                }
            })
        }
    };
    ////////////////////////////////////////////////////////////////////////////////////

    // SinglePlay ///////////////////////////////////////////////////////////////////////
    const handleSinglePlayStart = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const data: VSPlayOptionData = {
            game_id: null,
            wordle_id: Number(event.currentTarget.getAttribute('data-wordle-id')),
            max_participants: 1,
            laps: 10,
            visibility: false,
            answer_time_limit: null,
            coloring: true,
            submit: '',
        }
        
        axios.post('/api/wordle/game/upsert', data).then(res => {
            if(res.data.status === true) {
                firebaseApp.database().ref(`wordle/games/${res.data.game.uuid}`).set({
                    created_at: serverTimestamp(),
                    host: res.data.game.game_create_user_id,
                    status: 'wait',
                    joined: false,
                });

                history.push(`/wordle/game/play/${res.data.game.uuid}`);
            }
            else if(res.data.status === false) {
                // 失敗時の処理
                swal("処理失敗", res.data.message, "error");
            }
        })
    }
    /////////////////////////////////////////////////////////////////////////

    // VSPlay /////////////////////////////////////////////////////////////////////////////
    const handleVSPlayOptionOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if(auth!.user === null) {
            history.push('/login');
            return;
        }
        
        setVSTargetWordle(wordles.find((wordle) => wordle.id === Number(event.currentTarget.getAttribute('data-wordle-id'))));
        setIsOpen(true);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////

    if(wordle_loading || wordle_list_ref === null) {
        return (<SuspensePrimary open={true} backdrop={false} />)
    }
    return (
        <Container maxWidth={'md'} disableGutters ref={wordle_list_ref}>
            <Button onClick={test}>testbutton</Button>
            <ModalPrimary isOpen={modalIsOpen} maxWidth={'540px'}>
                <VSPlayOption wordle={vs_target_wordle} handleModalClose={setIsOpen} />
                <Button onClick={() => setIsOpen(false)}>Close Modal</Button>
            </ModalPrimary>
            {are_you_sure_dialog_config && (<AreYouSureDialog {...are_you_sure_dialog_config} />)}
            <NewPostSnackbar
                open={snackbar_open}
                handleApiGet={getWordlesLeatest}
                handleClose={handleSnackbarCloce}
                message={'New Wordle'}
                position={snackbar_position}
            />
            <Grid container spacing={1}>
                <Grid item container spacing={2} xs={12}>
                    {wordles.map((wordle, index) => (
                        <Grid item xs={12} key={index} sx={{minWidth: '100%'}}>
                            <WordleListItem
                                wordle={wordle}
                                handleLikeToggle={handleLikeToggle}
                                handleDeleteWordle={handleDeleteWordle}
                                handleSinglePlayStart={handleSinglePlayStart}
                                handleVSPlayOptionOpen={handleVSPlayOptionOpen}
                            />
                        </Grid>
                    ))}
                </Grid>
                {
                    wordles.length > 0 ?
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

export default WordleList;