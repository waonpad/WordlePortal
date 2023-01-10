import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import { Button, Grid, Container, CircularProgress } from '@mui/material';
import ModalPrimary from '../../common/modal/components/ModalPrimary';
import VSPlayOption from './VSPlayOption';
import { WordleListProps } from '../types/WordleType';
import WordleListItem from './WordleListItem';
import PaginationPrimary from './PaginationPrimary';

type paginate = 'prev' | 'next'

function WordleList(props: WordleListProps): React.ReactElement {
    const {wordle_get_api_method, request_params, response_keys, listen, listening_channel, listening_event} = props;

    const [wordle_loading, setWordleLoading] = useState(true);

    // API ///////////////////////////////////////////////////////////////////////
    const getWordle = (paginate: paginate) => {
        axios.get(`/api/${wordle_get_api_method}`, {params: {...request_params, per_page: 10, paginate: paginate, start: wordles.length > 0 ? wordles[0].id : null , last: wordles.length > 0 ? wordles.slice(-1)[0].id : null}}).then(res => {
            console.log(res);
            if (res.data.status === true) {
                var res_data = res.data;

                response_keys.forEach(key => {
                    res_data = res_data[key];
                });

                setWordles(res_data.reverse());
                setWordleLoading(false);
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
    const [wordles, setWordles] = useState<any[]>([]);

	useEffect(() => {
        console.log(wordle_get_api_method);
        console.log(request_params);

        getWordle('prev');

        if(listen) {
            window.Echo.channel(listening_channel).listen(listening_event, (channel_event: any) => {
                console.log(channel_event);
                if(channel_event.event_type === 'create' || channel_event.event_type === 'update') {
                    console.log('create / update');
                    // 一度削除した後追加しなおし、ソートすることで
                    // 既に配列に存在しているかどうかに関わらず処理をする
                    setWordles((wordles) => [channel_event.wordle, ...wordles.filter((wordle) => (wordle.id !== channel_event.wordle.id))].sort(function(a, b) {
                        return (a.id < b.id) ? 1 : -1;  //オブジェクトの降順ソート
                    }))
                }
                if(channel_event.event_type === 'destroy') {
                    console.log('destroy');
                    setWordles((wordles) => wordles.filter((wordle) => (wordle.id !== channel_event.wordle.id)));
                }
            });
        }
	}, [])
    /////////////////////////////////////////////////////////////////////////////////////

    // Page Change ///////////////////////////////////////////////////////////////////////
    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const paginate = event.currentTarget.value;
        getWordle(paginate as paginate);
    }

    /////////////////////////////////////////////////////////////////////////

    // LikeToggle ////////////////////////////////////////////////////////////////
    const handleLikeToggle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const wordle_id = event.currentTarget.getAttribute('data-like-id');

        axios.post('/api/wordle/liketoggle', {wordle_id: wordle_id}).then(res => {
            console.log(res);
            if(res.data.status === true) {
                const like_status = res.data.like_status;
                const target_wordle = wordles.find((wordle) => (wordle.id == wordle_id));
                target_wordle.like_status = like_status;
                setWordles((wordles) => wordles.map((wordle) => (wordle.id === wordle_id ? target_wordle : wordle)));
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
                setWordles(wordles.filter((wordle, index) => (wordle.id !== target_wordle.id)));
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
    const [vs_target_wordle, setVSTargetWordle] = useState<any>();
    const [modalIsOpen, setIsOpen] = useState(false);

    const handleVSPlayOptionOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const target = wordles.find((wordle) => wordle.id === Number(event.currentTarget.getAttribute('data-wordle-id')));
        console.log(target);
        setVSTargetWordle(target);
        setIsOpen(true);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////

    if(wordle_loading) {
		return (
			<CircularProgress/>
		)
    }
    else {
        return (
            <Container maxWidth={'md'} disableGutters>
                <ModalPrimary isOpen={modalIsOpen}>
                    <VSPlayOption wordle={vs_target_wordle} handleModalClose={setIsOpen} />
                    <Button onClick={() => setIsOpen(false)}>Close Modal</Button>
                </ModalPrimary>
                <Grid container spacing={1}>
                    <Grid item container spacing={2} xs={12}>
                        {wordles.map((wordle, index) => (
                            <Grid item xs={12} key={index} sx={{minWidth: '100%'}}>
                                <WordleListItem
                                    wordle={wordle}
                                    handleLikeToggle={handleLikeToggle}
                                    handleDeleteWordle={handleDeleteWordle}
                                    handleVSPlayOptionOpen={handleVSPlayOptionOpen}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <PaginationPrimary
                            handlePageChange={handlePageChange}
                        />
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

export default WordleList;