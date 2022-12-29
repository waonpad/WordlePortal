<?php
namespace App\Events;

use App\Models\Post;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class GameEvent implements ShouldBroadcast
{
    use SerializesModels;

    public $game;

    public $event_type;

    public function __construct($game, $event_type)
    {
        $this->game = $game;
        $this->event_type = $event_type;
    }

    public function broadcastOn()
    {
        return new Channel('game');
    }
}
