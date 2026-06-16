import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function CategoriesIndex({ categories }) {
    const { flash, errors } = usePage().props;

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const addForm = useForm({ name: '', type: 'outcome' });
    const editForm = useForm({ name: '', type: '' });
    const deleteForm = useForm({});

    const submitAdd = (e) => {
        e.preventDefault();
        addForm.post(route('categories.store'), {
            onSuccess: () => { setShowAddModal(false); addForm.reset(); }
        });
    };

    const openEdit = (category) => {
        setSelectedCategory(category);
        editForm.setData({ name: category.name, type: category.type });
        setShowEditModal(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.put(route('categories.update', selectedCategory.id), {
            onSuccess: () => { setShowEditModal(false); editForm.reset(); }
        });
    };

    const openDelete = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    const submitDelete = (e) => {
        e.preventDefault();
        deleteForm.delete(route('categories.destroy', selectedCategory.id), {
            onSuccess: () => { setShowDeleteModal(false); }
        });
    };

    const incomeCategories = categories.filter(c => c.type === 'income');
    const outcomeCategories = categories.filter(c => c.type === 'outcome');

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Master Data: Categories</h2>}
        >
            <Head title="Categories" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {flash?.success && (
                        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                            {flash.success}
                        </div>
                    )}
                    {Object.keys(errors).length > 0 && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                            <ul className="list-disc pl-5">
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex justify-end mb-4">
                        <button onClick={() => setShowAddModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150 shadow-sm">
                            + Add Category
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Income Categories */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-200">
                            <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-emerald-50/50 dark:bg-emerald-900/20">
                                <h3 className="text-lg font-bold text-emerald-700">Income Categories</h3>
                            </div>
                            <ul className="divide-y divide-gray-100 dark:divide-slate-700 p-4">
                                {incomeCategories.length > 0 ? incomeCategories.map(category => (
                                    <li key={category.id} className="py-3 flex justify-between items-center px-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition duration-150">
                                        <span className="font-medium text-gray-800 dark:text-gray-100">{category.name}</span>
                                        <div className="space-x-3">
                                            <button onClick={() => openEdit(category)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                                            <button onClick={() => openDelete(category)} className="text-rose-600 hover:text-rose-900 text-sm font-medium">Delete</button>
                                        </div>
                                    </li>
                                )) : (
                                    <li className="py-4 text-center text-gray-500 text-sm">No income categories found.</li>
                                )}
                            </ul>
                        </div>

                        {/* Outcome Categories */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors duration-200">
                            <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-rose-50/50 dark:bg-rose-900/20">
                                <h3 className="text-lg font-bold text-rose-700">Outcome Categories</h3>
                            </div>
                            <ul className="divide-y divide-gray-100 dark:divide-slate-700 p-4">
                                {outcomeCategories.length > 0 ? outcomeCategories.map(category => (
                                    <li key={category.id} className="py-3 flex justify-between items-center px-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition duration-150">
                                        <span className="font-medium text-gray-800 dark:text-gray-100">{category.name}</span>
                                        <div className="space-x-3">
                                            <button onClick={() => openEdit(category)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                                            <button onClick={() => openDelete(category)} className="text-rose-600 hover:text-rose-900 text-sm font-medium">Delete</button>
                                        </div>
                                    </li>
                                )) : (
                                    <li className="py-4 text-center text-gray-500 text-sm">No outcome categories found.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Add Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-transparent dark:border-slate-700 transition-colors duration-200 transform transition-all">
                            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Add New Category</h3>
                            <form onSubmit={submitAdd}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
                                    <input type="text" value={addForm.data.name} onChange={e => addForm.setData('name', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400" required />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                    <select value={addForm.data.type} onChange={e => addForm.setData('type', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400" required>
                                        <option value="outcome">Outcome (Pengeluaran)</option>
                                        <option value="income">Income (Pemasukan)</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition duration-150">Cancel</button>
                                    <button type="submit" disabled={addForm.processing} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition duration-150">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-transparent dark:border-slate-700 transition-colors duration-200 transform transition-all">
                            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Edit Category</h3>
                            <form onSubmit={submitEdit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
                                    <input type="text" value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400" required />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                    <select value={editForm.data.type} onChange={e => editForm.setData('type', e.target.value)} className="w-full border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400" required>
                                        <option value="outcome">Outcome (Pengeluaran)</option>
                                        <option value="income">Income (Pemasukan)</option>
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition duration-150">Cancel</button>
                                    <button type="submit" disabled={editForm.processing} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition duration-150">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md border border-transparent dark:border-slate-700 transition-colors duration-200 transform transition-all">
                            <h3 className="text-lg font-bold mb-4 text-rose-600 dark:text-rose-400">Delete Category</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">Are you sure you want to delete the category "<span className="font-bold text-gray-800 dark:text-gray-100">{selectedCategory?.name}</span>"? This action cannot be undone.</p>
                            <form onSubmit={submitDelete}>
                                <div className="flex justify-end space-x-3">
                                    <button type="button" onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition duration-150">Cancel</button>
                                    <button type="submit" disabled={deleteForm.processing} className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 disabled:opacity-50 transition duration-150">Delete</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
