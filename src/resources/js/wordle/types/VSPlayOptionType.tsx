export type VSPlayOptionProps = {
    game?: any;
    wordle?: any;
    handleModalClose: Function;
}

// Options ///////////////////
// 人数
// 周回数
// 公開設定
// 回答制限時間
// ワードのハイライト有無(難易度)
//////////////////////////////

export type VSPlayOptionData = {
    game_id: number | null;
    wordle_id: number;
    max_participants: number;
    laps: number;
    visibility: boolean;
    answer_time_limit: number | null;
    coloring: boolean;
    submit: string;
}

export type VSPlayOptionErrorData = {
    game_id: string;
    wordle_id: string;
    max_participants: string;
    laps: string;
    visibility: string;
    answer_time_limit: string;
    coloring: string;
    submit: string;
}