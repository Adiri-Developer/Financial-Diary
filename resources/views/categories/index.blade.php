<x-app-layout>
    <div x-data="{ showAddModal: false, showEditModal: false, showDeleteModal: false, editingCategory: {}, deletingCategory: {} }"
        @open-add.window="showAddModal = true" @open-edit.window="editingCategory = $event.detail; showEditModal = true"
        @open-delete.window="deletingCategory = $event.detail; showDeleteModal = true">

        <x-slot name="header">
            <div x-data class="flex justify-between items-center">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    {{ __('Master Data: Categories') }}
                </h2>
                <button @click="$dispatch('open-add')"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150 shadow-sm">
                    + Add Category
                </button>
            </div>
        </x-slot>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                @if (session('success'))
                    <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                        {{ session('success') }}
                    </div>
                @endif
                @if ($errors->any())
                    <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                        <ul class="list-disc pl-5">
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Income Categories -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="p-6 border-b border-gray-100 bg-emerald-50/50">
                            <h3 class="text-lg font-bold text-emerald-700">Income Categories</h3>
                        </div>
                        <ul class="divide-y divide-gray-100 p-4">
                            @forelse($categories->where('type', 'income') as $category)
                                <li
                                    class="py-3 flex justify-between items-center px-2 hover:bg-gray-50 rounded-lg transition duration-150">
                                    <span class="font-medium text-gray-800">{{ $category->name }}</span>
                                    <div class="space-x-3">
                                        <button
                                            @click="$dispatch('open-edit', { id: {{ $category->id }}, name: '{{ addslashes($category->name) }}', type: '{{ $category->type }}' })"
                                            class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                                        <button
                                            @click="$dispatch('open-delete', { id: {{ $category->id }}, name: '{{ addslashes($category->name) }}' })"
                                            class="text-rose-600 hover:text-rose-900 text-sm font-medium">Delete</button>
                                    </div>
                                </li>
                            @empty
                                <li class="py-4 text-center text-gray-500 text-sm">No income categories found.</li>
                            @endforelse
                        </ul>
                    </div>

                    <!-- Outcome Categories -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="p-6 border-b border-gray-100 bg-rose-50/50">
                            <h3 class="text-lg font-bold text-rose-700">Outcome Categories</h3>
                        </div>
                        <ul class="divide-y divide-gray-100 p-4">
                            @forelse($categories->where('type', 'outcome') as $category)
                                <li
                                    class="py-3 flex justify-between items-center px-2 hover:bg-gray-50 rounded-lg transition duration-150">
                                    <span class="font-medium text-gray-800">{{ $category->name }}</span>
                                    <div class="space-x-3">
                                        <button
                                            @click="$dispatch('open-edit', { id: {{ $category->id }}, name: '{{ addslashes($category->name) }}', type: '{{ $category->type }}' })"
                                            class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                                        <button
                                            @click="$dispatch('open-delete', { id: {{ $category->id }}, name: '{{ addslashes($category->name) }}' })"
                                            class="text-rose-600 hover:text-rose-900 text-sm font-medium">Delete</button>
                                    </div>
                                </li>
                            @empty
                                <li class="py-4 text-center text-gray-500 text-sm">No outcome categories found.</li>
                            @endforelse
                        </ul>
                    </div>
                </div>

            </div>
        </div>

        <!-- Add Modal -->
        <div x-cloak x-show="showAddModal" style="display: none"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all"
                @click.away="showAddModal = false">
                <h3 class="text-lg font-bold mb-4 text-gray-800">Add New Category</h3>
                <form action="{{ route('categories.store') }}" method="POST">
                    @csrf
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                        <input type="text" name="name"
                            class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select name="type"
                            class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required>
                            <option value="outcome">Outcome (Pengeluaran)</option>
                            <option value="income">Income (Pemasukan)</option>
                        </select>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="showAddModal = false"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                        <button type="submit"
                            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Save</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Edit Modal -->
        <div x-cloak x-show="showEditModal" style="display: none"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all"
                @click.away="showEditModal = false">
                <h3 class="text-lg font-bold mb-4 text-gray-800">Edit Category</h3>
                <form :action="'/categories/' + editingCategory.id" method="POST">
                    @csrf
                    @method('PUT')
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                        <input type="text" name="name" x-model="editingCategory.name"
                            class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select name="type" x-model="editingCategory.type"
                            class="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required>
                            <option value="outcome">Outcome (Pengeluaran)</option>
                            <option value="income">Income (Pemasukan)</option>
                        </select>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="showEditModal = false"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                        <button type="submit"
                            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Update</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Modal -->
        <div x-cloak x-show="showDeleteModal" style="display: none"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all"
                @click.away="showDeleteModal = false">
                <h3 class="text-lg font-bold mb-4 text-rose-600">Delete Category</h3>
                <p class="text-gray-600 mb-6 text-sm">Are you sure you want to delete the category "<span
                        class="font-bold text-gray-800" x-text="deletingCategory.name"></span>"? This action cannot be
                    undone.</p>
                <form :action="'/categories/' + deletingCategory.id" method="POST">
                    @csrf
                    @method('DELETE')
                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="showDeleteModal = false"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                        <button type="submit"
                            class="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700">Delete</button>
                    </div>
                </form>
            </div>
        </div>

    </div>
</x-app-layout>