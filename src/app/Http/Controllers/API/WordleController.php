<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Wordle;
use App\Models\Tag;
use App\Models\WordleTag;
use App\Events\WordleEvent;
use App\Events\WordleFollowsEvent;
use App\Events\WordleTagEvent;
use App\Http\Requests\WordleUpsertRequest;
use App\Models\WordleLike;
use App\Notifications\WordleLikeNotification;
use Illuminate\Support\Facades\Notification;

class WordleController extends Controller
{
    use \App\Http\Trait\DataManipulation;

    private function eventHandler($wordle, $event_type, $sync_tags, $dettached_tags = [])
    {
        $auth_user = User::find(Auth::user()->id);

        event(new WordleEvent($wordle, $event_type));

        foreach($sync_tags as $tag) {
            event(new WordleTagEvent($wordle, $event_type, $tag->id));
        }

        foreach($dettached_tags as $tag) {
            event(new WordleTagEvent($wordle, 'destroy', $tag->id));
        }

        foreach($auth_user->followers()->get()->toArray() as $follower) {
            event(new WordleFollowsEvent($wordle, $event_type, $follower['id']));
        }
    }

    public function index(Request $request)
    {
        $wordles = Wordle::with('user', 'tags', 'likes')->get();

        $paginated_wordles = $this->paginate($wordles, 'id', $request->per_page, $request->paginate, $request->start, $request->last);
        $like_checked_wordles = $this->wordleLikeCheck($paginated_wordles);

        return response()->json([
            'wordles' => $like_checked_wordles,
            'status' => true
        ]);
    }

