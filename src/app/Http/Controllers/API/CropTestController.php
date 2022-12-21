<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CropTest;

class CropTestController extends Controller
{
    public function index(Request $request)
    {
        $images = CropTest::get();

        return response()->json([
            'status' => true,
            'req' => $request->user()->id,
            'images' => $images
        ]); 
    }

    public function create(Request $request)
    {
        // ファイル名を取得
        $filename = $request->image_url->name;

        // blobデータをstorageに保存する
        // diskの指定を特にしなければ、例の場合。`storage/app/images/`に画像が保存される
        $path = $request->image_url->storeAs('images', $filename);

        CropTest::create([
            'user_id' => Auth::user()->id,
            // 'image_url' => base64_encode($request->image_url)
            'path' => $path
        ]);
        
        $images = CropTest::get();

        return response()->json([
            'status' => true,
            'image_url' => $request->image_url,
            '64image_url' => base64_encode($request->image_url),
            'path' => $path,
            'images' => $images
        ]);
    }
}
