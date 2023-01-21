<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Follow;
use App\Models\WordleLike;
use App\Models\WordleComment;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()->get();

        return response()->json([
            'status' => true,
            'notifications' => $notifications,
        ]);
    }

    public function unread(Request $request)
    {
        $unread_notifications = $request->user()->unreadNotifications()->get()
        ->loadMorph('resource', [
            Follow::class => ['following', 'followed'],
            WordleLike::class => ['user', 'wordle'],
            WordleComment::class => ['user', 'wordle']
        ]);

        return response()->json([
            'status' => true,
            'unread_notifications' => $unread_notifications,
        ]);
    }

    public function read(Request $request)
    {
        $notification = DatabaseNotification::find($request->notification_id);

        $notification->markAsRead();

        return response()->json([
            'status' => true,
        ]);
    }

    public function readAll(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'status' => true,
        ]);
    }
}
