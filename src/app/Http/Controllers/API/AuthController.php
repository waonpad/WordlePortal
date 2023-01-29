<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function register(RegisterRequest $request){
        $validator = $request->getValidator();
        if($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->errors(),
            ]);
        }
        
        $icon = $request->icon;

        if($icon) {
            preg_match('/data:image\/(\w+);base64,/', $icon, $matches);
            $extension = $matches[1];
    
            $img = preg_replace('/^data:image.*base64,/', '', $icon);
            $img = str_replace(' ', '+', $img);
            $fileData = base64_decode($img);
    
            $dir = rtrim('user/icon', '/').'/';
            $fileName = md5($img);
            $path = $dir.$fileName.'.'.$extension;
    
            Storage::disk('public')->put($path, $fileData);   
        }

        $user = User::create([
            'icon' => $icon ? $path : null,
            'screen_name' => $request->screen_name,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'description' => $request->description,
            'age' => $request->age,
            'gender' => $request->gender
        ]);
        
        Auth::login($user, $remember = false);

        return response()->json([
            'user' => $user,
            'status' => true,
            'message' => 'Registerd Successfully'
        ]);
    }

    public function login(LoginRequest $request) {
        $validator = $request->getValidator();
        if ($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->errors(),
            ]);
        }

        if (!Auth::attempt(request(['email', 'password']))) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ]);
        }
        $user = User::whereEmail($request->email)->first();
        return response()->json([
            'user' => $user,
            'status' => true,
            'message' => 'ログインに成功しました。'
        ]);
    }

    public function logout (Request $request) {
        $request->session()->flush();
        return response()->json([
            'status' => true,
            'message' => 'ログアウト成功',
        ]);
    }
}