import React, { useState, useEffect } from 'react';
import { Button, IconButton, Card } from '@material-ui/core';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { LoadingButton } from '@mui/lab';
import BackspaceIcon from '@mui/icons-material/Backspace';
import Container from '@mui/material/Container';

import WordleInput from './wordlegame/WordleInput';
import WordleInputSelectButtonGroup from './wordlegame/WordleInputSelectButtonGroup';
import WordleBoard from './wordlegame/WordleBoard';
import { ErrataList, GameWords, WordleGameProps } from '../../types/WordleType';

function WordleGame(props: WordleGameProps): React.ReactElement {
    const {
        classes,
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