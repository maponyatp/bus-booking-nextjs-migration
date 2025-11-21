import React from 'react';
import { User } from '@/types';

interface AdminSidebarProps {
    user: User;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
}

export default function AdminSidebar({ user, activeTab, setActiveTab, onLogout }: AdminSidebarProps) {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'operators', label: 'Operators', icon: '🏢' },
        { id: 'ticket-fees', label: 'Ticket Fees', icon: '💰' },
        { id: 'users', label: 'System Users', icon: '👥' },
        { id: 'settings', label: 'Global Settings', icon: '⚙️' },
    ];

    return (
        <nav className="w-72 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 shadow-2xl z-20 print:hidden">
            <div className="p-6 bg-slate-950">
                 <h1 className="font-black text-xl text-white leading-tight text-center">SYSTEM CONTROL</h1>
                 <div className="flex justify-center mt-2">
                    <span className="px-3 py-1 bg-red-900/50 text-red-400 text-xs font-bold uppercase tracking-widest rounded-full border border-red-900">Super Admin</span>
                </div>
            </div>
            <ul className="flex-grow overflow-y-auto py-6 px-4 space-y-1.5">
                {tabs.map(tab => (
                    <li key={tab.id}>
                        <button onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg shadow-red-900/30' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                            <span className="mr-3">{tab.icon}</span>
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>
            <div className="p-4 bg-slate-950 border-t border-slate-800">
                <div className="flex items-center mb-4 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-lg font-bold text-white mr-3 shadow-sm">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate font-mono">@{user.username}</p>
                    </div>
                </div>
                <button onClick={onLogout} className="w-full flex items-center justify-center px-4 py-2.5 text-xs font-bold text-red-300 bg-red-950/30 hover:bg-red-900/50 hover:text-red-200 rounded-lg transition-all border border-red-900/50 group">
                    SIGN OUT
                </button>
            </div>
        </nav>
    );
}
