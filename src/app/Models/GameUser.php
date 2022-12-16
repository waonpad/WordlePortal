<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class GameUser extends Pivot
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'user_id',
        'status', // 多分いらない
        'order',
        'result'
    ];
    
    public function game() {
        return $this->belongsTo(Game::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
