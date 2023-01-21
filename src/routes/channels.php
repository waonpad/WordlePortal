<?php

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

// UserOriginalChannels

Broadcast::channel('category_post.{category_id}', function (){
    return true;
});

Broadcast::channel('wordle', function (){
    return true;
});

Broadcast::channel('wordle_tag.{tag_id}', function (){
    return true;
});

Broadcast::channel('game', function (){
    return true;
});

Broadcast::channel('game_tag.{tag_id}', function (){
    return true;
});

Broadcast::channel('game_play.{game_uuid}', function ($user, $game_uuid){
    return [
        'user' => $user
    ];
//     $user_id = GameUser::where('game_id', Game::where('uuid', $game_uuid)->first()->id)->where('user_id', $user->id)->first()->user_id;

//    if ($user->id === $user_id) {
//         return [
//             'user' => $user
//         ];
//     }
});