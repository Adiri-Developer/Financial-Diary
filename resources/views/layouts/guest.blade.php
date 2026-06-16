<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        <script>
            if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        </script>
    </head>
    <body class="font-sans text-gray-900 antialiased bg-slate-50 dark:bg-slate-900 dark:text-gray-100 overflow-hidden transition-colors duration-200">
        <div class="flex min-h-screen">
            <!-- Left Side: Image / Branding -->
            <div class="hidden lg:flex lg:w-1/2 relative bg-indigo-900">
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-purple-900/90 z-10"></div>
                <img src="{{ asset('images/auth_background.png') }}" alt="Financial Diary Background" class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80" />
                <div class="absolute inset-0 z-20 flex flex-col justify-between p-12 lg:p-20">
                    <div>
                        <a href="/" class="flex items-center space-x-3 transition hover:opacity-80">
                            <img src="{{ asset('logo.png') }}" alt="Logo" class="w-12 h-12 object-contain" />
                            <span class="text-white text-2xl font-bold tracking-wide">Financial Diary</span>
                        </a>
                    </div>
                    <div class="mb-12">
                        <h1 class="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                            Take Control of Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300">Financial Future</span>
                        </h1>
                        <p class="text-indigo-100 text-lg max-w-md leading-relaxed">
                            Track every penny, set meaningful goals, and achieve financial freedom with our intelligent, AI-powered journaling platform.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Right Side: Form -->
            <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-white relative shadow-2xl z-30">
                <!-- Mobile Logo -->
                <div class="lg:hidden absolute top-8 left-8 flex items-center space-x-2">
                    <img src="{{ asset('logo.png') }}" alt="Logo" class="w-8 h-8 object-contain" />
                    <span class="text-indigo-600 text-lg font-bold">Financial Diary</span>
                </div>

                <div class="w-full max-w-md animate-fade-in-up">
                    {{ $slot }}
                </div>
            </div>
        </div>
    </body>
</html>
