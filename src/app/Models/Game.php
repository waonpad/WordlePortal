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

    public function gameUsers()
    {
        return $this->hasMany(GameUser::class);
    }
    
    public function gameLogs() {
        return $this->hasMany(GameLog::class);
    }
}
