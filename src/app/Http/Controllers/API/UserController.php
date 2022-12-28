<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
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
        $target_user = User::with([
            'followers', 'follows', 'posts', 'likes',
            'wordles.user', 'wordles.tags', 'wordles.likes',
            'wordleLikes.user', 'wordleLikes.tags', 'wordleLikes.likes',
            'games.user', 'games.gameUsers', 'games.gameLogs'
        ])->where('screen_name', $request->screen_name)->first();

        $myself = false;
        $follow = false;
        $followed = false;
        if($auth_user) {
            $myself = ($auth_user->id === $target_user->id) ? true : false;
            $follow = in_array($auth_user->id, $target_user->followers->pluck('id')->toArray()) ? true : false;
            $followed = in_array($auth_user->id, $target_user->follows->pluck('id')->toArray()) ? true : false;
        }

        return response()->json([
            'status' => true,
            'user' => $target_user,
            'myself' => $myself,
            'follow' => $follow,
            'followed' => $followed,
        ]);
    }

    public function update(Request $request)
    {
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
