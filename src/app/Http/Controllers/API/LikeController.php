<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    public function likeToggle(Request $request) {
        $user = Auth::user();
        $toggle_result = $user->likes()->toggle($request->post_id);

        if(in_array($request->post_id, $toggle_result['attached'])) {
            $like_status = true;
        }
        else if(in_array($request->post_id, $toggle_result['detached'])) {
            $like_status = false;
        }

        // 通知を送る

        return response()->json([
            'status' => true,
            'like_status' => $like_status,
        ]);
    }
}
