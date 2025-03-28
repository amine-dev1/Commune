<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getUser(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        return response()->json([
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'cin' => $user->cin,
            'phone' => $user->phone,
            'address' => $user->address,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at
        ]);
    }
}
?>