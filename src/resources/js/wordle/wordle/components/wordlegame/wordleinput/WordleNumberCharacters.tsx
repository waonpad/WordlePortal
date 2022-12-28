import React from 'react';
import { Button, Box, Grid } from '@mui/material';
import { WordleCharactersProps } from '../../../../types/WordleType';

function WordleNumberCharacters(props: WordleCharactersProps): React.ReactElement {

    const number_characters: any[] = [
        '7', '8', '9',
        '4', '5', '6',
        '1', '2', '3',
        null, '0', null
    ];

    return (
        <Box>
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <Grid container spacing={0.5}>
                        {[...Array(5)].map((item, index) => (
                            <Grid key={index} item xs={12}>
                                <Grid container spacing={0.5} sx={{flexWrap: 'nowrap', justifyContent: 'center'}}>
                                    {(number_characters.slice(index*3, index*3+3) as any[]).map((character: any, index: number) => (
                                        <Grid item key={index}>
                                            {character !== null ? (
                                                    <Button data-character-value={character} disabled={!props.turn_flag} className={props.classes.character + " " + props.classes.input_character + " " + props.classes[`input_character_${props.errata.matchs?.includes(character) ? 'match' : props.errata.exists?.includes(character) ? 'exist' : props.errata.not_exists?.includes(character) ? 'not_exist' : 'plain'}`]} onClick={props.handleInputStack}>{character}</Button>
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

export default WordleNumberCharacters;