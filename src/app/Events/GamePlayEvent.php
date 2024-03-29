<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GamePlayEvent implements ShouldBroadcast
{
    use SerializesModels;

    public $current_game_status;

    public function __construct($current_game_status)
    {
        $this->current_game_status = $current_game_status;
    }
    
    public function broadcastOn()
    {
        return new PresenceChannel('game_play.' . $this->current_game_status['game']['uuid']);
    }
}
