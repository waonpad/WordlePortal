<?php

namespace App\Notifications;

use App\Models\Follow;
use App\Notifications\Channels\DatabaseChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class FollowNotification extends Notification
{
    use Queueable;

    public $resource;

    public function __construct(Follow $resource)
    {
        $this->resource = $resource;
    }

    public function via($notifiable)
    {
        return [DatabaseChannel::class, 'broadcast'];
    }
    
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'resource' => $this->resource,
            'resource_type' => 'App\\Models\\Follow'
        ]);
    }

    public function toArray($notifiable)
    {
        return [];
    }
}