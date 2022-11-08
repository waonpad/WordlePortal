<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wordle extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'user_id',
        'words',
        'input',
        'description'
    ];

    protected $casts = [
        'words' => 'array',
        'input' => 'array'
    ];

    public function user() {
      return $this->belongsTo(User::class);
    }
    
    public function tags()
    {
        return $this->belongsToMany('App\Models\Tag', 'wordle_tag', 'wordle_id', 'tag_id');
    }

    public function likes() {
        return $this->belongsToMany('App\Models\User', 'wordle_likes', 'wordle_id', 'user_id');
    }
}
