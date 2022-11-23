import React, { useState, useEffect, MouseEventHandler } from 'react';
import { Button, IconButton, Card } from '@material-ui/core';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

type WordleJapaneseCharactersProps = {
    classes: any,
    turn_flag: boolean,
    handleInputStack: MouseEventHandler
}

// TODO: game_logsの情報を元にerrataを更新する処理を追加する
// matchはexistにならない, matchはnot_existにならない, existはnot_existにならない

function WordleJapaneseCharacters(props: WordleJapaneseCharactersProps): React.ReactElement {

    const base_japanese_characters: any[] = [
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

    const initial_japanese_characters_state = (base_japanese_characters as any[]).map(character => ({
        character: character,
        errata: 'plain'
    }));

    const [japanese_characters, setJapanseCharacters] = useState<any[]>(initial_japanese_characters_state);

    const JapaneseCharactersAsset = (characters: any, place: 'left' | 'right', classes: any, handleInputStack: MouseEventHandler, turn_flag: boolean) => (
        <Grid container spacing={0}>
            {/* input表示エリア */}
            {/* そのターンのプレイヤーしか入力できないようにする ※済 */}
            <Grid item xs={12}>
                <Grid container spacing={0.5}>
                    {[...Array(5)].map((item, index) => (
                        <Grid key={index} item xs={12}>
                            <Grid container spacing={0.5} sx={{flexWrap: 'nowrap', justifyContent: {xs: 'center', md: place === 'left' ? 'right' : 'left'}}}>
                                {(characters.slice(index*10, index*10+10) as any[]).map((character: {errata: 'match' | 'exist' | 'not_exist' | 'plain', character: string}, index: number) => (
                                    <Grid item key={index}>
                                        {character.character !== null ? (
                                                <Button data-character-value={character.character} disabled={!turn_flag} className={classes.character + " " + classes.input_character + " " + classes[`input_character_${character.errata}`]} onClick={handleInputStack}>{character.character}</Button>
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
                    {JapaneseCharactersAsset(japanese_characters.slice(0, 50), 'left', props.classes, props.handleInputStack, props.turn_flag)}
                </Grid>
                <Grid item xs={12} md={6}>
                    {JapaneseCharactersAsset(japanese_characters.slice(50, 100), 'right', props.classes, props.handleInputStack, props.turn_flag)}
                </Grid>
            </Grid>
        </Box>
    )
}

export default WordleJapaneseCharacters;