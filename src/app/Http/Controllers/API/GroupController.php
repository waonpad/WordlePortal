<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Group;

class GroupController extends Controller
{
    public function show(Request $request)
    {
        $group = Group::with('groupUsers')->where('screen_name', $request->screen_name)->first();

        return response()->json([
            'status' => true,
            'group' => $group
        ]);
    }
}
