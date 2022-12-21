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
    return (
        <Container maxWidth={false}>
            <Grid container spacing={2}>
                {/* words表示エリア */}
                <Grid item xs={12}>
                    <WordleBoard game_words={props.game_words} classes={props.classes} />
                </Grid>
                {/* input表示エリア */}
                <Grid item xs={12}>
                    <WordleInput
                        classes={props.classes}
                        turn_flag={props.turn_flag}
                        handleInputStack={props.handleInputStack}
                        errata={props.errata_list}
                        input_stack={props.input_stack}
                        handleTypingStack={props.handleTypingStack}
                        display_input_component={props.display_input_component}
                    />
                </Grid>
                {/* input切り替えボタングループ */}
                <Grid item xs={12}>
                    <WordleInputSelectButtonGroup
                        input={props.game_status.game.input}
                        handleDisplayInputComponentSelect={props.handleDisplayInputComponentSelect}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Stack spacing={2} direction="row">
                        <IconButton color='inherit' onClick={props.handleInputBackSpace}>
                            <BackspaceIcon />
                        </IconButton>
                        <LoadingButton
                            loading={props.loading}
                            variant="contained"
                            onClick={props.handleInputEnter}
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