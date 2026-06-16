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
            $userIdentifier = auth()->check() ? \Illuminate\Support\Str::slug(auth()->user()->name) : 'guest';

            $response = Http::withoutVerifying()->withHeaders([
                'Authorization' => 'Bearer hermes_api_secret_key_you_can_change_this',
                'Content-Type' => 'application/json',
                'X-Hermes-Session-Key' => $userIdentifier,
            ])->post('https://chatbot.adiri.my.id/v1/chat/completions', [
                        'model' => 'hermes-agent',
                        'messages' => [
                            ['role' => 'user', 'content' => $request->input('message')]
                        ]
                    ]);

            $data = $response->json();
            $reply = $data['choices'][0]['message']['content'] ?? 'Maaf, saya tidak mengerti.';

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
