<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
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
        $auth_user = Auth::user();

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

        $target_user['myself'] = $auth_user ? (($auth_user->id === $target_user->id) ? true : false) : false;
        $target_user['follow'] = $auth_user ? (in_array($auth_user->id, $target_user->followers->pluck('id')->toArray()) ? true : false) : false;
        $target_user['followed'] = $auth_user ? (in_array($auth_user->id, $target_user->follows->pluck('id')->toArray()) ? true : false) : false;

        return response()->json([
            'status' => true,
            'user' => $target_user
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request)
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
}
