<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <!-- Premium Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <!-- Total Balance -->
                <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition duration-300">
                    <h3 class="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-2">Total Balance</h3>
                    <div class="text-4xl font-bold">Rp {{ number_format($totalBalance, 0, ',', '.') }}</div>
                    <div class="mt-4 flex items-center text-sm">
                        <svg class="w-4 h-4 mr-1 text-indigo-200" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"></path></svg>
                        <span class="text-indigo-100">+2.5% from last month</span>
                    </div>
                </div>

                <!-- Income -->
                <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transform hover:-translate-y-1 transition duration-300">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Income This Month</h3>
                            <div class="text-3xl font-bold text-gray-800">Rp {{ number_format($incomeThisMonth, 0, ',', '.') }}</div>
                        </div>
                        <div class="p-3 bg-green-100 rounded-full text-green-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        </div>
                    </div>
                </div>

                <!-- Outcome -->
                <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-100 transform hover:-translate-y-1 transition duration-300">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Outcome This Month</h3>
                            <div class="text-3xl font-bold text-gray-800">Rp {{ number_format($outcomeThisMonth, 0, ',', '.') }}</div>
                        </div>
                        <div class="p-3 bg-red-100 rounded-full text-red-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions & Charts -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Main Chart Area -->
                <div class="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Cash Flow Overview</h3>
                    <div class="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <span class="text-gray-400">Chart will be rendered here</span>
                    </div>
                </div>

                <!-- Quick Actions Area -->
                <div class="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div class="space-y-4">
                        <button class="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl transition duration-200">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            <span>Add Income</span>
                        </button>
                        <button class="w-full flex items-center justify-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white py-3 px-4 rounded-xl transition duration-200">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
                            <span>Add Outcome</span>
                        </button>
                    </div>

                    <div class="mt-8">
                        <h3 class="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider">Hermes AI Assistant</h3>
                        <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p class="text-sm text-gray-600 mb-3">Ask Hermes to log your transactions quickly.</p>
                            <input type="text" placeholder="e.g. Beli kopi 30rb" class="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
