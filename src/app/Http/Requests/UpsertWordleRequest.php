<?php
namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertWordleRequest extends FormRequest
{

    /**
     * バリデーションルール
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|max:50',
            'words' => 'required|array|min:10',
            'words.*' => 'string|min:5|max:10|nullable',
            'input' => 'required|array',
            'input.*' => [
                'string|',
                Rule::in(['japanese', 'english', 'number', 'typing'])
            ],
            'description' => 'max:255',
            'tags' => 'array',
            'tags.*' => 'max:50',
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