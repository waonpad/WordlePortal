<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GroupPost;
use App\Models\Group;
use App\Events\GroupPosted;
use App\Notifications\CommonNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Auth;

class GroupPostController extends Controller
{
    public function post(Request $request)
    {
        $user = Auth::user();

        $group_post = GroupPost::create([
            'user_id' => $user->id,
            'group_id' => $request->group_id,
            'text' => $request->text,
        ]);

        event(new GroupPosted($group_post, $user));

        $group = Group::where('id', $request->group_id)->first();
        $group_users = $group->groupUsers()->get();

        // Notification::send($group_users, new CommonNotification($group_post));

        return response()->json([
            'message' => '投稿しました。'
        ]);
    }
}
