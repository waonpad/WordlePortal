<?php

use App\Models\GroupUser;
use App\Models\Game;
use App\Models\GameUser;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// SampleChannels

Broadcast::channel('post', function (){
    return true;
});

// https://laracasts.com/discuss/channels/laravel/laravel-echo-server-with-sanctum

Broadcast::channel('private_post.{channelname}', function ($user, $channelname){
    // return (int) $user->id === (int) $id;
    return preg_match('/' . $user->id . '/', $channelname);
});

Broadcast::channel('group_post.{group_id}', function ($user, $group_id){
    $user_id = GroupUser::where('group_id', $group_id)->where('user_id', $user->id)->first()->user_id;

   if ($user->id === $user_id) {
        return [
            'id' => $user->id,
            'screen_name' => $user->screen_name,
            'name' => $user->name,
        ];
    }
});

// UserOriginalChannels

Broadcast::channel('category_post.{category_id}', function (){
    return true;
});

Broadcast::channel('wordle', function (){
    return true;
});

Broadcast::channel('wordle_tag_post.{tag_id}', function (){
    return true;
});

Broadcast::channel('game.{game_uuid}', function ($user, $game_uuid){
    $user_id = GameUser::where('game_id', Game::where('uuid', $game_uuid)->first()->id)->where('user_id', $user->id)->first()->user_id;

   if ($user->id === $user_id) {
        return [
            'user' => $user
        ];
    }
});