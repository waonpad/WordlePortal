import { alpha, createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { green, grey, yellow } from '@mui/material/colors';

// TODO: characterの大きさ調整、レスポンシブ対応 どうやる？？？？？
// TODO: Stackの幅とレスポンシブ

export const WordleGameStyle = makeStyles((theme: Theme) => ({
    character: {
        minWidth: '0px',
        minHeight: '0px',
        width: '40px',
        height: '40px',
        borderRadius: '7px',
        // border: 'solid 1px rgba(0, 0, 0, 0.54)',
        boxSizing: 'border-box',
        color: '#fff',
        fontWeight: 'bold',
        // game.maxを参照して拡大の可否を分岐しないといけないがapiから受け取ったgameを使えない・・・？
        // classにgame.maxの値を入れ込んでそれを元に分岐するか
        [theme.breakpoints.down("sm")]: {
            width: '33px',
            height: '33px',
        },
        '& .MuiChip-label': {
            overflow: 'visible',
        }
    },
    board_character: {
        border: 'solid 1px transparent',
        backgroundColor: '#fff'
    },
    board_character_match: {
        backgroundColor: green[400]
    },
    board_character_exist: {
        backgroundColor: yellow[400]
    },
    board_character_not_exist: {
        backgroundColor: grey[400]
    },
    board_character_plain: {
        border: 'solid 1px rgba(0, 0, 0, 0.2)',
        // border: 'solid 1px transparent',
        color: '#000000DE'
    },
    input_character: {
        border: 'solid 1px transparent',
        backgroundColor: grey[200],
        '&:hover': {
            backgroundColor: grey[400],
            '@media (hover: none)': {
                backgroundColor: grey[200],
            }
        },
    },
    input_character_null: {
        border: 'solid 1px transparent',
    },
    input_character_match: {
        backgroundColor: green[400],
        '&:hover': {
            backgroundColor: green[600],
            '@media (hover: none)': {
                backgroundColor: green[400],
            }
        },
    },
    input_character_exist: {
        backgroundColor: yellow[400],
        '&:hover': {
            backgroundColor: yellow[600],
            '@media (hover: none)': {
                backgroundColor: yellow[400],
            }
        },
    },
    input_character_not_exist: {
        backgroundColor: grey[400],
        // '&:hover': {
        //     backgroundColor: grey[600],
        //     '@media (hover: none)': {
        //         backgroundColor: grey[400],
        //     }
        // },
    },
    input_character_plain: {
        border: 'solid 1px rgba(0, 0, 0, 0.2)',
        color: '#000000DE'
    },
}));