<?php
namespace App\Events;

use App\Models\Post;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class Posted implements ShouldBroadcast
{
    use SerializesModels;

    /**
     * @var Post
     */
    public $post;

    public $event_type;

    /**
     * Posted constructor.
     * @param Post $post
     */
    public function __construct($post, $event_type)
    {
        $this->post = $post;
        $this->event_type = $event_type;
    }

    /**
     * @return Channel|Channel[]
     */
    public function broadcastOn()
    {
        return new Channel('post');
    }
}
