<?php
namespace App\Events;

use App\Models\Post;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class GameFollowsEvent implements ShouldBroadcast
{
    use SerializesModels;

    public $game;

    public $event_type;

    public $user_id;

    public function __construct($game, $event_type, $user_id)
    {
        $this->game = $game;
        $this->event_type = $event_type;
        $this->user_id = $user_id;
    }

    public function broadcastOn()
    {
        return new Channel('game_follows.' . $this->user_id);
    }
}
