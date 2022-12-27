<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Http\Requests\CommentUpsertRequest;

class CommentController extends Controller
{
    public function upsert(CommentUpsertRequest $request)
    {
        $validator = $request->getValidator();
        if($validator->fails()){
            return response()->json([
                'validation_errors'=>$validator->errors(),
            ]);
        }
        else {
            $comment = Comment::updateOrCreate(
                ['id'=>$request->comment_id],
                [
                    'wordle_id'=>$request->wordle_id,
                    'user_id'=>$request->user()->id,
                    'comment'=>$request->comment,
                ]
            );

            // ページに通知する処理を後から作る

            return response()->json([
                'status'=>true
            ]);
        }
    }

    public function destroy(Request $request)
    {
        $comment = Comment::find($request->comment_id);
        
        if ($comment->user_id === $request->user()->id) {
            Comment::destroy($comment->id);

            return response()->json([
                'status'=>200
            ]);
        }
        else {
            return response()->json([
               'message'=>'Commentが存在しないか削除権限が無い' 
            ]);
        }
    }
}
