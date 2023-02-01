import React, { useState } from 'react';
import axios from 'axios';
import { Stack, IconButton, Grid, Container, Button, TextField, Dialog, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, SubmitHandler } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BackspaceIcon from '@mui/icons-material/Backspace';
import PersonIcon from '@mui/icons-material/Person';
import WordleInput from '@/wordle/wordle/components/wordlegame/WordleInput';
import WordleInputSelectButtonGroup from '@/wordle/wordle/components/wordlegame/WordleInputSelectButtonGroup';
import WordleBoard from '@/wordle/wordle/components/wordlegame/WordleBoard';
import { WordleGameProps } from '@/wordle/types/WordleType';
import { WordleGameStyle } from '@/wordle/wordle/styles/WordleGameStyle';
import WordleGamePrimaryDetail from '@/wordle/wordle/components/WordlGamePrmaryDetail';
import WordleGameUserList from '@/wordle/wordle/components/wordlegameuserlist/WordleGameUserList';
import WordleCommentList from '@/wordle/components/wordlecommentlist/components/WordleCommentList';
import ButtonGroupPrimary from '@/common/button/buttongroupprimary/components/ButtonGroupPrimary';
import { WordleCommentData, WordleCommentErrorData } from '@/wordle/types/WordleCommentType';

function WordleGame(props: WordleGameProps): React.ReactElement {
    const {
        game_status,
        game_words,
        turn_flag,
        handleInputStack,
        input_stack,
        handleTypingStack,
        handleDisplayInputComponentSelect,
        handleInputBackSpace,
        handleInputEnter,
        loading,
        errata_list,
        display_input_component,
        firebase_game_data
    } = props;

    const classes = WordleGameStyle();

    const [wordle_comment_submit_loading, setWordleCommentSubmitLoading] = useState(false);
    const [memberlist_open, setMemberListOpen] = useState<boolean>(false);
    const basicSchemaWordleComment = Yup.object().shape({
        comment: Yup.string().max(255),
    });
    
    const { register: registerWordleComment, handleSubmit: handleSubmitWordleComment, setError: setErrorWordleComment, clearErrors: clearErrorsWordleComment, formState: { errors: errorsWordleComment } } = useForm<WordleCommentData>({
        mode: 'onBlur',
        resolver: yupResolver(basicSchemaWordleComment)
    });

    const handleOpenMemberList = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setMemberListOpen(true);
    }

    const handleCloseMemberList = () => {
        setMemberListOpen(false);
    }

    // Submit Wordle Comment ////////////////////////////////////////////////////////////////////
    const onSubmitWordleComment: SubmitHandler<WordleCommentData> = (data: WordleCommentData) => {
        data.wordle_id = Number(game_status?.game?.wordle_id);
        setWordleCommentSubmitLoading(true);

        axios.post('/api/wordle/comment/upsert', data).then(res => {
            if (res.data.status === true) {
                setWordleCommentSubmitLoading(false)
            }
            else {
                const obj: WordleCommentErrorData = res.data.validation_errors;
                (Object.keys(obj) as (keyof WordleCommentErrorData)[]).forEach((key) => setErrorWordleComment(key, {
                    type: 'manual',
                    message: obj[key]
                }))
    
                setWordleCommentSubmitLoading(false)
            }
        })
    }
    /////////////////////////////////////////////////////////////////////////////////////

    return (
        <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Dialog
                onClose={handleCloseMemberList}
                open={memberlist_open}
                PaperProps={{
                    style: {width: '600px', maxWidth: '90%'}
                }}
                BackdropProps={{
                    style: {
                        backgroundColor: 'rgba(255, 255, 255, 0.75)'
                    },
                }}
            >
                <WordleGameUserList
                    users={firebase_game_data.users}
                    firebase_game_data={firebase_game_data}
                />
            </Dialog>
            <Grid container spacing={2} sx={{maxWidth: '910px'}}>
                {/* 情報表示エリア */}
                <Grid item xs={12}>
                    <WordleGamePrimaryDetail game_status={game_status} />
                </Grid>
                {/* words表示エリア */}
                <Grid item xs={12}>
                    <WordleBoard game_words={game_words} classes={classes} />
                </Grid>
                {/* ボタンエリア */}
                <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <IconButton sx={{p: 0, mr: 3}} onClick={handleOpenMemberList}>
                       <PersonIcon fontSize='large' />
                    </IconButton>
                    {/* input切り替えボタングループ */}
                    <WordleInputSelectButtonGroup
                        input={game_status?.game?.input}
                        display_input_component={display_input_component}
                        handleDisplayInputComponentSelect={handleDisplayInputComponentSelect}
                    />
                    {/* 削除と送信 */}
                    <Stack spacing={2} direction="row" sx={{ml: 5}}>
                        <IconButton sx={{p: 0}} onClick={handleInputBackSpace} disabled={game_status?.game?.status === 'end'}>
                            <BackspaceIcon fontSize='large' />
                        </IconButton>
                        <LoadingButton
                            loading={loading}
                            variant="contained"
                            onClick={handleInputEnter}
                            disabled={game_status?.game?.status === 'end'}
                        >
                            Enter
                        </LoadingButton>
                    </Stack>
                </Grid>
                {/* input表示エリア */}
                <Grid item xs={12}>
                    <WordleInput
                        coloring={game_status.game.coloring}
                        classes={classes}
                        turn_flag={turn_flag}
                        handleInputStack={handleInputStack}
                        errata={errata_list}
                        input_stack={input_stack}
                        handleTypingStack={handleTypingStack}
                        display_input_component={display_input_component}
                    />
                </Grid>
                <Grid item container xs={12} spacing={1} sx={{display: game_status.game.status === 'end' ? 'flex' : 'none'}}>
                    <Grid item xs={12} smd={game_status.game.wordle_id === null ? 12 : 6}>
                        <WordleGameUserList
                            users={firebase_game_data.users}
                            firebase_game_data={firebase_game_data}
                        />
                    </Grid>
                    <Grid item container xs={12} smd={6} spacing={2} sx={{display: game_status.game.wordle_id === null ? 'none' : 'block'}}>
                        {/* コメント投稿 */}
                        <Grid item xs={12}>
                            <Box component="form" noValidate onSubmit={handleSubmitWordleComment(onSubmitWordleComment)}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            multiline
                                            rows={4}
                                            id="comment"
                                            label="Comment"
                                            autoComplete="comment"
                                            {...registerWordleComment('comment')}
                                            error={errorsWordleComment.comment ? true : false}
                                            helperText={errorsWordleComment.comment?.message}
                                        />
                                    </Grid>
                                </Grid>
                                <LoadingButton
                                    type="submit"
                                    loading={wordle_comment_submit_loading}
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 2, mb: 2 }}
                                >
                                    Comment Submit
                                </LoadingButton>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <WordleCommentList
                                head={
                                    <ButtonGroupPrimary
                                        head={true}
                                        items={[
                                            {
                                                text: 'Comments',
                                                value: 'wordle_comments',
                                                active: false
                                            },
                                        ]}
                                    />
                                }
                                request_config={{
                                    api_url: 'wordle/comment/comments',
                                    params: {wordle_id: game_status?.game?.wordle_id},
                                    response_keys: ['wordle_comments'],
                                    listening_channel: `wordle_comment.${game_status?.game?.wordle_id}`,
                                    listening_event: 'WordleCommentEvent'
                                }}
                                listen={true}
                                no_item_text={'No Comments'}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}

export default WordleGame;