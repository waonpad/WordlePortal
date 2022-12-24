<?php
namespace App\Events;

use App\Models\Post;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class WordleTagEvent implements ShouldBroadcast
{
    use SerializesModels;

    public $wordle;

    public $event_type;

    public $tag_id;

    public function __construct($wordle, $event_type, $tag_id)
    {
        $this->wordle = $wordle;
        $this->event_type = $event_type;
        $this->tag_id = $tag_id;
    }

    public function broadcastOn()
    {
        return new Channel('wordle_tag.' . $this->tag_id);
    }
}
