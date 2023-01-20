<?php

namespace App\Notifications\Channels;
use Illuminate\Notifications\Channels\DatabaseChannel as BaseDatabaseChannel;
use Illuminate\Notifications\Notification;
class DatabaseChannel extends BaseDatabaseChannel
{
    protected function buildPayload($notifiable, Notification $notification)
    {
        return [
            'id' => $notification->id,
            'type' => get_class($notification),
            'data' => $this->getData($notifiable, $notification),
            'read_at' => null,
            'resource_type' => isset($notification->resource) ? get_class($notification->resource) : null,
            'resource_id' => isset($notification->resource) ? $notification->resource->getKey() : null,
            // use Illuminate\Notifications\Notification にpublic $resourceを追加する
        ];
    }
}