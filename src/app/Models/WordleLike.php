<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class WordleLike extends Pivot
{
    use HasFactory;

    protected $fillable = ['user_id', 'wordle_id'];

    protected $table = 'wordle_likes';

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function wordle()
    {
        return $this->belongsTo(Wordle::class, 'wordle_id', 'id');
    }
}
