<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class HermesChatController extends Controller
{
    public function index()
    {
        return view('hermes.index');
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        try {
            $user = auth()->check() ? auth()->user() : null;
            $userIdentifier = $user ? \Illuminate\Support\Str::slug($user->name) : 'guest';
            
            $webhookUrl = env('N8N_WEBHOOK_URL');

            $http = Http::withoutVerifying();
            
            if (env('N8N_BASIC_AUTH_USER') && env('N8N_BASIC_AUTH_PASSWORD')) {
                $http = $http->withBasicAuth(env('N8N_BASIC_AUTH_USER'), env('N8N_BASIC_AUTH_PASSWORD'));
            }

            $response = $http->withHeaders([
                'Content-Type' => 'application/json',
                'X-Hermes-Session-Key' => session()->getId(),
            ])->post($webhookUrl, [
                // Format required by n8n "When chat message received" trigger
                'action' => 'sendMessage',
                'sessionId' => session()->getId(),
                'chatInput' => $request->input('message'),
                
                // Extra metadata we send
                'metadata' => [
                    'user_id' => $user ? $user->id : null,
                    'user_name' => $user ? $user->name : 'guest',
                    'email' => $user ? $user->email : null,
                ]
            ]);

            $data = $response->json();
            
            \Illuminate\Support\Facades\Log::info('N8N Response: ', (array) $data);
            
            // n8n Chat node usually returns the reply in the `output` or `text` field
            $reply = $data['output'] ?? $data['text'] ?? $data['reply'] ?? $data['choices'][0]['message']['content'] ?? 'Maaf, saya tidak mengerti. response: ' . json_encode($data);

            return response()->json([
                'status' => 'success',
                'reply' => $reply
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'reply' => 'Gagal terhubung ke Hermes API: ' . $e->getMessage()
            ], 500);
        }
    }
}
