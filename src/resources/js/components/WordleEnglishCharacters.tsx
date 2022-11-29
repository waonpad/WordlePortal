import React, { useState, useEffect, MouseEventHandler } from 'react';
import { Button, IconButton, Card } from '@material-ui/core';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

type WordleEnglishCharactersProps = {
    classes: any,
    turn_flag: boolean,
    handleInputStack: MouseEventHandler,
    errata: any
}

function WordleEnglishCharacters(props: WordleEnglishCharactersProps): React.ReactElement {

    const english_characters: any[] = [
        'ア', 'カ', 'サ', 'タ', 'ナ', 'ハ', 'マ', 'ヤ', 'ラ', 'ワ',
        'イ', 'キ', 'シ', 'チ', 'ニ', 'ヒ', 'ミ', null, 'リ', null,
        'ウ', 'ク', 'ス', 'ツ', 'ヌ', 'フ', 'ム', 'ユ', 'ル', 'ヲ',
        'エ', 'ケ', 'セ', 'テ', 'ネ', 'ヘ', 'メ', null, 'レ', null,
        'オ', 'コ', 'ソ', 'ト', 'ノ', 'ホ', 'モ', 'ヨ', 'ロ', 'ン',
        'ァ', 'ガ', 'ザ', 'ダ', null, 'バ', 'パ', 'ャ', 'ー', null,
        'ィ', 'ギ', 'ジ', 'ヂ', null, 'ビ', 'ピ', null, null, null,
        'ゥ', 'グ', 'ズ', 'ヅ', 'ッ', 'ブ', 'プ', 'ュ', null, null,
        'ェ', 'ゲ', 'ゼ', 'デ', null, 'ベ', 'ペ', null, null, null,
        'ォ', 'ゴ', 'ゾ', 'ド', null, 'ボ', 'ポ', 'ョ', null, null,
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
                                                    <Button data-character-value={character} disabled={!props.turn_flag} className={props.classes.character + " " + props.classes.input_character + " " + props.classes[`input_character_${props.errata.matchs?.includes(character) ? 'match' : props.errata.exists?.includes(character) ? 'exist' : props.errata.not_exists?.includes(character) ? 'not_exist' : 'plain'}`]} onClick={props.handleInputStack}>{character}</Button>
                                                ) : (
                                                    <Box className={props.classes.character + " " + props.classes.input_character_null} />
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