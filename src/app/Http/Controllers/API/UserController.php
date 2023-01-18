<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
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
    
    private function paginateUser($users, $per_page, $paginate, $start, $last,)
    {
        gettype($users) === 'object' ? $users = $users->toArray() : null;

        if($paginate === 'prev') {
            // prevなので、idがstartより大きいものの中からper_page個だけ取り出す
            // startがnull(初期表示)なら、配列の後ろからper_page個だけ取り出す
            $paginated_users = $start !== null ? array_slice(array_filter($users, function ($user) use($start) {
                return $user['id'] > $start;
            }), 0, $per_page)
            : array_slice($users, -$per_page);
            // これだとprevで最新まで戻った時、per_page個より少ない数しか取得できないのでその場合はさらに足す
            // idがstart以下のものの後ろから、per_page個になるように
            if(count($paginated_users) < $per_page) {
                $paginated_users = array_merge(array_slice(array_filter($users, function($user) use($start) {
                    return $user['id'] <= $start;
                }), -($per_page - count($paginated_users))), $paginated_users);
            }
        }
        
        if($paginate === 'next') {
            // nextなので、idがlastより小さいものの中からper_page個だけ取り出す
            // lastがnull(初期表示)なら、配列の後ろからper_page個だけ取り出す
            $paginated_users = $last !== null ? array_slice(array_filter($users, function($user) use($last) {
                return $user['id'] < $last;
            }), -$per_page)
            : array_slice($users, -$per_page);
            // これだとnextで最後まで行った時、per_page個より少ない数しか取得できないのでその場合はさらに足す
            // idがlast以上のものの前から、per_page個になるように
            if(count($paginated_users) < $per_page) {
                $paginated_users = array_merge($paginated_users, array_slice(array_filter($users, function ($user) use($last) {
                    return $user['id'] >= $last;
                }), 0, $per_page - count($paginated_users)));
            }
        }

        return $paginated_users;
    }

    public function auth()
    {
        $auth_user = Auth::user();

        return response()->json([
            'status' => $auth_user ? true : false,
            'user' => $auth_user,
        ]);
    }

    public function index()
    {
        $users = User::get();

        return response()->json([
            'status' => true,
            'users' => $users,
        ]);
    }

    public function show(Request $request)
    {
        if(User::where('screen_name', $request->screen_name)->exists() === false) {
            return response()->json([
                'status' => false,
                'message' => 'This user does not exist'
            ]);
        }

        $target_user = User::with([
            'followers', 'follows', 'posts', 'likes',
            'wordles.user', 'wordles.tags', 'wordles.likes',
            'wordleLikes.user', 'wordleLikes.tags', 'wordleLikes.likes',
            'games.user', 'games.gameUsers.user', 'games.gameLogs',
            'joiningGames.user', 'joiningGames.gameUsers.user', 'joiningGames.gameLogs',
            // 投稿関連は数を取得する以外に今は使っていない
        ])->where('screen_name', $request->screen_name)->first();

        $ff_checked_target_user = $this->ffCheck([$target_user])[0];

        return response()->json([
            'status' => true,
            'user' => $ff_checked_target_user,
            // 'user' => $target_user
        ]);
    }

    public function updateProfile(ProfileUpdateRequest $request)
    {
        $validator = $request->getValidator();
        if($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->errors(),
            ]);
        }

        $user = $request->user();

        $user->update([
            'name' => $request->name,
            'description' => $request->description,
            'age' => $request->age,
            'gender' => $request->gender
        ]);

        return response()->json([
            'status' => true,
            'user' => $user
        ]);
    }

    public function updateScreenName()
    {

    }

    public function updatePassword()
    {

    }

    public function followToggle(Request $request)
    {
        $user = $request->user();
        $target_user = User::where('screen_name', $request->screen_name)->first();

        $toggle_result = $user->follows()->toggle($target_user->id);
        if(in_array($target_user->id, $toggle_result['attached'])) {
            $follow = true;
        }
        else if(in_array($target_user->id, $toggle_result['detached'])) {
            $follow = false;
        }

        // 通知を送る

        return response()->json([
            'status' => true,
            'follow' => $follow,
        ]);
    }

    public function follows(Request $request)
    {
        if(User::where('screen_name', $request->screen_name)->exists() === false) {
            return response()->json([
                'status' => false,
                'message' => 'This user does not exist'
            ]);
        }

        $follows = User::with([
            'follows.follows', 'follows.followers'
        ])->where('screen_name', $request->screen_name)->first()->follows;

        $paginated_follows = $this->paginateUser($follows, $request->per_page, $request->paginate, $request->start, $request->last);
        $ff_checked_follows = $this->ffCheck($paginated_follows);

        return response()->json([
            'status' => true,
            'users' => $ff_checked_follows
        ]);
    }

    public function followers(Request $request)
    {
        if(User::where('screen_name', $request->screen_name)->exists() === false) {
            return response()->json([
                'status' => false,
                'message' => 'This user does not exist'
            ]);
        }

        $followers = User::with([
            'followers.follows', 'followers.followers'
        ])->where('screen_name', $request->screen_name)->first()->followers;

        $paginated_followers = $this->paginateUser($followers, $request->per_page, $request->paginate, $request->start, $request->last);
        $ff_checked_followers = $this->ffCheck($paginated_followers);

        return response()->json([
            'status' => true,
            'users' => $ff_checked_followers
        ]);
    }
}
