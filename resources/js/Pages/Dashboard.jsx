import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ totalBalance, incomeThisMonth, outcomeThisMonth }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total Balance Card */}
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-800 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition duration-300">
                            <h3 className="text-indigo-100 text-sm font-semibold mb-2 uppercase tracking-wider">Total Balance</h3>
                            <div className="text-4xl font-bold mb-2">{formatCurrency(totalBalance)}</div>
                            <div className="text-indigo-100 text-sm flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                +2.5% from last month
                            </div>
                        </div>

                        {/* Income Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700 flex flex-col justify-center transition-colors duration-200">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Income This Month</h3>
                            <div className="flex items-end justify-between">
                                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(incomeThisMonth)}</div>
                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Outcome Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700 flex flex-col justify-center transition-colors duration-200">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wider">Outcome This Month</h3>
                            <div className="flex items-end justify-between">
                                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(outcomeThisMonth)}</div>
                                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Chart Area */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700 transition-colors duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Cash Flow Overview</h3>
                                <select className="bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 transition-colors">
                                    <option>This Month</option>
                                    <option>Last Month</option>
                                    <option>This Year</option>
                                </select>
                            </div>
                            <div className="h-72 flex items-center justify-center bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700 transition-colors">
                                <p className="text-gray-400 dark:text-gray-500">Chart will be rendered here</p>
                            </div>
                        </div>

                        {/* Quick Actions Area */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700 transition-colors duration-200">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h3>
                            <div className="space-y-4">
                                <Link href={route('transactions.index', { action: 'income' })} className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl transition duration-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    <span>Add Income</span>
                                </Link>
                                <Link href={route('transactions.index', { action: 'outcome' })} className="w-full flex items-center justify-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white py-3 px-4 rounded-xl transition duration-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                                    <span>Add Outcome</span>
                                </Link>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 uppercase tracking-wider">Hermes AI Assistant</h3>
                                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-700 transition-colors">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Ask Hermes to log your transactions quickly.</p>
                                    <input
                                        type="text"
                                        placeholder="e.g. Beli kopi 30rb (Press Enter)"
                                        className="w-full text-sm bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:focus:ring-indigo-900 focus:ring-opacity-50 transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && e.target.value.trim() !== '') {
                                                window.dispatchEvent(new CustomEvent('hermes-quick-message', { detail: e.target.value }));
                                                e.target.value = '';
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
