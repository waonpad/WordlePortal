<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'user_id',
        'type',
        'log'
    ];

    protected $casts = [
        'log' => 'json',
    ];

    public function game() {
        return $this->belongsTo(Game::class);
    }
}
