<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wordle;
use App\Models\Game;
use App\Models\GameUser;
use App\Models\GameLog;
use App\Events\GameEvent;
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
        $game = Game::with('gameUsers.user', 'gameLogs')->find(Game::where('uuid', $request->game_uuid)->first()->id);

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
        $game = Game::with('gameUsers.user', 'gameLogs')->find(Game::where('uuid', $request->game_uuid)->first()->id) ?? null;

        // 既に終了しているかゲームが無ければ参加できない
        if($game->status === 'end' || $game === null) {
            return response()->json([
                'status' => false,
                'message' => 'ゲームが無い'
            ]);
        }

        // 満員であれば参加できない
        $participants = array_filter((array)$game->game_users, function($game_user) {
            return $game_user['status'] !== 'leave';
        });

        if(count($participants) === $game->max_participants) {
            return response()->json([
                'status' => false,
                'message' => '満員のため参加できない'
            ]);
        }

        // 再接続でgameが開始していればstatusをstartにupdateする
        // 開始していなければwaitにupdateする
        // 初接続ならstatusをwaitでcreateする(startしているgameにはorderのあるuserしか入れない)
        if($game->status === 'start') {
            $reconnect = GameUser::where('game_id', Game::where('uuid', $request->game_uuid)->first()->id)
                                ->where('user_id', Auth::user()->id)
                                ->where('order', '!=', null)
                                ->exists();
            if(!$reconnect) {
                return response()->json([
                    'status' => false,
                    'message' => '既に開始しているため参加できない'
                ]);
            }
        }

        $game_user = GameUser::updateOrCreate(
            [
                'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
                'user_id' => Auth::user()->id,
            ],
            [
                'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
                'user_id' => Auth::user()->id,
                'status' => $game->status,
            ]
        );

        // 参加通知
        $entry_log = GameLog::create([
            'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
            'user_id' => Auth::user()->id,
            'type' => 'entry',
            'log' => $game_user
        ]);

        event(new GameEvent($entry_log));

        return response()->json([
            'status' => true,
            'game' => $game
        ]);
    }
    
    public function leave(Request $request)
    {
        $game_user = GameUser::where('game_id', Game::where('uuid', $request->game_uuid)->first()->id)->where('user_id', Auth::user()->id)->first()->update([
            'status' => 'leave'
        ]);

        // 退室通知
        $leave_log = GameLog::create([
            'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
            'user_id' => Auth::user()->id,
            'type' => 'leave',
            'log' => $game_user
        ]);
        
        event(new GameEvent($leave_log));

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
        $ready_log = GameLog::create([
            'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
            'user_id' => Auth::user()->id,
            'type' => 'ready',
            'log' => $game_user
        ]);

        event(new GameEvent($ready_log));

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
            $start_log = GameLog::create([
                'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
                'user_id' => Auth::user()->id,
                'type' => 'start',
                'log' => GameUser::where('game_id', Game::where('uuid', $request->game_uuid)->first()->id)->where('status', '!=', 'leave')->get()
            ]);
            
            event(new GameEvent($start_log));
    
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
        // TODO: ターンプレイヤーかどうか判定
        // 終了していないか判定

        $game = Game::find(Game::where('uuid', $request->game_uuid)->first()->id);

        // answerは入力可能最大文字数未満の可能性がある為、配列要素数を最大文字数と同じにする
        // 最大文字数が9でLaravelがanswerの場合、$answer_splitは[L,a,r,a,v,e,l,foo,foo]になる
        $answer_split = str_split($game->answer, 1);
        for ($i=count($answer_split); $i < $game->max; $i++) {
            array_push($answer_split, 'foo');
        }

        // inputは入力可能最大文字数未満の可能性がある為、配列要素数を最大文字数と同じにする
        // ※
        // js側で最大文字数分になるようにnull要素を作ってpostするようにした
        $input_split = $request->input;

        $matchs = [];
        $exists = [];
        $not_exists = [];
        $errata = [];
        // $answer_split: [L,a,r,a,v,e,l,foo,foo]
        // $input_split: [R,e,a,c,t,J,S,空白文字,空白文字]
        // max: 9
        // matchs: []
        // exists: [R,e,a]
        // not_exists: [c,t,J,S]
        // errata: ['exist', 'exist', 'exist', 'not_exist'...]
        for ($i=0; $i < $game->max; $i++) {
            // 場所一致
            if ($answer_split[$i] === $input_split[$i]) {
                array_push($matchs, $input_split[$i]);
                array_push($errata, 'match');
            }
            // 存在
            else if (false !== strpos($game->answer, (string)$input_split[$i])) {
                if($input_split[$i] === null) {
                    array_push($errata, 'not_exist');
                }
                else {
                    array_push($exists, $input_split[$i]);
                    array_push($errata, 'exist');
                }
            }
            // 存在しない
            else {
                if($input_split[$i] !== null) {
                    array_push($not_exists, $input_split[$i]);
                }
                array_push($errata, 'not_exist');
            }
        }

        $matchs = array_values(array_unique($matchs));
        $exists = array_values(array_unique($exists));
        $not_exists = array_values(array_unique($not_exists));

        $input_and_errata = [];

        for ($i=0; $i < $game->max; $i++) {
            array_push($input_and_errata, [
                'character' => $input_split[$i],
                'errata' => $errata[$i]
            ]);
        }

        // 入力が答えと一致していたら
        if ($input_split === $answer_split) {
            // 入力通知
            $input_log = GameLog::create([
                'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
                'user_id' => Auth::user()->id,
                'type' => 'input',
                'log' => [
                    'correct' => true,
                    'matchs' => $matchs,
                    'exists' => $exists,
                    'not_exists' => $not_exists,
                    'input_and_errata' => $input_and_errata
                ]
            ]);

            // resultを設定する
            GameUser::where('game_id', Game::where('uuid', $request->game_uuid)->first()->id)->where('user_id', Auth::user()->id)->update([
                'result' => 1
            ]);
            GameUser::where('game_id', Game::where('uuid', $request->game_uuid)->first()->id)->where('user_id', '!=', Auth::user()->id)->update([
                'result' => 2
            ]);

            // ゲームを終了状態にする
            Game::find(Game::where('uuid', $request->game_uuid)->first()->id)->update([
                'status' => 'end'
            ]);

            // 参加ユーザー全員を終了状態にする
            GameUser::where('game_id', Game::where('uuid', $request->game_uuid)->first()->id)->where('status', '!=', 'start')->update([
                'status' => 'end'
            ]);

            event(new GameEvent($input_log));

            // // 終了通知
            $game_result = GameLog::create([
                'game_id' => Game::where('uuid', $request->game_uuid)->first()->id,
                'type' => 'end',
                'log' => [
                    'winner' => Auth::user()->id,
                ]
            ]);

            event(new GameEvent($game_result));
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
                    'not_exists' => $not_exists,
                    'input_and_errata' => $input_and_errata
                ]
            ]);
            
            event(new GameEvent($input_log));
        }

        return response()->json([
            'status' => true,
            'input_log' => $input_log,
            'result' => $game_result ?? null,
            'input_split' => $input_split,
            'answer_split' => $answer_split
        ]);

    }
}
