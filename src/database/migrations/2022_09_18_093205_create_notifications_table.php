<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->morphs('notifiable'); // どのモデルに通知したか
            $table->nullableMorphs('resource'); // どのモデルを通知に使ったか
            $table->json('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        // https://zakkuri.life/laravle-database-notification/
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifications');
    }
};
