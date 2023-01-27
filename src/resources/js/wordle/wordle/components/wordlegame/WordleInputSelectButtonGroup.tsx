import React from 'react';
import { Button, ButtonGroup, Box } from '@mui/material';
import AbcIcon from '@mui/icons-material/Abc';
import PinIcon from '@mui/icons-material/Pin';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { WordleInputSelectButtonGroupProps } from '@/wordle/types/WordleType';

function WordleInputSelectButtonGroup(props: WordleInputSelectButtonGroupProps): React.ReactElement {
    const {input, display_input_component, handleDisplayInputComponentSelect} = props;

    return (
        <Box>
            <ButtonGroup sx={{backgroundColor: '#fff'}}>
                {(input as any[]).map((input, index) => (
                // {/* {(['japanese', 'english', 'number', 'typing']).map((input, index) => ( */}
                    <Button
                        key={index}
                        value={input}
                        variant={input === display_input_component ? 'contained' : 'outlined'}
                        onClick={handleDisplayInputComponentSelect}
                        sx={{fontWeight: 'bold'}}
                    >
                        {
                            input === 'japanese' ? 'あ'
                            : input === 'english' ? <AbcIcon />
                            : input === 'number' ? <PinIcon />
                            : input === 'typing' ? <KeyboardIcon />
                            : ''
                        }
                    </Button>
                ))}
            </ButtonGroup>
        </Box>
    )
}

export default WordleInputSelectButtonGroup;