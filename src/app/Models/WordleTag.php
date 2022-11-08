<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class WordleTag extends Pivot
{
    use HasFactory;

    protected $fillable = [
        'wordle_id',
        'tag_id'
    ];
    
    protected $table = 'wordle_tags';
}
