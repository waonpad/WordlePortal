<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

// https://qiita.com/mitsu-0720/items/0c2fcdd367e8a6c5999c


class Follow extends Pivot
{
    protected $fillable = ['following_user_id', 'followed_user_id'];

    protected $table = 'follows';

    public function following()
    {
        return $this->belongsTo(User::class, 'following_user_id', 'id');
    }

    public function followed()
    {
        return $this->belongsTo(User::class, 'followed_user_id', 'id');
    }

}
