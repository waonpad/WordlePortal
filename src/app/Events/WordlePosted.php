<?php
namespace App\Events;

use App\Models\Post;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class WordlePosted implements ShouldBroadcast
{
    use SerializesModels;

    public $wordle;

    public $event_type;

    public function __construct($wordle, $event_type)
    {
        $this->post = $wordle;
        $this->event_type = $event_type;
    }

    public function broadcastOn()
    {
        return new Channel('wordle');
    }
}
