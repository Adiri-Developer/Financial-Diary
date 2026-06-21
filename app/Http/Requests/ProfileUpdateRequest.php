<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'address' => ['nullable', 'string'],
            'province_id' => ['nullable', 'string'],
            'province_name' => ['nullable', 'string'],
            'city_id' => ['nullable', 'string'],
            'city_name' => ['nullable', 'string'],
            'district_id' => ['nullable', 'string'],
            'district_name' => ['nullable', 'string'],
            'phone_number' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
        ];
    }
}
