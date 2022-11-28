<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Game;

class GameEvent implements ShouldBroadcast
{
    use SerializesModels;

    public $game_log;

    public function __construct($game_log)
    {
        $this->game_log = $game_log;
    }
    
    public function broadcastOn()
    {
        return new PresenceChannel('game.' . Game::find($this->game_log->game_id)->uuid);
    }
}
