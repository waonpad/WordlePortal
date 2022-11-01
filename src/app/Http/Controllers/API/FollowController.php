<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Follow;
use App\Notifications\CommonNotification;

class FollowController extends Controller
{
    public function followToggle(Request $request) {
        $user = $request->user();
        $target_user = User::where('screen_name', $request->screen_name)->first();

        $toggle_result = $user->follows()->toggle($target_user->id);
        if(in_array($target_user->id, $toggle_result['attached'])) {
            $follow_status = true;
        }
        else if(in_array($target_user->id, $toggle_result['detached'])) {
            $follow_status = false;
        }

        // 通知を送る

        return response()->json([
            'status' => true,
            'follow_status' => $follow_status,
        ]);
    }
}