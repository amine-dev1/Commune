<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SanctumAuthenticate
{
    public function handle(Request $request, Closure $next): Response
    {
        // Check for API token authentication
        if ($request->bearerToken() && Auth::guard('sanctum')->check()) {
            return $next($request);
        }

        // Check for session-based authentication
        if (Auth::check()) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Unauthenticated'
        ], 401);
    }
}