    public function upsert(WordleUpsertRequest $request)
    {
        $validator = $request->getValidator();
        if($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->errors(),
            ]);
        }

        // 空要素を削除、重複削除した結果wordが10個無ければエラー
        $recognized_words = array_unique(array_map(function($word){
            return mb_convert_kana(strtoupper($word), "KVCn"); // 大文字小文字、ひらがなカタカナを合わせる
        }, array_filter($request->words, function($value){
            if( empty($value) && $value !== '0' && $value !== 0 ) {
                return false;
            } else {
                return true;
            }
        })));
        $recognized_words = array_values($recognized_words);
        if(count($recognized_words) < 10) {
            return response()->json([
                'validation_errors' => [
                    'words' => 'words field must have at least 10 items & must be unique',
                ]
            ]);
        }

        $event_type = $request->id !== null ? 'update' : 'create';

        $wordle = Wordle::updateOrCreate(
            ['id' => $request->id],
            [
                'name' => $request->name,
                'user_id' => Auth::user()->id,
                'words' => $recognized_words,
                'input' => $request->input,
                'description' => $request->description,
            ]
        );

        $sync_tags = [];
        foreach ($request->tags as $tag) {
            $target_tag = Tag::firstOrCreate(
                ['name' => $tag],
                [
                    'name' => $tag
                ]
            );
            array_push($sync_tags, $target_tag);
        }
        
        // 解除されたタグを取得する
        $dettached_tags = json_decode(json_encode(array_filter($wordle->tags->toArray(), function($tag) use($sync_tags) {
            return !in_array($tag['id'], array_column($sync_tags, 'id'));
        })));
        
        // ここで更新された後のタグだけに変わる
        $wordle->tags()->sync(array_column($sync_tags, 'id'));
        $response_wordle = Wordle::with('user', 'tags', 'likes')->find($wordle->id);

        $this->eventHandler($response_wordle, $event_type, $sync_tags, $dettached_tags);

        $auth_user = User::find(Auth::user()->id);

        return response()->json([
            'status' => true,
            'fo' => $auth_user->followers()->get()->toArray()
        ]);
    }
    
    public function show(Request $request)
    {
        $wordle = Wordle::with('user', 'tags', 'likes')->find($request->wordle_id);

        $words = Auth::user()->id === $wordle->user_id ? $wordle->words : [];

        return response()->json([
            'wordle' => $wordle,
            'words' => $words,
            'status' => true
        ]);
    }

    public function manage(Request $request)
    {

        $wordle = Wordle::with('user', 'tags', 'likes')->find($request->wordle_id);

        if(Auth::user()->id !== $wordle->user_id) {
            return response()->json([
                'status' => false,
                'message' => 'You are not this wordle manager'
            ]);
        }

        $words = Auth::user()->id === $wordle->user_id ? $wordle->words : [];

        return response()->json([
            'wordle' => $wordle,
            'words' => $words,
            'status' => true
        ]);
    }

    public function follows(Request $request)
    {
        $wordles = Wordle::with('user', 'tags', 'likes')->whereIn('user_id', User::find(Auth::user()->id)->follows()->pluck('followed_user_id'))->latest()->get();

        $paginated_wordles = $this->paginate($wordles, 'id', $request->per_page, $request->paginate, $request->start, $request->last);
        $like_checked_wordles = $this->wordleLikeCheck($paginated_wordles);
        
        return response()->json([
            'wordles' => $like_checked_wordles,
            'status' => true
        ]);
    }

    public function user(Request $request)
    {
        $wordles = User::with('wordles.user', 'wordles.tags', 'wordles.likes')->where('screen_name', $request->screen_name)->first()->wordles;

        $paginated_wordles = $this->paginate($wordles, 'id', $request->per_page, $request->paginate, $request->start, $request->last);
        $like_checked_wordles = $this->wordleLikeCheck($paginated_wordles);
        
        return response()->json([
            'wordles' => $like_checked_wordles,
            'status' => true
        ]);
    }

    public function userLikes(Request $request)
    {
        $wordles = User::with('wordleLikes.user', 'wordleLikes.tags', 'wordleLikes.likes')->where('screen_name', $request->screen_name)->first()->wordleLikes;

        $paginated_wordles = $this->paginate($wordles, 'id', $request->per_page, $request->paginate, $request->start, $request->last);
        $like_checked_wordles = $this->wordleLikeCheck($paginated_wordles);
        
        return response()->json([
            'wordles' => $like_checked_wordles,
            'status' => true
        ]);
    }
    
    public function destroy(Request $request)
    {
        $wordle = Wordle::find($request->wordle_id);
        
        if ($wordle->user_id === Auth::user()->id) {
            $this->eventHandler($wordle, 'destroy', $wordle->tags);
            
            Wordle::destroy($wordle->id);

            return response()->json([
                'status' => true
            ]);
        }
        else {
            return response()->json([
               'message' => "You can't delete wordle",
               'status' => false
            ]);
        }
    }
    
    public function search(Request $request)
    {
        $keyword = $request->wordle_search_param;

        $wordles = Wordle::with('user', 'tags', 'likes')
        ->where('name', 'LIKE', "%{$keyword}%") // 部分一致
        ->orWhereHas('tags', function ($query) use ($keyword){
            $query->where('name', '=', $keyword); // 完全一致
        })
        ->get();

        $paginated_wordles = $this->paginate($wordles, 'id', $request->per_page, $request->paginate, $request->start, $request->last);
        $like_checked_wordles = $this->wordleLikeCheck($paginated_wordles);

        return response()->json([
            'wordles' => $like_checked_wordles,
            'status' => true,
        ]);
    }

    public function likeToggle(Request $request) {
        $user = $request->user();
        $toggle_result = $user->wordleLikes()->toggle($request->wordle_id);

        if(in_array($request->wordle_id, $toggle_result['attached'])) {
            $like_status = true;
        }
        else if(in_array($request->wordle_id, $toggle_result['detached'])) {
            $like_status = false;
        }

        // 通知を送る
        if($like_status === true) {
            $wordle = Wordle::with('user')->find($request->wordle_id);
            $record = WordleLike::with('user', 'wordle')->where('user_id', $user->id)->where('wordle_id', $request->wordle_id)->first();
            
            Notification::send([$wordle->user], new WordleLikeNotification($record));
        }

        return response()->json([
            'status' => true,
            'like_status' => $like_status,
        ]);
    }

    public function tag(Request $request)
    {
        $wordles = Tag::with('wordles.tags', 'wordles.user', 'wordles.likes')->find($request->wordle_tag_id)->wordles ?? [];
        $paginated_wordles = $this->paginate($wordles, 'id', $request->per_page, $request->paginate, $request->start, $request->last);
        $like_checked_wordles = $this->wordleLikeCheck($paginated_wordles);

        return response()->json([
            'status' => true,
            'wordles' => $like_checked_wordles,
        ]);
    }
}
