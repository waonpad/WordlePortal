<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'uuid',
        'wordle_id',
        'name',
        'user_id',
        'words',
        'min',
        'max',
        'input',
        'description',
        'tags',
        'game_create_user_id',
        'answer',
        'max_participants',
        'laps',
        'visibility',
        'answer_time_limit',
        'coloring',
        'status'
    ];

    protected $hidden = [
        'answer'
    ];
    
    protected $casts = [
        'words' => 'array',
        'input' => 'array',
        'tags' => 'array'
    ];

    public function user() {
      return $this->belongsTo(User::class, 'game_create_user_id');
    }
    
    // 参加しているユーザー一覧(直リレーション)
    public function joiningUsers() {
        return $this->belongsToMany('App\Models\User', 'game_user', 'game_id', 'user_id');
    }

    // 参加しているユーザー一覧(gameでの情報)
    public function gameUsers()
    {
        return $this->hasMany(GameUser::class);
    }
    
    public function gameLogs() {
        return $this->hasMany(GameLog::class);
    }
}
