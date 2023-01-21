import React from 'react';
import { CircularProgress } from '@mui/material';
import { WordleInputProps } from '@/wordle/types/WordleType';
import WordleJapaneseCharacters from '@/wordle/wordle/components/wordlegame/wordleinput/WordleJapaneseCharacters';
import WordleEnglishCharacters from '@/wordle/wordle/components/wordlegame/wordleinput/WordleEnglishCharacters';
import WordleNumberCharacters from '@/wordle/wordle/components/wordlegame/wordleinput/WordleNumberCharacters';
import WordleTyping from '@/wordle/wordle/components/wordlegame/wordleinput/WordleTyping';

function WordleInput(props: WordleInputProps): React.ReactElement {
    const {classes, turn_flag, handleInputStack, errata, input_stack, handleTypingStack, display_input_component} = props;

    return (
        <React.Fragment>
            {
                display_input_component === 'japanese' ?
                    <WordleJapaneseCharacters
                        classes={classes}
                        turn_flag={turn_flag}
                        handleInputStack={handleInputStack}
                        errata={errata}
                    />
                :
                display_input_component === 'english' ?
                    <WordleEnglishCharacters
                        classes={classes}
                        turn_flag={turn_flag}
                        handleInputStack={handleInputStack}
                        errata={errata}
                    />
                :
                display_input_component === 'number' ?
                    <WordleNumberCharacters
                        classes={classes}
                        turn_flag={turn_flag}
                        handleInputStack={handleInputStack}
                        errata={errata}
                    />
                :
                display_input_component === 'typing' ?
                    <WordleTyping
                        classes={classes}
                        turn_flag={turn_flag}
                        input_stack={input_stack}
                        handleTypingStack={handleTypingStack}
                    />
                :
                <CircularProgress color="inherit" />
            }
        </React.Fragment>
    )
}

export default WordleInput;