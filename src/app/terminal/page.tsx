"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

export default function TerminalPortal() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/staff/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        if (!['TerminalAdmin', 'TerminalSecurity', 'TerminalCashier'].includes(parsedUser.role)) {
            router.push('/staff/login');
            return;
        }
        setUser(parsedUser);
    }, [router]);

    if (!user) return <div className="flex h-screen items-center justify-center"><Spinner /></div>;

    return (
        <div className="min-h-screen bg-slate-100">
             <div className="p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Terminal Management</h1>
                <p className="text-slate-600 mb-8">Welcome back, {user.name}. Role: {user.role}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Placeholders for terminal functionalities */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg mb-2">Entries</h3>
                        <p className="text-slate-500">Manage terminal entries.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg mb-2">Payments</h3>
                        <p className="text-slate-500">Process terminal fees.</p>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg mb-2">Reports</h3>
                        <p className="text-slate-500">View daily reports.</p>
                    </div>
                </div>
             </div>
        </div>
    );
}
