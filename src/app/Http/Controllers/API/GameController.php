<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wordle;
use App\Models\Game;
use App\Models\GameUser;
use App\Models\GameLog;
use App\Events\GameEvent;
use App\Http\Requests\GameCreateRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class GameController extends Controller
{
    // start時にorder等込みのusersを保存するカラムを作る？

    private function currentGameStatus($game, $initial_load = false)
    {
        // if($firebase_game_users !== null) {
        //     $firebase_game_users = (array)$firebase_game_users;
        //     $game_users = [];
            
        //     foreach(array_keys($firebase_game_users) as $key) {
        //         $firebase_game_users[$key]['user_id'] = substr($key, 0, 1);
        //         array_push($game_users, $firebase_game_users[$key]);
        //     }
        // }

        $game_users = array_values($game->gameUsers->toArray());

        // // game_usersの中で、leaveではないユーザーのみを取り出す
        // $filtered_game_users = array_values(array_filter($game_users, function($game_user) {
        //     return ($game_user['status'] !== 'leave');
        // }));
        // // TODO: 順番を綺麗にする

        $game_input_logs = array_values(array_filter($game->gameLogs->toArray(), function($game_log) {
            return ($game_log['type'] === 'input');
        }));

        // boardに表示する入力ログを纏める
        $board = [];
        $matchs = [];
        $exists = [];
        $not_exists = [];
        if(count($game_input_logs) > 0) {
            // 最後だけ除外した配列
            $sliced_game_input_logs = array_slice($game_input_logs, 0, count($game_input_logs) - 1);

            $board = array_values(array_map(function($game_input_log) {
                return ($game_input_log['log']['input_and_errata']);  
            }, $game_input_logs));
    
            // errataを取得
            // php側では初期表示なのか否かを判定できないため、最後のinput以外でまずerrataを整形
            // その後はjsでの処理
            // 初期表示の場合: $boardの最後の要素のcharacterをそれぞれ対応したerrata配列に追加してから反映する
            // 初期表示でない: 一度反映させた後、$boardの最後の要素を1文字ずつ反映させる
    
            foreach(($initial_load ? $game_input_logs : $sliced_game_input_logs) as $game_input_log) {
                $matchs = array_merge($matchs, $game_input_log['log']['matchs']);
                $exists = array_merge($exists, $game_input_log['log']['exists']);
                $not_exists = array_merge($not_exists, $game_input_log['log']['not_exists']);
            }
    
            $matchs = array_values(array_unique($matchs));
            $exists = array_values(array_unique($exists));
            $not_exists = array_values(array_unique($not_exists));

            $latest_input_user = array_values(array_filter($game_users, function($game_user) use($game_input_logs) {
                return ($game_user['user_id'] === $game_input_logs[count($game_input_logs) - 1]['user_id']);
            }))[0];
    
            $next_input_user = array_values(array_filter($game_users, function($game_user) use($latest_input_user) {
                return ($game_user['order'] === ($latest_input_user['order'] + 1));
            }))[0]['user_id']
            ??
            array_values(array_filter($game_users, function($game_user) {
                return ($game_user['order'] === 1);
            }))[0]['user_id'];
        }
        else {
            $next_input_user = array_values(array_filter($game_users, function($game_user) {
                return ($game_user['order'] === 1);
            }))[0]['user_id'];
        }

        return [
            'game' => $game->attributesToArray(),
            'game_users' => $game_users,
            // 'game_users' => $filtered_game_users,
            // startした時にfirebseと同期するためのusers情報を送る
            // 'latest_input_user' => $latest_input_user ?? null,
            'next_input_user' => $next_input_user ?? null,
            'latest_game_log' => count($game->gameLogs->toArray()) > 0 ? $game->gameLogs()->latest()->first()->attributesToArray() : null,
            'game_input_logs' => $game_input_logs,
            'board' => $board,
            'errata' => [
                'matchs' => $matchs,
                'exists' => $exists,
                'not_exists' => $not_exists
            ],
        ];
    }

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
        $answer = strtoupper($words[intval($key)]);

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
            'game_create_user_id' => Auth::user()->id,
            'answer' => $answer,
            'max_participants' => $request->max_participants,
            'laps' => $request->laps,
            'visibility' => $request->visibility,
            'answer_time_limit' => $request->answer_time_limit,
            'coloring' => $request->coloring,
            'status' => 'wait',
        ]);

        // // Game作成者は作成時にentryされる
        // $game_user = GameUser::create([
        //     'game_id' => $game->id,
        //     'user_id' => Auth::user()->id,
        //     'status' => 'wait',
        // ]);

        return response()->json([
            'game' => $game,
            'status' => true
        ]);
    }
    
    public function show(Request $request)
    {
        $game = Game::where('uuid', $request->game_uuid)->first() ?? null;
        
        $current_game_status = $this->currentGameStatus(Game::where('uuid', $request->game_uuid)->first());

        return response()->json([
            'game' => $game,
            'status' => true,
            'current_game_status' => $current_game_status
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
        $game = Game::where('uuid', $request->game_uuid)->first() ?? null;

        // 既に終了しているかゲームが無ければ参加できない
        if($game->status === 'end' || $game === null) {
            return response()->json([
                'status' => false,
                'message' => 'ゲームが無い'
            ]);
        }

        // // 満員であれば参加できない
        // $participants = array_filter((array)$game->game_users, function($game_user) {
        //     return $game_user['status'] !== 'leave';
        // });

        // if(count($participants) === $game->max_participants) {
        //     return response()->json([
        //         'status' => false,
        //         'message' => '満員のため参加できない'
        //     ]);
        // }

        // // 再接続でgameが開始していればstatusをstartにupdateする
        // // 開始していなければwaitにupdateする
        // // 初接続ならstatusをwaitでcreateする(startしているgameにはorderのあるuserしか入れない)
        // if($game->status === 'start') {
        //     $reconnect = GameUser::where('game_id', $game->id)
        //                         ->where('user_id', Auth::user()->id)
        //                         ->where('order', '!=', null)
        //                         ->exists();
        //     if(!$reconnect) {
        //         return response()->json([
        //             'status' => false,
        //             'message' => '既に開始しているため参加できない'
        //         ]);
        //     }
        // }

        // $game_user = GameUser::updateOrCreate(
        //     [
        //         'game_id' => $game->id,
        //         'user_id' => Auth::user()->id,
        //     ],
        //     [
        //         'game_id' => $game->id,
        //         'user_id' => Auth::user()->id,
        //         'status' => $game->status,
        //     ]
        // );

        // // 参加通知
        // $entry_log = GameLog::create([
        //     'game_id' => $game->id,
        //     'user_id' => Auth::user()->id,
        //     'type' => 'entry',
        //     'log' => [
        //         'user' => $game_user
        //     ]
        // ]);

        $current_game_status = $this->currentGameStatus(Game::where('uuid', $request->game_uuid)->first(), true);
        // event(new GameEvent($current_game_status));

        return response()->json([
            'status' => true,
            'game' => $game,
            'current_game_status' => $current_game_status
        ]);
    }
    
    // public function leave(Request $request)
    // {
    //     $game = Game::where('uuid', $request->game_uuid)->first() ?? null;

    //     // 既に終了しているかゲームが無ければ退室できない
    //     // が、既にページを離れているので特に対応はいらないか?
        
    //     $game_user = GameUser::where('game_id', $game->id)->where('user_id', Auth::user()->id)->first()->update([
    //         'status' => 'leave'
    //     ]);

    //     // 退室通知
    //     $leave_log = GameLog::create([
    //         'game_id' => $game->id,
    //         'user_id' => Auth::user()->id,
    //         'type' => 'leave',
    //         'log' => [
    //             'user' => $game_user
    //         ]
    //     ]);
        
    //     $current_game_status = $this->currentGameStatus(Game::where('uuid', $request->game_uuid)->first());
    //     event(new GameEvent($current_game_status));

    //     // 参加ユーザーが0になったらゲームを破棄する
    //     if (GameUser::where('game_id', $game->id)->where('status', '!=', 'leave')->exists() === false) {
    //         Game::find($game->id)->update([
    //             'status' => 'aborted'
    //         ]);
    //     }

    //     return response()->json([
    //         'status' => true
    //     ]);
    // }
    
    // public function ready(Request $request)
    // {
    //     $game = Game::with('gameUsers.user', 'gameLogs')->where('uuid', $request->game_uuid)->first() ?? null;

    //     $game_user = GameUser::where('game_id', $game->id)->where('user_id', Auth::user()->id)->first()->update([
    //         'status' => 'ready'
    //     ]);

    //     // 準備完了通知
    //     $ready_log = GameLog::create([
    //         'game_id' => $game->id,
    //         'user_id' => Auth::user()->id,
    //         'type' => 'ready',
    //         'log' => [
    //             'user' => $game_user
    //         ]
    //     ]);

    //     event(new GameEvent($game, GameLog::where('game_id', $game->id)->get()));

    //     return response()->json([
    //         'status' => true
    //     ]);
    // }
    
    public function start(Request $request)
    {
        $game = Game::where('uuid', $request->game_uuid)->first() ?? null;

        // // 参加ユーザーのうち、一番古いユーザーであればホストとしてゲームを開始できる
        // if (GameUser::where('game_id', Game::where('uuid', $request->game_uuid)->first()->id)->where('status', '!=', 'leave')->first()->user_id === Auth::user()->id) {

            // // 参加ユーザー全員を開始状態にする
            // $game_users = GameUser::where('game_id', $game->id)->where('status', '!=', 'leave')->update([
            //     'status' => 'start'
            // ]);

            // 要テスト オブジェクトが送られてくる
            $game_users = (array)$request->game_users;
            $connect_game_users = array_filter($game_users, function($game_user) {
                return ($game_user['status'] !== 'disconnect');
            });

            $order_list = [];
            for ($i=0; $i < count($connect_game_users); $i++) { 
                array_push($order_list, $i+1);
            }
            shuffle($order_list);

            // // 入力順を決定する
            // for ($i=0; $i < count($game_users); $i++) {
            //     $game_users[$i]->update([
            //         'order' => $order_list[$i]
            //     ]);
            // }

            // 入力順を決定する
            array_map(function($game_user, $index) use($game, $order_list) {
                GameUser::updateOrCreate(
                    [
                        'game_id' => $game->id,
                        'user_id' => $game_user['user']['id'],
                    ],
                    [
                        'game_id' => $game->id,
                        'user_id' => $game_user['user']['id'],
                        'order' => $order_list[$index]
                    ]
                );
            }, $connect_game_users, range(0, count($connect_game_users) - 1));
    
            // 開始通知
            $start_log = GameLog::create([
                'game_id' => $game->id,
                'user_id' => Auth::user()->id,
                'type' => 'start',
                'log' => [
                ]
            ]);

            // ゲームを開始状態にする
            $game->update([
                'status' => 'start'
            ]);
            
            $current_game_status = $this->currentGameStatus(Game::where('uuid', $request->game_uuid)->first());
            event(new GameEvent($current_game_status));

            return response()->json([
                'status' => true,
            ]);
        // }
        // else {
        //     return response()->json([
        //         'message' => 'ホストユーザーではない'
        //     ]);
        // }
    }
    
    public function input(Request $request)
    {
        $game = Game::where('uuid', $request->game_uuid)->first() ?? null;
        
        // 終了していないか判定
        // ログの数でも判別する？
        if($game->status !== 'start') {
            return response()->json([
                'status' => false,
                'message' => 'ゲームが開始していないか既に終了している'
            ]);
        }

        $input_user = Auth::user();
        $latest_input_user = GameUser::where('game_id', $game->id)->where('user_id', GameLog::where('game_id', $game->id)->where('type', 'input')->latest('id')->first()->user_id ?? null)->first();
        
        
        // ターンプレイヤーかどうか判定
        if($latest_input_user === null) {
            if($input_user->id !== 1) {
                return response()->json([
                    'status' => false,
                    'message' => 'ターンプレイヤーではない'
                ]);
            }
        }
        else {
            $turn_user = GameUser::where('order', $latest_input_user->order + 1)->first();
            if($turn_user === null) {
                if($input_user->id !== 1) {
                    return response()->json([
                        'status' => false,
                        'message' => 'ターンプレイヤーではない'
                    ]);
                }
            }
            else {
                if($input_user->id !== $turn_user->user_id) {
                    return response()->json([
                        'status' => false,
                        'message' => 'ターンプレイヤーではない'
                    ]);
                }
            }
        }

        // answerは入力可能最大文字数未満の可能性がある為、配列要素数を最大文字数と同じにする
        // 最大文字数が9でLaravelがanswerの場合、$answer_splitは[L,a,r,a,v,e,l,foo,foo]になる
        $answer_split = str_split($game->answer, 1);
        for ($i=count($answer_split); $i < $game->max; $i++) {
            array_push($answer_split, 'foo');
        }

        // inputは入力可能最大文字数未満の可能性がある為、配列要素数を最大文字数と同じにする
        // ※
        // js側で最大文字数分になるようにnull要素を作ってpostするようにした
        $input_split = array_map('strtoupper', $request->input);

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
                if($input_split[$i] === '') {
                    array_push($errata, 'not_exist');
                }
                else {
                    array_push($exists, $input_split[$i]);
                    array_push($errata, 'exist');
                }
            }
            // 存在しない
            else {
                if($input_split[$i] !== '') {
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
                'game_id' => $game->id,
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

            // // resultを設定する
            // GameUser::where('game_id', $game->id)->where('user_id', Auth::user()->id)->update([
            //     'result' => 1
            // ]);
            // GameUser::where('game_id', $game->id)->where('user_id', '!=', Auth::user()->id)->update([
            //     'result' => 2
            // ]);

            // resultを設定する
            // 要テスト オブジェクトで送られてくるので整形する
            $game_users = $request->game_users;

            foreach($game_users as $game_user) {
                if($game_user['user_id'] === Auth::user()->id) {
                    $game_user['result'] = 1;
                }
                else {
                    $game_user['result'] = 2;
                }
            };

            // ゲームを終了状態にする
            $game->update([
                'status' => 'end'
            ]);

            // // 参加ユーザー全員を終了状態にする
            // GameUser::where('game_id', $game->id)->where('status', '!=', 'start')->update([
            //     'status' => 'end'
            // ]);

            $current_game_status = $this->currentGameStatus(Game::where('uuid', $request->game_uuid)->first());
            event(new GameEvent($current_game_status));

            // // 終了通知
            $game_result = GameLog::create([
                'game_id' => $game->id,
                'type' => 'end',
                'log' => [
                    'winner' => Auth::user()->id,
                ]
            ]);

            $current_game_status = $this->currentGameStatus(Game::where('uuid', $request->game_uuid)->first());
            event(new GameEvent($current_game_status));
        }
        else {
            // 入力通知
            $input_log = GameLog::create([
                'game_id' => $game->id,
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
            
            $current_game_status = $this->currentGameStatus(Game::where('uuid', $request->game_uuid)->first());
            event(new GameEvent($current_game_status));
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
