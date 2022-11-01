<?php
namespace App\Events;

use App\Models\Post;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class CategoryPosted implements ShouldBroadcast
{
    use SerializesModels;

    /**
     * @var Post
     */
    public $post;

    public $event_type;

    public $category_id;

    /**
     * Posted constructor.
     * @param Post $post
     */
    public function __construct($post, $event_type, $category_id)
    {
        $this->post = $post;
        $this->event_type = $event_type;
        $this->category_id = $category_id;
    }

    /**
     * @return Channel|Channel[]
     */
    public function broadcastOn()
    {
        return new Channel('category_post.' . $this->category_id);
    }
}
