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
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

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
        $answer = strtolower($words[intval($key)]);

        $lengths = [];
        foreach ($words as $word) {
            array_push($lengths, mb_strlen($word));
        }
        $min = min($lengths);
        $max = max($lengths);

        $game = Game::create([
            'uuid' => (string) Str::uuid(),
            'wordle_id' => $request->wordle_id,
            'name' => $wordle->name,
            'user_id' => $wordle->user_id,
            'words' => $wordle->words,
            'min' => $min,
            'max' => $max,
            'input' => $wordle->input,
            'description' => $wordle->description,
            'answer' => $answer,
            'max_participants' => $request->max_participants,
            'laps' => $request->laps,
            'visibility' => $request->visibility,
            'answer_time_limit' => $request->answer_time_limit,
            'coloring' => $request->coloring,
            'status' => 'wait',
        ]);

        // Game作成者は作成時にentryされる
        $game_user = GameUser::create([
            'game_id' => $game->id,
            'user_id' => Auth::user()->id,
            'status' => 'wait',
        ]);

        return response()->json([
            'game' => $game,
            'status' => true
        ]);
    }
    
    public function show(Request $request)
    {
        $game = Game::with('gameUsers')->find(Game::where('uuid', $request->game_uuid)->first()->id);

        return response()->json([
            'game' => $game,
            'status' => true
        ]);
    }
    
    public function search(Request $request)
    {
        $games = Game::where('status', 'wait')->get();

        return response()->json([
            'games' => $games,
            'status' => true
        ]);
    }
    
    public function entry(Request $request)
    {
        $game_user = GameUser::create([
            'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
            'user_id' => Auth::user()->id,
            'status' => 'wait',
        ]);

        // 参加通知
        GameLog::create([
            'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
            'user_id' => Auth::user()->id,
            'type' => 'entry',
            'log' => $game_user
        ]);

        return response()->json([
            'status' => true
        ]);
    }
    
    public function leave(Request $request)
    {
        $game_user = GameUser::where('game_id', Game::where('uuid', $request->game_uuid)->first()->id)->where('user_id', Auth::user()->id)->first()->update([
            'status' => 'leave'
        ]);

        // 退室通知
        GameLog::create([
            'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
            'user_id' => Auth::user()->id,
            'type' => 'leave',
            'log' => $game_user
        ]);

        // 参加ユーザーが0になったらゲームを破棄する
        if (GameUser::where('game_id', Game::where('uuid', $request->game_uuid)->first()->id)->where('status', '!=', 'leave')->exists() === false) {
            Game::find(Game::where('uuid', $request->game_uuid)->first()->id)->update([
                'status' => 'aborted'
            ]);
        }

        return response()->json([
            'status' => true
        ]);
    }
    
    public function ready(Request $request)
    {
        $game_user = GameUser::where('game_id', Game::where('uuid', $request->game_uuid)->first()->id)->where('user_id', Auth::user()->id)->first()->update([
            'status' => 'ready'
        ]);

        // 準備完了通知
        GameLog::create([
            'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
            'user_id' => Auth::user()->id,
            'type' => 'ready',
            'log' => $game_user
        ]);

        return response()->json([
            'status' => true
        ]);
    }
    
    public function start(Request $request)
    {
        // 参加ユーザーのうち、一番古いユーザーであればホストとしてゲームを開始できる
        if (GameUser::where('game_id', Game::where('uuid', $request->game_uuid)->first()->id)->where('status', '!=', 'leave')->first()->user_id === Auth::user()->id) {

            // ゲームを開始状態にする
            Game::find(Game::where('uuid', $request->game_uuid)->first()->id)->update([
                'status' => 'start'
            ]);

            // 参加ユーザー全員を開始状態にする
            $game_users = GameUser::where('game_id', Game::where('uuid', $request->game_uuid)->first()->id)->where('status', '!=', 'leave')->update([
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
                'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
                'user_id' => Auth::user()->id,
                'type' => 'start',
                'log' => GameUser::where('game_id', Game::where('uuid', $request->game_uuid)->first()->id)->where('status', '!=', 'leave')->get()
            ]);
    
            return response()->json([
                'status' => true
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
        $game = Game::find(Game::where('uuid', $request->game_uuid)->first()->id);

        // answerは入力可能最大文字数未満の可能性がある為、配列要素数を最大文字数と同じにする
        // 最大文字数が9でLaravelがanswerの場合、$answer_splitは[L,a,r,a,v,e,l,foo,foo]になる
        $answer_split = str_split($game->answer, 1);
        for ($i=count($answer_split); $i < $game->max; $i++) {
            array_push($answer_split, 'foo');
        }

        // inputは入力可能最大文字数未満の可能性がある為、配列要素数を最大文字数と同じにする
        $input_split = $request->input;
        for ($i=count($input_split); $i < $game->max; $i++) {
            array_push($input_split, 'bar');
        }

        $matchs = [];
        $exists = [];
        $errata = [];
        // answer: Laravel
        // input: ReactJS
        // max: 9
        // matchs: []
        // exists: [R,e,a]
        // errata: ['exist', 'exist', 'exist', 'not_exist'...]
        for ($i=0; $i < $game->max; $i++) {
            // 場所一致
            if ($answer_split[$i] === $input_split[$i]) {
                array_push($errata, 'match');
            }
            // 存在
            else if (false !== strpos($game->answer, $input_split[$i])) {
                array_push($errata, 'exist');
            }
            // 存在しない
            else {
                array_push($errata, 'not_exist');
            }
        }

        // 入力が答えと一致していたら
        if ($request->input === $game->answer) {
            // 入力通知
            $input_log = GameLog::create([
                'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
                'user_id' => Auth::user()->id,
                'type' => 'input',
                'log' => [
                    'correct' => true,
                    'matchs' => $matchs,
                    'exists' => $exists,
                    'input' => $request->input,
                    'errata' => $errata,
                ]
            ]);

            // ゲームを終了状態にする
            Game::find(Game::where('uuid', $request->game_uuid)->first()->id)->update([
                'status' => 'end'
            ]);

            // 参加ユーザー全員を終了状態にする
            GameUser::where('game_id', Game::where('uuid', $request->game_uuid)->first()->id)->where('status', '!=', 'start')->update([
                'status' => 'end'
            ]);

            // 終了通知
            $game_result = GameLog::create([
                'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
                'type' => 'end',
                'log' => [
                    'winner' => Auth::user()->id,
                ]
            ]);
        }
        else {
            // 入力通知
            $input_log = GameLog::create([
                'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
                'user_id' => Auth::user()->id,
                'type' => 'input',
                'log' => [
                    'correct' => false,
                    'matchs' => $matchs,
                    'exists' => $exists,
                    'input' => $request->input,
                    'errata' => $errata,
                ]
            ]);
        }

        return response()->json([
            'status' => true,
            'input_log' => $input_log,
            'result' => $game_result ?? null
        ]);

    }
}
