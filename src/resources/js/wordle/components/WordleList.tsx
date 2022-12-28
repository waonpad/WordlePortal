import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import ModalPrimary from '../../common/modal/components/ModalPrimary';
import VSPlayOption from './VSPlayOption';
import { WordleListProps } from '../types/WordleType';
import WordleListItem from './WordleListItem';

function WordleList(props: WordleListProps): React.ReactElement {
    const {wordle_get_api_method, request_params, response_keys, listen, listening_channel, listening_event} = props;

    const [wordle_loading, setWordleLoading] = useState(true);
    
    // Channel ////////////////////////////////////////////////////////////////////
    const [wordles, setWordles] = useState<any[]>([]);

	useEffect(() => {
        axios.get(`/api/${wordle_get_api_method}`, {params: request_params}).then(res => {
            if (res.status === 200) {
                console.log(res);
                var res_data = res.data;

                response_keys.forEach(key => {
                    res_data = res_data[key];
                });

                setWordles(res_data.reverse());
                setWordleLoading(false);
                console.log('投稿取得完了');
            }
        });

        if(listen) {
            window.Echo.channel(listening_channel).listen(listening_event, (channel_event: any) => {
                console.log(channel_event);
                if(channel_event.event_type === 'create' || 'update') {
                    // 一度削除した後追加しなおし、ソートすることで
                    // 既に配列に存在しているかどうかに関わらず処理をする
                    setWordles((wordles) => [channel_event.wordle, ...wordles.filter((wordle) => (wordle.id !== channel_event.wordle.id))].sort(function(a, b) {
                        return (a.id < b.id) ? 1 : -1;  //オブジェクトの降順ソート
                    }))
                }
                if(channel_event.event_type === 'destroy') {
                    setWordles((wordles) => wordles.filter((wordle) => (wordle.id !== channel_event.wordle.id)));
                }
            });
        }
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
                <Grid container spacing={2}>
                    {wordles.map((wordle, index) => (
                        <WordleListItem
                            key={index}
                            wordle={wordle}
                            handleLikeToggle={handleLikeToggle}
                            handleDeleteWordle={handleDeleteWordle}
                            handleVSPlayOptionOpen={handleVSPlayOptionOpen}
                        />
                    ))}
                </Grid>
            </Container>
        )
    }
}

export default WordleList;