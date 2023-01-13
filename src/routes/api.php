<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController; 
use App\Http\Controllers\API\UserController;
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

use App\Http\Controllers\API\CropTestController;

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

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user(); // ログイン中のユーザー情報を取得
// });

Route::middleware('auth:sanctum')->group(function() {
});

// 認証
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// ユーザー
Route::prefix('user')->group(function (){
    Route::get('auth', [UserController::class, 'auth']);
    Route::get('index', [UserController::class, 'index']);
    Route::get('show', [UserController::class, 'show']);
    Route::prefix('update')->group(function (){
        Route::post('profile', [UserController::class, 'updateProfile'])->middleware('auth');
        Route::post('screenname', [UserController::class, 'updateScreenName'])->middleware('auth');
        Route::post('password', [UserController::class, 'updatePassword'])->middleware('auth');
    });
    Route::post('followtoggle', [UserController::class, 'followToggle'])->middleware('auth');
});

// ログアウト
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth');

// 投稿
Route::prefix('post')->group(function (){
    Route::get('index', [PostController::class, 'index']);
    Route::get('show', [PostController::class, 'show']);
    Route::post('upsert', [PostController::class, 'upsert'])->middleware('auth');
    Route::post('destroy', [PostController::class, 'destroy'])->middleware('auth');
    Route::post('search', [PostController::class, 'search']);
    Route::post('liketoggle', [LikeController::class, 'likeToggle'])->middleware('auth');
    Route::get('category', [PostController::class, 'category']);
});

// プライベートチャット
Route::post('privatepost', [PrivatePostController::class, 'privatePost'])->middleware('auth');

// グループ
Route::prefix('group')->group(function (){
    Route::get('show', [GroupController::class, 'show'])->middleware('auth');
    Route::post('create', [GroupController::class, 'create'])->middleware('auth');
    // Route::post('join', [GroupUserController::class, 'join']);
    // Route::post('leave', [GroupUserController::class, 'leave']);
    Route::post('post', [GroupPostController::class, 'post'])->middleware('auth');
});

// 通知
Route::prefix('notification')->group(function (){
    Route::get('index', [NotificationController::class, 'index'])->middleware('auth');
    Route::get('unread', [NotificationController::class, 'unread'])->middleware('auth');
    Route::post('read', [NotificationController::class, 'read'])->middleware('auth');
    Route::post('readall', [NotificationController::class, 'readAll'])->middleware('auth');
});


// Wordles
Route::prefix('wordle')->group(function (){
    Route::get('index', [WordleController::class, 'index']);
    Route::get('follows', [WordleController::class, 'follows']);
    Route::get('user', [WordleController::class, 'user']);
    Route::get('userlikes', [WordleController::class, 'userLikes']);
    Route::post('upsert', [WordleController::class, 'upsert'])->middleware('auth');
    Route::get('show', [WordleController::class, 'show'])->middleware('auth');
    Route::post('destroy', [WordleController::class, 'destroy'])->middleware('auth');
    Route::get('search', [WordleController::class, 'search']);
    Route::post('liketoggle', [WordleController::class, 'likeToggle'])->middleware('auth');
    Route::get('tag', [WordleController::class, 'tag']);

    // comments
    Route::prefix('comment')->group(function (){
        Route::post('upsert', [CommentController::class, 'upsert'])->middleware('auth');
        Route::post('destroy', [CommentController::class, 'destroy'])->middleware('auth');
    });

    // games
    Route::prefix('game')->group(function (){
        Route::get('index', [GameController::class, 'index']);
        Route::get('follows', [GameController::class, 'follows']);
        Route::get('user', [GameController::class, 'user']);
        Route::get('userjoining', [GameController::class, 'userJoining']);
        Route::post('upsert', [GameController::class, 'upsert'])->middleware('auth');
        Route::get('show', [GameController::class, 'show'])->middleware('auth');
        Route::get('search', [GameController::class, 'search']);
        Route::get('tag', [GameController::class, 'tag']);
        // Route::post('entry', [GameController::class, 'entry'])->middleware('auth');
        // Route::post('leave', [GameController::class, 'leave'])->middleware('auth');
        // Route::post('ready', [GameController::class, 'ready'])->middleware('auth');
        Route::post('start', [GameController::class, 'start'])->middleware('auth');
        Route::post('input', [GameController::class, 'input'])->middleware('auth');
        Route::post('destroy', [GameController::class, 'destroy'])->middleware('auth');
        // Route::post('skip', [GameController::class, 'skip'])->middleware('auth');
    });
});


Route::get('cropindex', [CropTestController::class, 'index'])->middleware('auth');
Route::post('croptest', [CropTestController::class, 'create'])->middleware('auth');