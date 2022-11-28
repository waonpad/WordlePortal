<?php
namespace App\Events;

use App\Models\PrivatePost;
use App\Models\User;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PrivatePosted implements ShouldBroadcast
{
    use SerializesModels;

    /**
     * @var privatePost
     */
    public $private_post;

    public $user;

    public $disp_user_id;

    /**
     * Posted constructor.
     * @param PrivatePost $private_post
     * 
     */
    public function __construct(PrivatePost $private_post, User $user, $disp_user_id)
    {
        $this->private_post = $private_post;
        $this->user = $user;
        $this->disp_user_id = $disp_user_id;
    }

    /**
     * @return PrivateChannel|PrivateChannel[]
     */
    public function broadcastOn()
    {
        if($this->user->id > $this->disp_user_id) {
            $channelname = $this->user->id . '-' . $this->disp_user_id;
        }
        else {
            $channelname = $this->disp_user_id . '-' . $this->user->id;
        }

        return new PrivateChannel('private_post.' . $channelname);
    }

    public function broadcastWith()
    {
        return [
            'private_post' => $this->private_post,
            'user' => $this->user
        ];
    }
}