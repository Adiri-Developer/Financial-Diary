<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class N8nBotAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $expectedKey = env('N8N_API_KEY');
        
        if (empty($expectedKey)) {
            return response()->json(['message' => 'N8N API Key is not configured on the server.'], 500);
        }

        $providedKey = $request->bearerToken() ?: $request->header('X-N8N-API-KEY');

        if ($providedKey !== $expectedKey) {
            return response()->json(['message' => 'Unauthorized. Invalid API Key.'], 401);
        }

        return $next($request);
    }
}
