import React from 'react';
import { Button, ButtonGroup, Box } from '@mui/material';
import AbcIcon from '@mui/icons-material/Abc';
import PinIcon from '@mui/icons-material/Pin';
import KeyboardIcon from '@mui/icons-material/Keyboard';

type WordleInputSelectButtonGroupProps = {
    input: any[],
    handleDisplayInputComponentSelect: any
}

function WordleInputSelectButtonGroup(props: WordleInputSelectButtonGroupProps): React.ReactElement {

    return (
        <Box>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                {/* {(game.input as any[]).map((input, index) => ( */}
                {(['japanese', 'english', 'number', 'typing']).map((input, index) => (
                    <Button
                        key={index}
                        value={input}
                        onClick={props.handleDisplayInputComponentSelect}
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