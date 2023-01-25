import React from 'react';
import { Box, Grid } from '@mui/material';
import { Button } from '@material-ui/core';
import { WordleCharactersProps } from '@/wordle/types/WordleType';

function WordleJapaneseCharacters(props: WordleCharactersProps): React.ReactElement {
    const {classes, coloring, turn_flag, handleInputStack, errata} = props;

    const japanese_characters: any[] = [
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

    const JapaneseCharactersAsset = (characters: any, place: 'left' | 'right', classes: any, handleInputStack: React.MouseEventHandler, turn_flag: boolean, errata: any) => (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <Grid container spacing={0.5}>
                    {[...Array(5)].map((item, index) => (
                        <Grid key={index} item xs={12}>
                            <Grid container spacing={0.5} sx={{flexWrap: 'nowrap', justifyContent: {xs: 'center', md: place === 'left' ? 'right' : 'left'}}}>
                                {(characters.slice(index*10, index*10+10) as any[]).map((character: any, index: number) => (
                                    <Grid item key={index}>
                                        {character !== null ? (
                                                <Button data-character-value={character} disabled={!turn_flag} className={classes.character + " " + classes.input_character + " " + classes[`input_character_${!coloring ? 'plain' : errata.matchs?.includes(character) ? 'match' : errata.exists?.includes(character) ? 'exist' : errata.not_exists?.includes(character) ? 'not_exist' : 'plain'}`]} onClick={handleInputStack}>{character}</Button>
                                            ) : (
                                                <Box className={classes.character + " " + classes.input_character_null} />
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
    );

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    {JapaneseCharactersAsset(japanese_characters.slice(0, 50), 'left', classes, handleInputStack, turn_flag, errata)}
                </Grid>
                <Grid item xs={12} md={6}>
                    {JapaneseCharactersAsset(japanese_characters.slice(50, 100), 'right', classes, handleInputStack, turn_flag, errata)}
                </Grid>
            </Grid>
        </Box>
    )
}

export default WordleJapaneseCharacters;