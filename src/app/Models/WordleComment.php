<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WordleComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'wordle_id',
        'user_id',
        'comment',
    ];
    
    public function user() {
        return $this->belongsTo(User::class);
    }

    public function wordle() {
        return $this->belongsTo(Wordle::class);
    }
}
