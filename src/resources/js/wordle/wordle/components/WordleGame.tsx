import React from 'react';
import { Stack, IconButton, Grid, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import BackspaceIcon from '@mui/icons-material/Backspace';
import WordleInput from '@/wordle/wordle/components/wordlegame/WordleInput';
import WordleInputSelectButtonGroup from '@/wordle/wordle/components/wordlegame/WordleInputSelectButtonGroup';
import WordleBoard from '@/wordle/wordle/components/wordlegame/WordleBoard';
import { WordleGameProps } from '@/wordle/types/WordleType';
import { WordleGameStyle } from '../styles/WordleGameStyle';

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
        <Container maxWidth={false}>
            <Grid container spacing={2}>
                {/* words表示エリア */}
                <Grid item xs={12}>
                    <WordleBoard game_words={game_words} classes={classes} />
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
                {/* input切り替えボタングループ */}
                <Grid item xs={12}>
                    <WordleInputSelectButtonGroup
                        input={game_status?.game?.input}
                        handleDisplayInputComponentSelect={handleDisplayInputComponentSelect}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Stack spacing={2} direction="row">
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
            </Grid>
        </Container>
    )
}

export default WordleGame;