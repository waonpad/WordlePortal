<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Notifications\DatabaseNotification as BaseNotification;
class DatabaseNotification extends BaseNotification
{
    public function resource()
    {
        return $this->morphTo();
    }
}