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

    private function paginateWordle($wordles, $per_page, $paginate, $start, $last,)
    {
        gettype($wordles) === 'object' ? $wordles = $wordles->toArray() : null;

        if($paginate === 'prev') {
            // prevなので、idがstartより大きいものの中からper_page個だけ取り出す
            // startがnull(初期表示)なら、配列の後ろからper_page個だけ取り出す
            $paginated_wordles = $start !== null ? array_slice(array_filter($wordles, function ($wordle) use($start) {
                return $wordle['id'] > $start;
            }), 0, $per_page)
            : array_slice($wordles, -$per_page);
            // これだとprevで最新まで戻った時、per_page個より少ない数しか取得できないのでその場合はさらに足す
            // idがstart以下のものの後ろから、per_page個になるように
            if(count($paginated_wordles) < $per_page) {
                $paginated_wordles = array_merge(array_slice(array_filter($wordles, function($wordle) use($start) {
                    return $wordle['id'] <= $start;
                }), -($per_page - count($paginated_wordles))), $paginated_wordles);
            }
        }
        
        if($paginate === 'next') {
            // nextなので、idがlastより小さいものの中からper_page個だけ取り出す
            // lastがnull(初期表示)なら、配列の後ろからper_page個だけ取り出す
            $paginated_wordles = $last !== null ? array_slice(array_filter($wordles, function($wordle) use($last) {
                return $wordle['id'] < $last;
            }), -$per_page)
            : array_slice($wordles, -$per_page);
            // これだとnextで最後まで行った時、per_page個より少ない数しか取得できないのでその場合はさらに足す
            // idがlast以上のものの前から、per_page個になるように
            if(count($paginated_wordles) < $per_page) {
                $paginated_wordles = array_merge($paginated_wordles, array_slice(array_filter($wordles, function ($wordle) use($last) {
                    return $wordle['id'] >= $last;
                }), 0, $per_page - count($paginated_wordles)));
            }
        }

        return $paginated_wordles;
    }

    private function wordleLikeCheck($wordles)
    {
        return array_map(function($wordle) {
            $wordle['like_status'] = in_array(Auth::id(), array_column($wordle['likes'], 'id'));
            return $wordle;
        }, $wordles);
    }

    public function index(Request $request)
    {
        $wordles = Wordle::with('user', 'tags', 'likes')->get();

        $paginated_wordles = $this->paginateWordle($wordles, $request->per_page, $request->paginate, $request->start, $request->last);
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

    public function follows(Request $request)
    {
        $wordles = Wordle::with('user', 'tags', 'likes')->whereIn('user_id', User::find(Auth::user()->id)->follows()->pluck('followed_user_id'))->latest()->get();

        $paginated_wordles = $this->paginateWordle($wordles, $request->per_page, $request->paginate, $request->start, $request->last);
        $like_checked_wordles = $this->wordleLikeCheck($paginated_wordles);
        
        return response()->json([
            'wordles' => $like_checked_wordles,
            'status' => true
        ]);
    }

    public function user(Request $request)
    {
        $wordles = User::with('wordles.user', 'wordles.tags', 'wordles.likes')->where('screen_name', $request->screen_name)->first()->wordles;

        $paginated_wordles = $this->paginateWordle($wordles, $request->per_page, $request->paginate, $request->start, $request->last);
        $like_checked_wordles = $this->wordleLikeCheck($paginated_wordles);
        
        return response()->json([
            'wordles' => $like_checked_wordles,
            'status' => true
        ]);
    }

    public function userLikes(Request $request)
    {
        $wordles = User::with('wordleLikes.user', 'wordleLikes.tags', 'wordleLikes.likes')->where('screen_name', $request->screen_name)->first()->wordleLikes;

        $paginated_wordles = $this->paginateWordle($wordles, $request->per_page, $request->paginate, $request->start, $request->last);
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
               'message' => 'Wordleが存在しないか削除権限が無い',
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

        $paginated_wordles = $this->paginateWordle($wordles, $request->per_page, $request->paginate, $request->start, $request->last);
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

        return response()->json([
            'status' => true,
            'like_status' => $like_status,
        ]);
    }

    public function tag(Request $request)
    {
        $wordles = Tag::with('wordles.tags', 'wordles.user', 'wordles.likes')->find($request->wordle_tag_id)->wordles ?? [];
        $paginated_wordles = $this->paginateWordle($wordles, $request->per_page, $request->paginate, $request->start, $request->last);
        $like_checked_wordles = $this->wordleLikeCheck($paginated_wordles);

        return response()->json([
            'status' => true,
            'wordles' => $like_checked_wordles,
        ]);
    }
}
