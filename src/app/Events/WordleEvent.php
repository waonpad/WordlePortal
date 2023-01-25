<?php
namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class WordleEvent implements ShouldBroadcast
{
    use SerializesModels;

    public $wordle;

    public $event_type;

    public function __construct($wordle, $event_type)
    {
        $this->wordle = $wordle;
        $this->event_type = $event_type;
    }

    public function broadcastOn()
    {
        return new Channel('wordle');
    }
}
