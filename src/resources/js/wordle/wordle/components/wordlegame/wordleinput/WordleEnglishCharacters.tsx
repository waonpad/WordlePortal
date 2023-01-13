import React from 'react';
import { Button, Box, Grid } from '@mui/material';
import { WordleCharactersProps } from '../../../../types/WordleType';

function WordleEnglishCharacters(props: WordleCharactersProps): React.ReactElement {
    const {classes, turn_flag, handleInputStack, errata} = props;

    const english_characters: any[] = [
        'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
        'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', null,
        'Z', 'X', 'C', 'V', 'B', 'N', 'M', null, null, null
    ];

    return (
        <Box>
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <Grid container spacing={0.5}>
                        {[...Array(5)].map((item, index) => (
                            <Grid key={index} item xs={12}>
                                <Grid container spacing={0.5} sx={{flexWrap: 'nowrap', justifyContent: 'center'}}>
                                    {(english_characters.slice(index*10, index*10+10) as any[]).map((character: any, index: number) => (
                                        <Grid item key={index}>
                                            {character !== null ? (
                                                    <Button data-character-value={character} disabled={!turn_flag} className={classes.character + " " + classes.input_character + " " + classes[`input_character_${errata.matchs?.includes(character) ? 'match' : errata.exists?.includes(character) ? 'exist' : errata.not_exists?.includes(character) ? 'not_exist' : 'plain'}`]} onClick={handleInputStack}>{character}</Button>
                                                ) : (
                                                    <Box></Box>
                                                )
                                            }
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default WordleEnglishCharacters;