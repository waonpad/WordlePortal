<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Events\PrivatePosted;
use App\Models\PrivatePost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PrivatePostController extends Controller
{
    public function privatePost(Request $request) {
        
        $user = Auth::user();

        $private_post = PrivatePost::create([
            'send_user_id' => $user->id,
            'receive_user_id' => $request->disp_user_id,
            'text' => $request->text,
        ]);

        event(new PrivatePosted($private_post, $user, $request->disp_user_id));

        return response()->json([
            'message' => '投稿しました。'
        ]);
    }
}
