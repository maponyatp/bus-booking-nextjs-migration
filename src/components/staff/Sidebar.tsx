import React from 'react';
import { User } from '@/types';

interface SidebarProps {
    user: User;
    currentView: string;
    setView: (view: string) => void;
    onLogout: () => void;
}

export default function StaffSidebar({ user, currentView, setView, onLogout }: SidebarProps) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['Admin', 'SalesAgent', 'FleetManager'] },
        { id: 'pos', label: 'Point of Sale', icon: '💻', roles: ['Admin', 'SalesAgent'] },
        { id: 'manifest', label: 'Manifests', icon: '📋', roles: ['Admin', 'FleetManager', 'LoadingTeam'] },
        { id: 'parcels', label: 'Parcels', icon: '📦', roles: ['Admin', 'SalesAgent'] },
        { id: 'verify', label: 'Verify Ticket', icon: '🔍', roles: ['Admin', 'SalesAgent', 'LoadingTeam'] },
        { id: 'reprint', label: 'Reprint Ticket', icon: '🖨️', roles: ['Admin', 'SalesAgent'] },
        { id: 'fleet', label: 'Fleet Management', icon: '🚌', roles: ['Admin', 'FleetManager'] },
        { id: 'routes', label: 'Route Management', icon: '🛣️', roles: ['Admin', 'FleetManager'] },
        { id: 'departures', label: 'Schedule', icon: '🕒', roles: ['Admin', 'FleetManager'] },
        { id: 'users', label: 'Staff Management', icon: '👥', roles: ['Admin'] },
        { id: 'customers', label: 'Customers', icon: '🧑‍🤝‍🧑', roles: ['Admin'] },
        { id: 'analytics', label: 'Analytics', icon: '📈', roles: ['Admin'] },
        { id: 'profile', label: 'My Profile', icon: '👤', roles: ['Admin', 'SalesAgent', 'FleetManager', 'LoadingTeam'] },
    ];

    const filteredItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Logo" className="h-8 opacity-80" />
            </div>
            <nav className="flex-1 overflow-y-auto px-4 space-y-1">
                {filteredItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setView(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            currentView === item.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
                        }`}
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <div className="mb-4 px-4">
                    <p className="text-sm font-bold text-white">{user.name || user.username}</p>
                    <p className="text-xs text-slate-500">{user.role}</p>
                </div>
                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg text-sm font-medium">
                    <span>🚪</span> Logout
                </button>
            </div>
        </div>
    );
}
