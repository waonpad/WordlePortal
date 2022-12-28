import React from 'react';
import { CircularProgress } from '@mui/material';
import { WordleInputProps } from '../../../types/WordleType';
import WordleJapaneseCharacters from './wordleinput/WordleJapaneseCharacters';
import WordleEnglishCharacters from './wordleinput/WordleEnglishCharacters';
import WordleNumberCharacters from './wordleinput/WordleNumberCharacters';
import WordleTyping from './wordleinput/WordleTyping';

function WordleInput(props: WordleInputProps): React.ReactElement {

    return (
        <React.Fragment>
            {
                props.display_input_component === 'japanese' ?
                    <WordleJapaneseCharacters
                        classes={props.classes}
                        turn_flag={props.turn_flag}
                        handleInputStack={props.handleInputStack}
                        errata={props.errata}
                    />
                :
                props.display_input_component === 'english' ?
                    <WordleEnglishCharacters
                        classes={props.classes}
                        turn_flag={props.turn_flag}
                        handleInputStack={props.handleInputStack}
                        errata={props.errata}
                    />
                :
                props.display_input_component === 'number' ?
                    <WordleNumberCharacters
                        classes={props.classes}
                        turn_flag={props.turn_flag}
                        handleInputStack={props.handleInputStack}
                        errata={props.errata}
                    />
                :
                props.display_input_component === 'typing' ?
                    <WordleTyping
                        classes={props.classes}
                        turn_flag={props.turn_flag}
                        input_stack={props.input_stack}
                        handleTypingStack={props.handleTypingStack}
                    />
                :
                <CircularProgress color="inherit" />
            }
        </React.Fragment>
    )
}

export default WordleInput;