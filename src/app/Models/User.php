<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'screen_name',
        'name',
        'email',
        'password',
        'description',
        'age',
        'gender',
        'icon',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // フォロワー→フォロー
    public function followers()
    {
        return $this->belongsToMany('App\Models\User', 'follows', 'followed_user_id', 'following_user_id');
    }

    // フォロー→フォロワー
    public function follows()
    {
        return $this->belongsToMany('App\Models\User', 'follows', 'following_user_id', 'followed_user_id');
    }

    // ユーザーが所属しているグループ一覧
    public function groups() {
        return $this->belongsToMany('App\Models\Group', 'group_user', 'user_id', 'group_id');
    }

    // ユーザーのpost一覧
    public function posts() {
        return $this->hasMany(Post::class);
    }

    // ユーザーのlike一覧
    public function likes() {
        return $this->belongsToMany('App\Models\Post', 'likes', 'user_id', 'post_id');
    }

    // ユーザーのwordle一覧
    public function wordles() {
        return $this->hasMany(Wordle::class);
    }

    // ユーザーのlikeしたwordle一覧
    public function wordleLikes() {
        return $this->belongsToMany('App\Models\Wordle', 'wordle_likes', 'user_id', 'wordle_id');
    }

    // 作成したgame一覧
    public function games() {
        return $this->hasMany(Game::class, 'game_create_user_id');
    }

    // 参加しているgame一覧
    public function joiningGames() {
        return $this->belongsToMany('App\Models\Game', 'game_user', 'user_id', 'game_id');
    }

    // 参加しているgameのorderやresultが欲しい時
    public function gameUsers() {
        return $this->hasMany(GameUser::class);
    }

    public function wordle_comments() {
        return $this->hasMany(WordleComment::class);
    }
}
