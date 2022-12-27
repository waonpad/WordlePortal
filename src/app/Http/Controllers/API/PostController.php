<?php
declare(strict_types=1);

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Events\Posted;
use App\Events\CategoryPosted;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Requests\PostUpsertRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;

class PostController extends Controller
{

    public function index()
    {
        $posts = Post::with('categories', 'user', 'likes')->get();

        foreach($posts as $post) {
            $post['like_status'] = in_array(Auth::id(), $post->likes->pluck('id')->toArray());
        };

        return response()->json([
            'status' => true,
            'posts' => $posts
        ]);
    }

    public function upsert(PostUpsertRequest $request) {
        $validator = $request->getValidator();
        if($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->errors(),
            ]);
        } else {
            $user = Auth::user();

            $event_type = $request->id !== null ? 'update' : 'create';
        
            $post = Post::updateOrCreate(
                ['id' => $request->id],
                [
                    'title' => $request->title,
                    'comment' => $request->comment,
                    'user_id' => $user->id
                ]
            );

            $sync_categories = [];
            foreach ($request->categories as $category) {
                $target_category = Category::firstOrCreate(
                    ['name'=>$category],
                    [
                        'name'=>$category
                    ]
                );
                array_push($sync_categories, $target_category);
            }

            $post->categories()->sync(array_column($sync_categories, 'id'));
            $response_post = Post::with('categories', 'user', 'likes')->find($post->id);

            event(new Posted($response_post, $event_type));

            // 回すしかない？
            foreach($sync_categories as $category) {
                event(new CategoryPosted($response_post, $event_type, $category->id));
            }

            return response()->json([
                'status' => true,
                'upsert_status' => $event_type,
                'post' => $response_post,
            ]);
        }
    }
        
    public function show(Request $request)
    {
        $post = Post::find($request->post_id);

        return response()->json([
            'status' => true,
            'post' => $post
        ]);
    }

    public function destroy(Request $request)
    {
        $post = Post::find($request->post_id);
        
        if ($post->user_id === $request->user()->id) {
            Post::destroy($post->id);

            // 削除イベントを送信する

            return response()->json([
                'status' => true
            ]);
        }
        else {
            return response()->json([
                'status' => false,
                'message' => 'Postが存在しないか削除権限が無い'
            ]);
        }
    }

    public function search(Request $request)
    {
        $category = Category::where('name', $request->search)->first();
        
        return response()->json([
            'status' => true,
            'category' => $category,
        ]);
    }

    public function category(Request $request)
    {
        $posts = Category::with('posts.categories', 'posts.user', 'posts.likes')->find($request->category_id)->posts;

        foreach($posts as $post) {
            $post['like_status'] = in_array(Auth::id(), $post->likes->pluck('id')->toArray());
        };

        return response()->json([
            'status' => true,
            'posts' => $posts,
        ]);
    }
}