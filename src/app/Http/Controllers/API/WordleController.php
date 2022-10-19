<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wordle;
use App\Models\Tag;
use App\Models\WordleTag;
use App\Http\Requests\UpsertWordleRequest;

class WordleController extends Controller
{
    public function upsert(UpsertWordleRequest $request)
    {
        $validator = $request->getValidator();
        if($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->errors(),
            ]);
        } else {
            $wordle = Wordle::updateOrCreate(
                ['id'=>$request->wordle_id],
                [
                    'name'=>$request->name,
                    'user_id'=>$request->user()->id,
                    'words'=>$request->words,
                    'input'=>$request->input,
                    'description'=>$request->description,
                ]
            );

            $tag_id_array = [];
            foreach ($request->tags as $tag) {
                $target_tag_id = Tag::firstOrCreate(
                    ['name'=>$tag],
                    [
                        'name'=>$tag
                    ]
                )->id;
                array_push($tag_id_array, $target_tag_id);
            }
            
            $wordle->tags()->sync($tag_id_array);

            return response()->json([
                'status' => true
            ]);
        }
    }
    
    public function show(Request $request)
    {
        $wordle = Wordle::with('tags')->find($request->wordle_id);

        return response()->json([
            'wordle' => $wordle,
            'status' => true
        ]);
    }
    
    public function destroy(Request $request)
    {
        $wordle = Wordle::find($request->wordle_id);
        
        if ($wordle->user_id === $request->user()->id) {
            Wordle::destroy($wordle->id);

            return response()->json([
                'status' => true
            ]);
        }
        else {
            return response()->json([
               'message' => 'Wordleが存在しないか削除権限が無い',
               'status' => true
            ]);
        }
    }
    
    public function search(Request $request)
    {
        $wordles = Wordle::where('user_id', $request->user()->id)->with('tags')->get();

        return response()->json([
            'wordles' => $wordles,
            'status' => true
        ]);
    }
}
