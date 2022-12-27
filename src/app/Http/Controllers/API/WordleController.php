<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Wordle;
use App\Models\Tag;
use App\Models\WordleTag;
use App\Events\WordleEvent;
use App\Events\WordleTagEvent;
use App\Http\Requests\WordleUpsertRequest;

class WordleController extends Controller
{
    private function eventHandler($wordle, $event_type, $sync_tags, $dettached_tags = [])
    {
        event(new WordleEvent($wordle, $event_type));

        foreach($sync_tags as $tag) {
            event(new WordleTagEvent($wordle, $event_type, $tag->id));
        }

        foreach($dettached_tags as $tag) {
            event(new WordleTagEvent($wordle, 'destroy', $tag->id));
        }
    }

    public function index()
    {
        $wordles = Wordle::with('user', 'tags', 'likes')->get();

        foreach($wordles as $wordle) {
            $wordle['like_status'] = in_array(Auth::id(), $wordle->likes->pluck('id')->toArray());
        };

        return response()->json([
            'wordles' => $wordles,
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
        $recognized_words = array_unique(array_filter($request->words, function($value){
            if( empty($value) && $value !== '0' && $value !== 0 ) {
                return false;
            } else {
                return true;
            }
        }));
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

        return response()->json([
            'status' => true
        ]);
    }
    
    public function show(Request $request)
    {
        $wordle = Wordle::with('user', 'tags', 'likes')->find($request->wordle_id);

        return response()->json([
            'wordle' => $wordle,
            'status' => true
        ]);
    }
    
    public function destroy(Request $request)
    {
        $wordle = Wordle::find($request->wordle_id);
        
        if ($wordle->user_id === Auth::user()->id) {
            Wordle::destroy($wordle->id);

            $this->eventHandler($wordle, 'destroy', $wordle->tags);

            return response()->json([
                'status' => true
            ]);
        }
        else {
            return response()->json([
               'message' => 'Wordleが存在しないか削除権限が無い',
               'status' => false
            ]);
        }
    }
    
    public function search(Request $request)
    {
        $wordles = Wordle::where('user_id', $request->user()->id)->with('user', 'tags', 'likes')->get();

        return response()->json([
            'wordles' => $wordles,
            'status' => true
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

        return response()->json([
            'status' => true,
            'like_status' => $like_status,
        ]);
    }

    public function tag(Request $request)
    {
        $wordles = Tag::with('wordles.tags', 'wordles.user', 'wordles.likes')->find($request->tag_id)->wordles;

        foreach($wordles as $wordle) {
            $post['like_status'] = in_array(Auth::id(), $wordle->likes->pluck('id')->toArray());
        };

        return response()->json([
            'status' => true,
            'wordles' => $wordles,
        ]);
    }
}
