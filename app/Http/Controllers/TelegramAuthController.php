<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class TelegramAuthController extends Controller
{
    /**
     * Handle the Telegram authentication callback for linking an account.
     */
    public function handleCallback(Request $request)
    {
        $botToken = env('TELEGRAM_BOT_TOKEN');

        if (!$botToken) {
            return redirect()->route('profile.edit')->withErrors([
                'telegram' => 'Telegram Bot Token is not configured.'
            ]);
        }

        // Verify Telegram signature
        if (!$this->verifyTelegramHash($request->all(), $botToken)) {
            return redirect()->route('profile.edit')->withErrors([
                'telegram' => 'Telegram login verification failed. Invalid hash.'
            ]);
        }

        $telegramId = $request->input('id');
        $telegramUsername = $request->input('username');

        // Check if this Telegram ID is already linked to another user
        $existing = User::where('telegram_id', $telegramId)
            ->where('id', '!=', Auth::id())
            ->first();

        if ($existing) {
            return redirect()->route('profile.edit')->withErrors([
                'telegram' => 'This Telegram account is already linked to another user.'
            ]);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Link the Telegram ID and Username
        $user->telegram_id = $telegramId;
        $user->telegram_username = $telegramUsername;
        $user->save();

        return redirect()->route('profile.edit')->with('status', 'telegram-linked');
    }

    /**
     * Unlink the Telegram account from the currently logged in user.
     */
    public function unlink(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->telegram_id = null;
        $user->telegram_username = null;
        $user->save();

        return redirect()->route('profile.edit')->with('status', 'telegram-unlinked');
    }

    /**
     * Verify the hash received from Telegram login callback.
     */
    private function verifyTelegramHash(array $data, string $botToken): bool
    {
        if (!isset($data['hash'])) {
            return false;
        }

        $checkHash = $data['hash'];
        unset($data['hash']);

        // Only keep valid Telegram auth data attributes to prevent issues with other query params
        $validKeys = ['auth_date', 'first_name', 'id', 'last_name', 'photo_url', 'username'];
        $dataToSign = [];

        foreach ($validKeys as $key) {
            if (isset($data[$key])) {
                $dataToSign[] = $key . '=' . $data[$key];
            }
        }

        sort($dataToSign);
        $dataCheckString = implode("\n", $dataToSign);

        $secretKey = hash('sha256', $botToken, true);
        $hash = hash_hmac('sha256', $dataCheckString, $secretKey);

        if (hash_equals($hash, $checkHash)) {
            // Check if the auth data is not older than 24 hours to prevent replay attacks
            if (isset($data['auth_date']) && (time() - $data['auth_date']) < 86400) {
                return true;
            }
        }

        return false;
    }
}
