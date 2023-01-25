<?php
namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class WordleCommentEvent implements ShouldBroadcast
{
    use SerializesModels;

    public $wordle_comment;

    public $event_type;

    public $wordle_id;

    public function __construct($wordle_comment, $event_type, $wordle_id)
    {
        $this->wordle_comment = $wordle_comment;
        $this->event_type = $event_type;
        $this->wordle_id = $wordle_id;
    }

    public function broadcastOn()
    {
        return new Channel('wordle_comment.' . $this->wordle_id);
    }
}
