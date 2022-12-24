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
        'input' => 'array'
    ];

    // これはゲームの作成者の方がいいのでは
    public function user() {
      return $this->belongsTo(User::class);
    }

    public function gameUsers()
    {
        return $this->hasMany(GameUser::class);
    }
    
    public function gameLogs() {
        return $this->hasMany(GameLog::class);
    }
}
