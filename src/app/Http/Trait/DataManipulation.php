<?php

namespace App\Http\Trait;
use Illuminate\Support\Facades\Auth;

trait DataManipulation
{
    private function paginate($items, $per_page, $paginate, $start, $last,)
    {
        gettype($items) === 'object' ? $items = $items->toArray() : null;

        if($paginate === 'prev') {
            // prevなので、idがstartより大きいものの中からper_page個だけ取り出す
            // startがnull(初期表示)なら、配列の後ろからper_page個だけ取り出す
            $paginated_items = $start !== null ? array_slice(array_filter($items, function ($item) use($start) {
                return $item['id'] > $start;
            }), 0, $per_page)
            : array_slice($items, -$per_page);
            // これだとprevで最新まで戻った時、per_page個より少ない数しか取得できないのでその場合はさらに足す
            // idがstart以下のものの後ろから、per_page個になるように
            if(count($paginated_items) < $per_page) {
                $paginated_items = array_merge(array_slice(array_filter($items, function($item) use($start) {
                    return $item['id'] <= $start;
                }), -($per_page - count($paginated_items))), $paginated_items);
            }
        }
        
        if($paginate === 'next') {
            // nextなので、idがlastより小さいものの中からper_page個だけ取り出す
            // lastがnull(初期表示)なら、配列の後ろからper_page個だけ取り出す
            $paginated_items = $last !== null ? array_slice(array_filter($items, function($item) use($last) {
                return $item['id'] < $last;
            }), -$per_page)
            : array_slice($items, -$per_page);
            // これだとnextで最後まで行った時、per_page個より少ない数しか取得できないのでその場合はさらに足す
            // idがlast以上のものの前から、per_page個になるように
            if(count($paginated_items) < $per_page) {
                $paginated_items = array_merge($paginated_items, array_slice(array_filter($items, function ($item) use($last) {
                    return $item['id'] >= $last;
                }), 0, $per_page - count($paginated_items)));
            }
        }

        return $paginated_items;
    }

    private function ffCheck($users)
    {
        gettype($users) === 'object' ? $users = $users->toArray() : null;

        $auth_user = Auth::user();

        $ff_checked_users = array_map(function($user) use($auth_user) {
            gettype($user) === 'object' ? $user = $user->toArray() : null;

            $user['myself'] = $auth_user ? (($auth_user->id === $user['id']) ? true : false) : false;
            $user['follow'] = $auth_user ? (in_array($auth_user->id, array_column($user['followers'], 'id')) ? true : false) : false;
            $user['followed'] = $auth_user ? (in_array($auth_user->id, array_column($user['follows'], 'id')) ? true : false) : false;

            return $user;
        }, $users);

        return $ff_checked_users;
    }

    private function wordleLikeCheck($wordles)
    {
        return array_map(function($wordle) {
            $wordle['like_status'] = in_array(Auth::id(), array_column($wordle['likes'], 'id'));
            return $wordle;
        }, $wordles);
    }
    
    private function filterGame($games, $target_status_array)
    {
        gettype($games) === 'object' ? $games = $games->toArray() : null;

        $filtered_games = array_filter($games, function($game) use($target_status_array) {
            gettype($game) === 'object' ? $game = $game->toArray() : null;
            
            return in_array($game['status'], $target_status_array);
        });

        return $filtered_games;
    }
}