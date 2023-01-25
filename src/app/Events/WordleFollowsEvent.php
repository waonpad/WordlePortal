<?php
namespace App\Events;

use App\Models\Post;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class WordleFollowsEvent implements ShouldBroadcast
{
    use SerializesModels;

    public $wordle;

    public $event_type;

    public $user_id;

    public function __construct($wordle, $event_type, $user_id)
    {
        $this->wordle = $wordle;
        $this->event_type = $event_type;
        $this->user_id = $user_id;
    }

    public function broadcastOn()
    {
        return new Channel('wordle_follows.' . $this->user_id);
    }
}
