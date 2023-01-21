<?php

namespace App\Notifications;

use App\Models\WordleLike;
use App\Notifications\Channels\DatabaseChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class WordleLikeNotification extends Notification
{
    use Queueable;

    public $resource;

    public function __construct(WordleLike $resource)
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
        ]);
    }

    public function toArray($notifiable)
    {
        return [];
    }
}