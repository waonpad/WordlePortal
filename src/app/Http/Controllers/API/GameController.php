<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Wordle;
use App\Models\Game;
use App\Models\GameUser;
use App\Models\GameLog;
use App\Events\GamePlayEvent;
use App\Events\GameEvent;
use App\Events\GameTagEvent;
use App\Http\Requests\GameUpsertRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

// TODO: visibilityに関する設定をする

class GameController extends Controller
{
    public function eventHandler($game, $event_type, $sync_tags, $dettached_tags = [])
    {
        event(new GameEvent($game, $event_type));

        foreach($sync_tags as $tag) {
            event(new GameTagEvent($game, $event_type, $tag['id']));
        }

        // foreach($dettached_tags as $tag) {
        //     event(new GameTagEvent($wordle, 'destroy', $tag->id));
        // }
    }

    private function paginateGame($games, $per_page, $paginate, $start, $last,)
    {
        gettype($games) === 'object' ? $games = $games->toArray() : null;

        if($paginate === 'prev') {
            // prevなので、idがstartより大きいものの中からper_page個だけ取り出す
            // startがnull(初期表示)なら、配列の後ろからper_page個だけ取り出す
            $paginated_games = $start !== null ? array_slice(array_filter($games, function ($game) use($start) {
                return $game['id'] > $start;
            }), 0, $per_page)
            : array_slice($games, -$per_page);
            // これだとprevで最新まで戻った時、per_page個より少ない数しか取得できないのでその場合はさらに足す
            // idがstart以下のものの後ろから、per_page個になるように
            if(count($paginated_games) < $per_page) {
                $paginated_games = array_merge(array_slice(array_filter($games, function($game) use($start) {
                    return $game['id'] <= $start;
                }), -($per_page - count($paginated_games))), $paginated_games);
            }
        }
        
        if($paginate === 'next') {
            // nextなので、idがlastより小さいものの中からper_page個だけ取り出す
            // lastがnull(初期表示)なら、配列の後ろからper_page個だけ取り出す
            $paginated_games = $last !== null ? array_slice(array_filter($games, function($game) use($last) {
                return $game['id'] < $last;
            }), -$per_page)
            : array_slice($games, -$per_page);
            // これだとnextで最後まで行った時、per_page個より少ない数しか取得できないのでその場合はさらに足す
            // idがlast以上のものの前から、per_page個になるように
            if(count($paginated_games) < $per_page) {
                $paginated_games = array_merge($paginated_games, array_slice(array_filter($games, function ($game) use($last) {
                    return $game['id'] >= $last;
                }), 0, $per_page - count($paginated_games)));
            }
        }

        return $paginated_games;
    }

    private function filterGame($games, $target_status_array)
    {
        gettype($games) === 'object' ? $games = $games->toArray() : null;

        $filtered_games = array_filter($games, function($game) use($target_status_array) {
            return in_array($game['status'], $target_status_array);
        });

        return $filtered_games;
    }

