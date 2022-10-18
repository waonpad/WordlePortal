<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()->Notifications()->get();

        return response()->json([
            'notifications' => $notifications,
        ]);
    }

    public function unread(Request $request)
    {
        $unread_notifications = $request->user()->unreadNotifications()->get();

        return response()->json([
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
