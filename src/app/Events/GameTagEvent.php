<?php
namespace App\Events;

use App\Models\Post;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class GameTagEvent implements ShouldBroadcast
{
    use SerializesModels;

    public $game;

    public $event_type;

    public $tag_id;

    public function __construct($game, $event_type, $tag_id)
    {
        $this->game = $game;
        $this->event_type = $event_type;
        $this->tag_id = $tag_id;
    }

    public function broadcastOn()
    {
        return new Channel('game_tag.' . $this->tag_id);
    }
}
