import React, { useState, useEffect } from 'react';
import { Button, IconButton, Card } from '@material-ui/core';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { LoadingButton } from '@mui/lab';
import BackspaceIcon from '@mui/icons-material/Backspace';

import WordleInput from './wordlegame/WordleInput';
import WordleInputSelectButtonGroup from './wordlegame/WordleInputSelectButtonGroup';
import WordleBoard from './wordlegame/WordleBoard';
import { ErrataList, GameWords } from '../../types/WordleType';

type WordleGameProps = {
    theme: any,
    classes: any,
    game: any,
    game_status: any,
    game_words: GameWords
    turn_flag: boolean,
    handleInputStack: any,
    input_stack: any,
    handleTypingStack: any,
    handleDisplayInputComponentSelect: any,
    handleInputBackSpace: any,
    handleInputEnter: any,
    loading: boolean,
    errata_list: ErrataList,
    display_input_component: 'japanese' | 'english' | 'number' | 'typing' | null,
}

function WordleGame(props: WordleGameProps): React.ReactElement {
    return (
        <ThemeProvider theme={props.theme}>
            <Container component="main" maxWidth={false} sx={{padding: 0}}>
                <CssBaseline />
                <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >
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
                                input={props.game.input}
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
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default WordleGame;