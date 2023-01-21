<?php

namespace App\Notifications;

use App\Models\WordleComment;
use App\Notifications\Channels\DatabaseChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class WordleCommentNotification extends Notification
{
    use Queueable;

    public $resource;

    public function __construct(WordleComment $resource)
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
            'resource_type' => 'App\\Models\\WordleComment'
        ]);
    }

    public function toArray($notifiable)
    {
        return [];
    }
}