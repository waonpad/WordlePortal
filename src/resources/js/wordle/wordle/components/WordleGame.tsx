import React from 'react';
import { Stack, IconButton, Grid, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import BackspaceIcon from '@mui/icons-material/Backspace';
import WordleInput from '@/wordle/wordle/components/wordlegame/WordleInput';
import WordleInputSelectButtonGroup from '@/wordle/wordle/components/wordlegame/WordleInputSelectButtonGroup';
import WordleBoard from '@/wordle/wordle/components/wordlegame/WordleBoard';
import { WordleGameProps } from '@/wordle/types/WordleType';
import { WordleGameStyle } from '@/wordle/wordle/styles/WordleGameStyle';
import WordleGamePrimaryDetail from './WordlGamePrmaryDetail';

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
    } = props;

    const classes = WordleGameStyle();

    return (
        <Container sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Grid container spacing={2} sx={{maxWidth: '910px'}}>
                {/* 情報表示エリア */}
                <Grid item xs={12}>
                    <WordleGamePrimaryDetail game={game_status.game} />
                </Grid>
                {/* words表示エリア */}
                <Grid item xs={12}>
                    <WordleBoard game_words={game_words} classes={classes} />
                </Grid>
                <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {/* input切り替えボタングループ */}
                    <WordleInputSelectButtonGroup
                        input={game_status?.game?.input}
                        handleDisplayInputComponentSelect={handleDisplayInputComponentSelect}
                    />
                    {/* 削除と送信 */}
                    <Stack spacing={2} direction="row" sx={{ml: 5}}>
                        <IconButton color='inherit' onClick={handleInputBackSpace}>
                            <BackspaceIcon />
                        </IconButton>
                        <LoadingButton
                            loading={loading}
                            variant="contained"
                            onClick={handleInputEnter}
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
            </Grid>
        </Container>
    )
}

export default WordleGame;