    private function currentGameStatus($game, $initial_load = false)
    {
        $game_users = array_values($game->gameUsers->toArray());

        $game_input_logs = array_values(array_filter($game->gameLogs->toArray(), function($game_log) {
            return ($game_log['type'] === 'input');
        }));

        // boardに表示する入力ログを纏める
        $board = [];
        $matchs = [];
        $exists = [];
        $not_exists = [];
        if($game->status !== 'wait') {
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
        }

        return [
            'game' => $game->attributesToArray(),
            'game_users' => $game_users,
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

    public function index(Request $request)
    {
        $games = Game::with('user', 'gameUsers.user', 'gameLogs')->get();

        $filtered_games = $this->filterGame($games, $request->game_status);
        $paginated_games = $this->paginateGame($filtered_games, $request->per_page, $request->paginate, $request->start, $request->last);

        return response()->json([
            'games' => $paginated_games,
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

    public function follows(Request $request)
    {
        $games = Game::with('user', 'gameUsers.user', 'gameLogs')->whereIn('game_create_user_id', User::find(Auth::user()->id)->follows()->pluck('followed_user_id'))->latest()->get();

        $filtered_games = $this->filterGame($games, $request->game_status);
        $paginated_games = $this->paginateGame($filtered_games, $request->per_page, $request->paginate, $request->start, $request->last);
        
        return response()->json([
            'games' => $paginated_games,
            'status' => true
        ]);
    }

    public function user(Request $request)
    {
        $games = User::with('games.user', 'games.gameUsers.user', 'games.gameLogs')->where('screen_name', $request->screen_name)->first()->games;

        $filtered_games = $this->filterGame($games, $request->game_status);
        $paginated_games = $this->paginateGame($filtered_games, $request->per_page, $request->paginate, $request->start, $request->last);
        
        return response()->json([
            'games' => $paginated_games,
            'status' => true
        ]);
    }

    public function userJoining(Request $request)
    {
        $games = User::with('joiningGames.user', 'joiningGames.gameUsers.user', 'joiningGames.gameLogs')->where('screen_name', $request->screen_name)->first()->joiningGames;

        $filtered_games = $this->filterGame($games, $request->game_status);
        $paginated_games = $this->paginateGame($filtered_games, $request->per_page, $request->paginate, $request->start, $request->last);
        
        return response()->json([
            'games' => $paginated_games,
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

    public function tag(Request $request)
    {
        $game_tag_id = $request->game_tag_id;
        $all_games = Game::with('user', 'gameUsers.user', 'gameLogs')->get();

        $games = array_filter($all_games->toArray(), function($game) use($game_tag_id) {
            return in_array($game_tag_id, array_column($game['tags'], 'id'));
        });

        $filtered_games = $this->filterGame($games, $request->game_status);
        $paginated_games = $this->paginateGame($filtered_games, $request->per_page, $request->paginate, $request->start, $request->last);

        return response()->json([
            'status' => true,
            'games' => $paginated_games,
        ]);
    }

    // TODO: 条件変更用に処理を書き換える
    public function upsert(GameUpsertRequest $request)
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

        $request_type = $request->game_id !== null ? 'update' : 'create';
        $singleplay = $request->max_participants === 1 ? true : false;

        if($request_type === 'create') {
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
                'tags' => $wordle->tags,
                'game_create_user_id' => Auth::user()->id,
                'answer' => $answer,
                'max_participants' => $request->max_participants,
                'laps' => $request->laps,
                'visibility' => $request->visibility,
                'answer_time_limit' => $request->answer_time_limit,
                'coloring' => $request->coloring,
                'status' => $singleplay ? 'start' : 'wait',
            ]);

            $game_id = $game->id;
        }
        else if($request_type === 'update') {
            $target_game = Game::find($request->game_id);

            if($target_game->status !== 'wait') {
                return response()->json([
                    'message' => '今は設定を変更できません',
                    'status' => false
                ]);
            }

            if($request->max_participants < $target_game->max_participants) {
                // 既に参加者が入っている場合処理がめんどうになるので弾く
                return response()->json([
                    'message' => '制限人数を減らすことはできません',
                    'status' => false
                ]);
            }

            $target_game->update([
                'max_participants' => $request->max_participants,
                'laps' => $request->laps,
                'visibility' => $request->visibility,
                'answer_time_limit' => $request->answer_time_limit,
                'coloring' => $request->coloring,
            ]);

            $game = Game::find($request->game_id);
        }

        if($singleplay) {
            GameUser::create(
                [
                    'game_id' => $game->id,
                    'user_id' => Auth::user()->id,
                    'order' => 1
                ]
            );
        }

        $response_game = Game::with(['user', 'gameUsers.user', 'gameLogs'])->find($request->game_id !== null ? $request->game_id : $game_id);
        $this->eventHandler($response_game, $request_type, $response_game->tags);

        return response()->json([
            'game' => $game,
            'status' => true
        ]);
    }

    public function destroy(Request $request)
    {
        $game = Game::find($request->game_id);
        
        if ($game->game_create_user_id === Auth::user()->id) {
            $this->eventHandler($game, 'destroy', $game->tags);

            Game::destroy($game->id);

            return response()->json([
                'status' => true
            ]);
        }
        else {
            return response()->json([
               'message' => 'Gameが存在しないか削除権限が無い',
               'status' => false
            ]);
        }
    }
    
    public function start(Request $request)
    {
        $game = Game::where('uuid', $request->game_uuid)->first() ?? null;

        $game_users = (array)$request->game_users;
        $connect_game_users = array_filter($game_users, function($game_user) {
            return ($game_user['status'] !== 'disconnect');
        });

        $order_list = [];
        for ($i=0; $i < count($connect_game_users); $i++) { 
            array_push($order_list, $i+1);
        }
        shuffle($order_list);

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

        // ゲームを開始状態にする
        $game->update([
            'status' => 'start'
        ]);
        
        $current_game_status = $this->currentGameStatus(Game::where('uuid', $request->game_uuid)->first());
        event(new GamePlayEvent($current_game_status));

        return response()->json([
            'status' => true,
        ]);
    }
    
    public function input(Request $request)
    {
        $game = Game::where('uuid', $request->game_uuid)->first() ?? null;
        
        // 終了していないか判定
        if($game->status !== 'start') {
            return response()->json([
                'status' => false,
                'message' => 'ゲームが開始していないか既に終了している'
            ]);
        }

        $input_user_id = $request->has('skip') ? $request->skip_user_id : Auth::user()->id;
        $input_user_order = GameUser::where('game_id', $game->id)->where('user_id', $input_user_id)->first()->order;
        $latest_input_user = GameUser::where('game_id', $game->id)->where('user_id', GameLog::where('game_id', $game->id)->where('type', 'input')->latest('id')->first()->user_id ?? null)->first();
        
        // ターンプレイヤーかどうか判定
        if($latest_input_user === null) {
            // まだinputが無い場合、orderが1でないならターンプレイヤーではない
            if($input_user_order !== 1) {
                return response()->json([
                    'status' => false,
                    'message' => 'ターンプレイヤーではない'
                ]);
            }
        }
        else {
            $turn_user = GameUser::where('game_id', $game->id)->where('order', $latest_input_user->order + 1)->first();

            // 一周した場合、orderが1でないならターンプレイヤーではない
            if($turn_user === null) {
                if($input_user_order !== 1) {
                    return response()->json([
                        'status' => false,
                        'message' => 'ターンプレイヤーではない'
                    ]);
                }
            }
            else {
                // 本来のターンプレイヤーと自分のidが一致しなければターンプレイヤーではない
                if($input_user_id !== $turn_user->user_id) {
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
        $input_split = $request->has('skip') ? array_fill(0, $game->max, '') : array_map('strtoupper', $request->input);

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

        $input_and_errata = array_map(function($character, $errata) {
            return [
                'character' => $character,
                'errata' => $errata
            ];
        }, $input_split, $errata);

        $correct = $input_split === $answer_split ? true : false;

        $input_log = GameLog::create([
            'game_id' => $game->id,
            'user_id' =>  $input_user_id,
            'type' => 'input',
            'log' => [
                'correct' => $correct,
                'matchs' => $matchs,
                'exists' => $exists,
                'not_exists' => $not_exists,
                'input_and_errata' => $input_and_errata
            ]
        ]);

        // 正解なら
        if($correct) {
            // resultを設定する
            GameUser::where('game_id', $game->id)->where('user_id', $input_user_id)->update([
                'result' => 1
            ]);
            GameUser::where('game_id', $game->id)->where('user_id', '!=', $input_user_id)->update([
                'result' => 2
            ]);
    
            // ゲームを終了状態にする
            $game->update([
                'status' => 'end'
            ]);
        }

        $current_game_status = $this->currentGameStatus(Game::where('uuid', $request->game_uuid)->first());
        event(new GamePlayEvent($current_game_status));

        return response()->json([
            'status' => true,
        ]);

    }
}
