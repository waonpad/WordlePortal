<?php
namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class GameCreateRequest extends FormRequest
{

    /**
     * バリデーションルール
     *
     * @return array
     */
    public function rules()
    {
        return [
            'wordle_id' => 'required|numeric',
            'max_participants' => 'required|numeric',
            'laps' => 'required|numeric',
            'visibility' => 'required|boolean',
            'answer_time_limit' => 'required|numeric',
            'coloring' => 'required|boolean',
        ];
    }

    /**
     * @Override
     * 勝手にリダイレクトさせない
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     */
    protected function failedValidation(Validator $validator)
    {
    }

    /**
     * バリデータを取得する
     * @return  \Illuminate\Contracts\Validation\Validator  $validator
     */
    public function getValidator()
    {
        return $this->validator;
    }
}