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
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->unsignedBigInteger('wordle_id')->nullable();
            $table->foreign('wordle_id')->references('id')->on('wordles')->nullOnDelete();
            $table->string('name');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
            $table->json('words');
            $table->integer('min');
            $table->integer('max');
            $table->json('input');
            $table->string('description')->nullable();
            $table->json('tags');
            $table->unsignedBigInteger('game_create_user_id')->nullable();
            $table->foreign('game_create_user_id')->references('id')->on('users')->nullOnDelete();
            $table->string('answer');
            $table->integer('max_participants');
            $table->integer('laps');
            $table->boolean('visibility');
            $table->integer('answer_time_limit');
            $table->boolean('coloring');
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('games');
    }
};
