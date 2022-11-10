<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wordle;
use App\Models\Game;
use App\Models\GameUser;
use App\Models\GameLog;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\GameCreateRequest;

class GameController extends Controller
{
    public function create(GameCreateRequest $request)
    {
        $validator = $request->getValidator();
        if($validator->fails()){
            return response()->json([
                'validation_errors'  =>  $validator->errors(),
            ]);
        }

        $wordle = Wordle::find($request->wordle_id);
        $words = $wordle->words;
        $key = array_rand($words, 1);
        $answer = strtolower($words[$key]);

        $lengths = [];
        foreach ($words as $word) {
            array_push($lengths, mb_strlen($word));
        }
        $min = min($lengths);
        $max = max($lengths);

        // TODO: ユニークなゲームIDを作る
        // TODO: マイグレーションファイル書きかえ
        // etc...

        $game = Game::create([
            'wordle_id' => $request->wordle_id,
            'name' => $wordle->name,
            'user_id' => $wordle->user_id,
            'words' => $wordle->words,
            'min' => $min,
            'max' => $max,
            'input' => $wordle->input,
            'description' => $wordle->description,
            'answer' => $answer,
            'entry_limit' => $request->entry_limit,
            'laps' => $request->laps,
            'visibility' => $request->visibility,
            'answer_limit' => $request->answer_limit,
            'coloring' => $request->coloring,
            'status' => 'wait',
        ]);

        return response()->json([
            'status' => 200
        ]);
    }
    
    public function show(Request $request)
    {
        $game = Game::find($request->game_id);


    }
    
    public function search(Request $request)
    {
        $games = Game::where('status', 'wait')->get();

        return response()->json([
            'games' => $games
        ]);
    }
    
    public function entry(Request $request)
    {
        $game_user = GameUser::create([
            'game_id' => $request->game_id,
            'user_id' => $request->user()->id,
            'status' => 'wait',
        ]);

        // 参加通知
        GameLog::create([
            'game_id' => $request->game_id,
            'user_id' => $request->user()->id,
            'type' => 'entry',
            'log' => $game_user
        ]);

        return response()->json([
            'status' => 200
        ]);
    }
    
    public function leave(Request $request)
    {
        $game_user = GameUser::where('game_id', $request->game_id)->where('user_id', $request->user()->id)->first()->update([
            'status' => 'leave'
        ]);

        // 退室通知
        GameLog::create([
            'game_id' => $request->game_id,
            'user_id' => $request->user()->id,
            'type' => 'leave',
            'log' => $game_user
        ]);

        // 参加ユーザーが0になったらゲームを破棄する
        if (GameUser::where('game_id', $request->game_id)->where('status', '!=', 'leave')->exists() === false) {
            Game::find($request->game_id)->update([
                'status' => 'aborted'
            ]);
        }

        return response()->json([
            'status' => 200
        ]);
    }
    
    public function ready(Request $request)
    {
        $game_user = GameUser::where('game_id', $request->game_id)->where('user_id', $request->user()->id)->first()->update([
            'status' => 'ready'
        ]);

        // 準備完了通知
        GameLog::create([
            'game_id' => $request->game_id,
            'user_id' => $request->user()->id,
            'type' => 'ready',
            'log' => $game_user
        ]);

        return response()->json([
            'status' => 200
        ]);
    }
    
    public function start(Request $request)
    {
        // 参加ユーザーのうち、一番古いユーザーであればホストとしてゲームを開始できる
        if (GameUser::where('game_id', $request->game_id)->where('status', '!=', 'leave')->first()->user_id === $request->user()->id) {

            // ゲームを開始状態にする
            Game::find($request->game_id)->update([
                'status' => 'start'
            ]);

            // 参加ユーザー全員を開始状態にする
            $game_users = GameUser::where('game_id', $request->game_id)->where('status', '!=', 'leave')->update([
                'status' => 'start'
            ]);

            $order_list = [];
            for ($i=0; $i < count($game_users); $i++) { 
                array_push($order_list, $i+1);
            }
            shuffle($order_list);

            // 入力順を決定する
            for ($i=0; $i < count($game_users); $i++) {
                $game_users[$i]->update([
                    'order' => $order_list[$i]
                ]);
            }
    
            // 開始通知
            GameLog::create([
                'game_id' => $request->game_id,
                'user_id' => $request->user()->id,
                'type' => 'start',
                'log' => GameUser::where('game_id', $request->game_id)->where('status', '!=', 'leave')->get()
            ]);
    
            return response()->json([
                'status' => 200
            ]);
        }
        else {
            return response()->json([
                'message' => 'ホストユーザーではない'
            ]);
        }
    }
    
    public function input(Request $request)
    {
        $game = Game::where('game_id', $request->game_id);

        // answer,inputのアルファベットは共に小文字に変換されている
        $input = strtolower($request->input);

        // answerは入力可能最大文字数未満の可能性がある為、配列要素数を最大文字数と同じにする
        // 最大文字数が9でLaravelがanswerの場合、$answer_splitは[L,a,r,a,v,e,l,foo,foo]になる
        $answer_split = str_split($game->answer, 1);
        for ($i=count($answer_split); $i < $game->max; $i++) {
            array_push($answer_split, 'foo');
        }

        // inputは入力可能最大文字数未満の可能性がある為、配列要素数を最大文字数と同じにする
        $input_split = str_split($input, 1);
        for ($i=count($input_split); $i < $game->max; $i++) {
            array_push($input_split, 'bar');
        }

        $exists = [];
        $matchs = [];
        $errata = [];
        // answer: Laravel
        // input: ReactJS
        // max: 9
        // exists: []
        // matchs: [R,e,a]
        // errata: [1,1,1,0,0,0,0,0,0]
        for ($i=0; $i < $game->max; $i++) {
            // 場所一致
            if ($answer_split[$i] === $input_split[$i]) {
                array_push($errata, 2);
            }
            // 存在
            else if (false !== strpos($game->answer, $input_split[$i])) {
                array_push($errata, 1);
            }
            // 存在しない
            else {
                array_push($errata, 0);
            }
        }

        // 入力が答えと一致していたら
        if ($request->input === $game->answer) {
            // 入力通知
            GameLog::create([
                'game_id' => $request->game_id,
                'user_id' => $request->user()->id,
                'type' => 'input',
                'log' => [
                    'correct' => true,
                    'exists' => $exists,
                    'matchs' => $matchs,
                    'input' => $input,
                    'errata' => $errata,
                ]
            ]);

            // ゲームを終了状態にする
            Game::find($request->game_id)->update([
                'status' => 'end'
            ]);

            // 参加ユーザー全員を終了状態にする
            GameUser::where('game_id', $request->game_id)->where('status', '!=', 'start')->update([
                'status' => 'end'
            ]);

            // 終了通知
            GameLog::create([
                'game_id' => $request->game_id,
                'type' => 'end',
                'log' => [
                    'winner' => $request->user()->id,
                ]
            ]);
        }
        else {
            // 入力通知
            GameLog::create([
                'game_id' => $request->game_id,
                'user_id' => $request->user()->id,
                'type' => 'input',
                'log' => [
                    'correct' => false,
                    'exists' => $exists,
                    'matchs' => $matchs,
                    'input' => $input,
                    'errata' => $errata,
                ]
            ]);
        }
    }
}
