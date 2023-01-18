<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\WordleComment;
use App\Http\Requests\WordleCommentUpsertRequest;

class WordleCommentController extends Controller
{
    use \App\Http\Trait\DataManipulation;

    public function comments(Request $request)
    {
        $wordle_comments = WordleComment::with('user')->where('wordle_id', $request->wordle_id)->get();

        $paginated_wordle_comments = $this->paginate($wordle_comments, $request->per_page, $request->paginate, $request->start, $request->last);

        return response()->json([
            'status' => true,
            'wordle_comments' => $paginated_wordle_comments
        ]);
    }

    public function upsert(WordleCommentUpsertRequest $request)
    {
        $validator = $request->getValidator();
        if($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->errors(),
            ]);
        }
        
        $wordle_comment = WordleComment::updateOrCreate(
            ['id' => $request->wordle_comment_id],
            [
                'wordle_id' => $request->wordle_id,
                'user_id' => Auth::user()->id,
                'wordle_comment' => $request->wordle_comment,
            ]
        );

        // ページに通知する処理を後から作る

        return response()->json([
            'status' => true
        ]);
    }

    public function destroy(Request $request)
    {
        $wordle_comment = WordleComment::find($request->wordle_comment_id);
        
        if ($wordle_comment->user_id === Auth::user()->id) {
            WordleComment::destroy($wordle_comment->id);

            // ページに通知する処理を後から作る

            return response()->json([
                'status' => true
            ]);
        }
        else {
            return response()->json([
               'message' => 'Commentが存在しないか削除権限が無い' 
            ]);
        }
    }
}
