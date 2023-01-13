import React from 'react';
import { TextField, Box, Grid } from '@mui/material';
import { WordleTypingProps } from '../../../../types/WordleType';

function WordleTyping(props: WordleTypingProps): React.ReactElement {
    const {classes, turn_flag, input_stack, handleTypingStack} = props;
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Grid container spacing={0} sx={{alignItems: 'center', justifyContent: 'center'}}>
                <Grid item sx={{width: '400px'}}>
                    <TextField
                        fullWidth
                        id="wordle-typing"
                        label="Input Here"
                        autoComplete="wordle-typing"
                        value={input_stack.map((character: any) => (character['character'])).join('')}
                        disabled={!turn_flag}
                        onChange={handleTypingStack}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default WordleTyping;