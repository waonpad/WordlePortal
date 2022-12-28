import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import Chip from "@material-ui/core/Chip"; // v4
import { WordleBoardProps } from '../../../types/WordleType';

function WordleBoard(props: WordleBoardProps): React.ReactElement {

    const BoardAsset = (game_words: any, place: 'left' | 'right', classes: any) => (
        <Grid container spacing={1}>
            {game_words.map((word: any, index: number) => (
                <Grid key={index} item xs={12}>
                    <Grid container spacing={0.5} sx={{flexWrap: 'nowrap', justifyContent: {xs: 'center', md: place === 'left' ? 'right' : 'left'}}}>
                        {(word).map((character: {errata: 'match' | 'exist' | 'not_exist' | 'plain', character: string}, index: number) => (
                            <Grid item key={index}>
                                <Chip className={classes.character + " " + classes.board_character + " " + classes[`board_character_${character.errata}`]} key={index} label={
                                    <Typography sx={{fontWeight: 'bold'}}>{character.character}</Typography>
                                } />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            ))}
        </Grid>
    )

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    {BoardAsset((props.game_words.slice(0, Math.ceil(props.game_words.length / 2))), 'left', props.classes)}
                </Grid>
                <Grid item xs={12} md={6}>
                    {BoardAsset((props.game_words.slice(Math.ceil(props.game_words.length / 2), props.game_words.length)), 'right', props.classes)}
                </Grid>
            </Grid>
        </Box>
    )
}

export default WordleBoard; 