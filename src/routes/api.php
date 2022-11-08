<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController; 
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\FollowController;
use App\Http\Controllers\API\PostController;
use App\Http\Controllers\API\PrivatePostController;
use App\Http\Controllers\API\GroupController;
// use App\Http\Controllers\API\GroupUserController;
use App\Http\Controllers\API\GroupPostController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\LikeController;
use App\Http\Controllers\API\WordleController;
use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\API\GameController;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Broadcast::routes(['middleware' => ['auth:sanctum']]);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user(); // ログイン中のユーザー情報を取得
});

// 常時使用可能 ////////////////////////////////////////////
// 認証
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// ユーザー
Route::prefix('user')->group(function (){
    Route::get('index', [UserController::class, 'index']);
    Route::get('show', [UserController::class, 'show']);
    Route::get('update', [UserController::class, 'update']);
});

// ログイン中のみ使用可能 ///////////////////////////////////
Route::middleware('auth:sanctum')->group(function() {

    // ユーザー
    Route::prefix('user')->group(function (){
        Route::get('update', [UserController::class, 'update']);
    });

    // ログアウト
    Route::post('logout', [AuthController::class, 'logout']);

    // フォロー
    Route::post('followtoggle', [FollowController::class, 'followToggle']);

    // 投稿
    Route::prefix('post')->group(function (){
        Route::get('index', [PostController::class, 'index']);
        Route::get('show', [PostController::class, 'show']);
        Route::post('upsert', [PostController::class, 'upsert']);
        Route::post('destroy', [PostController::class, 'destroy']);
        Route::post('search', [PostController::class, 'search']);
        Route::post('liketoggle', [LikeController::class, 'likeToggle']);

        Route::get('category', [PostController::class, 'category']);
    });
    
    // プライベートチャット
    Route::post('privatepost', [PrivatePostController::class, 'privatePost']);

    // グループ
    Route::prefix('group')->group(function (){
        Route::get('show', [GroupController::class, 'show']);
        Route::post('create', [GroupController::class, 'create']);
        // Route::post('join', [GroupUserController::class, 'join']);
        // Route::post('leave', [GroupUserController::class, 'leave']);
        Route::post('post', [GroupPostController::class, 'post']);
    });

    // 通知
    Route::prefix('notification')->group(function (){
        Route::get('index', [NotificationController::class, 'index']);
        Route::get('unread', [NotificationController::class, 'unread']);
        Route::post('read', [NotificationController::class, 'read']);
        Route::post('readall', [NotificationController::class, 'readAll']);
    });

    
    // Wordles
    Route::prefix('wordle')->group(function (){
        Route::get('index', [WordleController::class, 'index']);
        Route::post('upsert', [WordleController::class, 'upsert']);
        Route::get('show', [WordleController::class, 'show']);
        Route::post('destroy', [WordleController::class, 'destroy']);
        Route::get('search', [WordleController::class, 'search']);
        Route::post('liketoggle', [WordleController::class, 'likeToggle']);
        Route::get('tag', [WordleController::class, 'tag']);

        // comments
        Route::prefix('comment')->group(function (){
            Route::post('upsert', [CommentController::class, 'upsert']);
            Route::post('destroy', [CommentController::class, 'destroy']);
        });

        // games
        Route::prefix('game')->group(function (){
            Route::post('create', [GameController::class, 'create']);
            Route::get('show', [GameController::class, 'show']);
            Route::get('search', [GameController::class, 'search']);
            Route::post('entry', [GameController::class, 'entry']);
            Route::post('leave', [GameController::class, 'leave']);
            Route::post('ready', [GameController::class, 'ready']);
            Route::post('start', [GameController::class, 'start']);
            Route::post('input', [GameController::class, 'input']);
        });
    });
});