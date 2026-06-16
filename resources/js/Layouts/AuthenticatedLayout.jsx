import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import HermesChatWidget from '@/Components/HermesChatWidget';

export default function Authenticated({ header, children }) {
    const user = usePage().props.auth?.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showingUserDropdown, setShowingUserDropdown] = useState(false);

    // Theme state
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    // Helper function for Sidebar Links
    const SidebarLink = ({ href, active, icon, children }) => (
        <Link
            href={href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition duration-200 ${active
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-indigo-100 hover:bg-indigo-800/50 hover:text-white'
                }`}
        >
            <div className={active ? 'text-white' : 'text-indigo-300'}>{icon}</div>
            <span className="font-medium text-sm">{children}</span>
        </Link>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex overflow-hidden font-sans transition-colors duration-200">
            {/* Mobile Overlay */}
            {showingNavigationDropdown && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setShowingNavigationDropdown(false)}
                ></div>
            )}

            {/* Premium Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-indigo-950 to-indigo-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${showingNavigationDropdown ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-white/10">
                    <Link href={route('dashboard')} className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition">
                            <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
                        </div>
                        <span className="text-xl font-bold tracking-wide">Financial Diary</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="p-4 space-y-2 mt-4 overflow-y-auto h-[calc(100vh-5rem)]">
                    <SidebarLink
                        href={route('dashboard')}
                        active={route().current('dashboard')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>}
                    >
                        Dashboard
                    </SidebarLink>

                    <SidebarLink
                        href={route('transactions.index')}
                        active={route().current('transactions.*')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>}
                    >
                        Transactions
                    </SidebarLink>

                    <SidebarLink
                        href={route('budgets.index')}
                        active={route().current('budgets.*') || route().current('financial-goals.*')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>}
                    >
                        Planning & Goals
                    </SidebarLink>

                    <SidebarLink
                        href={route('wallets.index')}
                        active={route().current('wallets.*') || route().current('assets.*') || route().current('debts.*')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>}
                    >
                        Accounts & Assets
                    </SidebarLink>

                    <SidebarLink
                        href={route('categories.index')}
                        active={route().current('categories.*')}
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>}
                    >
                        Master Data
                    </SidebarLink>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 transition-colors duration-200">
                    <div className="flex items-center">
                        <button
                            onClick={() => setShowingNavigationDropdown(true)}
                            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none transition mr-4"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>

                        {/* Dynamic Page Header Title */}
                        {header ? (
                            <div className="font-semibold text-xl text-gray-800 dark:text-gray-100 tracking-tight">{header}</div>
                        ) : (
                            <div className="font-semibold text-xl text-gray-800 dark:text-gray-100 tracking-tight">Overview</div>
                        )}
                    </div>

                    {/* Right side items */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none transition"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                            )}
                        </button>

                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowingUserDropdown(!showingUserDropdown)}
                                className="flex items-center space-x-3 focus:outline-none p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                            >
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">{user?.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Member</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {showingUserDropdown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowingUserDropdown(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 z-50 ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 animate-fade-in-up">
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 sm:hidden">
                                            <p className="text-sm text-gray-900 dark:text-gray-100 font-semibold">{user?.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                        </div>
                                        <Link href={route('profile.edit')} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                                            <svg className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                            Profile Settings
                                        </Link>
                                        <Link href={route('logout')} method="post" as="button" className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 transition text-left">
                                            <svg className="w-4 h-4 mr-3 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                            Log Out
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            <HermesChatWidget />
        </div>
    );
}
