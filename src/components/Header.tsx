import React from 'react';
import { useApp } from '@/context/AppContext';

export default function Header() {
    const { customer, logout, openModal, orgBranding } = useApp();
    
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <img src={orgBranding.orgLogoUrl || "/logo.png"} alt="Logo" className="h-10" />
                <div className="flex items-center gap-6">
                    {customer ? (
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-slate-700 hidden sm:block">Welcome, {customer.name}</span>
                            <button onClick={() => openModal('account')} className="text-sm font-medium text-blue-600 hover:underline">My Account</button>
                            <button onClick={logout} className="text-sm font-medium text-red-600 hover:underline">Logout</button>
                        </div>
                    ) : (
                        <button onClick={() => openModal('login')} className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none transition-all text-sm">Login / Register</button>
                    )}
                </div>
            </div>
        </header>
    );
}
