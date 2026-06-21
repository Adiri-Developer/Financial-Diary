<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OtpController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'type' => ['required', 'string', 'in:email,phone'],
            'identifier' => ['required', 'string', 'max:255'],
        ]);

        $user = $request->user();
        
        if ($request->type === 'email' && $user->email === $request->identifier) {
            return response()->json(['message' => 'Email is already the same.'], 400);
        }
        if ($request->type === 'phone' && $user->phone_number === $request->identifier) {
            return response()->json(['message' => 'Phone number is already the same.'], 400);
        }

        $otpCode = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        \App\Models\Otp::create([
            'user_id' => $user->id,
            'type' => $request->type,
            'identifier' => $request->identifier,
            'otp_code' => $otpCode,
            'expires_at' => now()->addMinutes(10),
        ]);

        if ($request->type === 'email') {
            \Illuminate\Support\Facades\Mail::raw("Your OTP code for changing email is: {$otpCode}", function ($message) use ($request) {
                $message->to($request->identifier)->subject('OTP Verification');
            });
        } elseif ($request->type === 'phone') {
            \Illuminate\Support\Facades\Log::info("Send OTP {$otpCode} to phone {$request->identifier}");
            \Illuminate\Support\Facades\Mail::raw("Your OTP code for changing phone is: {$otpCode} (Sent to {$request->identifier})", function ($message) use ($user) {
                $message->to($user->email)->subject('OTP Verification for Phone Change');
            });
        }

        return response()->json(['message' => 'OTP sent successfully.']);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'otp_code' => ['required', 'string'],
        ]);

        $user = $request->user();

        // Find the latest valid OTP for this user
        $otp = \App\Models\Otp::where('user_id', $user->id)
            ->where('otp_code', $request->otp_code)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$otp) {
            return response()->json(['message' => 'Invalid or expired OTP code.'], 422);
        }

        // Update user based on OTP type
        if ($otp->type === 'email') {
            $user->email = $otp->identifier;
            $user->email_verified_at = now();
        } elseif ($otp->type === 'phone') {
            $user->phone_number = $otp->identifier;
            $user->phone_verified_at = now();
        }
        $user->save();

        // Delete all OTPs for this user of this type
        \App\Models\Otp::where('user_id', $user->id)->where('type', $otp->type)->delete();

        return response()->json(['message' => 'Verified successfully.']);
    }
}
