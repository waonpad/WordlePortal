export type VSPlayOptionProps = {
    wordle: any
    handleModalClose: Function
}

// Options ///////////////////
// 人数
// 周回数
// 公開設定
// 回答制限時間
// ワードのハイライト有無(難易度)
//////////////////////////////

export type VSPlayOptionData = {
    wordle_id: number
    max_participants: number
    laps: number
    visibility: boolean
    answer_time_limit: number
    coloring: boolean
    submit: string
}

export type VSPlayOptionErrorData = {
    wordle_id: string
    max_participants: string
    laps: string
    visibility: string
    answer_time_limit: string
    coloring: string
    submit: string
}