<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use App\Models\Follow;
use Illuminate\Support\Facades\Auth;
use App\Notifications\CommonNotification;
use App\Notifications\FollowNotification;
use Illuminate\Support\Facades\Notification;

class UserController extends Controller
{
    use \App\Http\Trait\DataManipulation;

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
            'followers', 'follows',
            'wordles.user', 'wordles.tags', 'wordles.likes',
            // 'wordleLikes.user', 'wordleLikes.tags', 'wordleLikes.likes',
            // 'games.user', 'games.gameUsers.user', 'games.gameLogs',
            // 'joiningGames.user', 'joiningGames.gameUsers.user', 'joiningGames.gameLogs',
            // 投稿関連は数を取得する以外に今は使っていない
        ])->where('screen_name', $request->screen_name)->first();

        $ff_checked_target_user = $this->ffCheck([$target_user])[0];

        return response()->json([
            'status' => true,
            'user' => $ff_checked_target_user
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
        if($follow === true) {
            $record = Follow::with('following', 'followed')->where('following_user_id', $user->id)->where('followed_user_id', $target_user->id)->first();
            
            Notification::send([$target_user], new FollowNotification($record));
        }

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

        $paginated_follows = $this->paginate($follows, 'id', $request->per_page, $request->paginate, $request->start, $request->last);
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

        $paginated_followers = $this->paginate($followers, 'id', $request->per_page, $request->paginate, $request->start, $request->last);
        $ff_checked_followers = $this->ffCheck($paginated_followers);

        return response()->json([
            'status' => true,
            'users' => $ff_checked_followers
        ]);
    }
}
