"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import Spinner from '@/components/Spinner';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from '@/components/admin/Dashboard';

export default function AdminPortal() {
    const [user, setUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/staff/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'SuperAdmin') {
            router.push('/staff/login'); // Or error page
            return;
        }
        setUser(parsedUser);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/staff/login');
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;

    return (
        <div className="min-h-screen flex bg-slate-100">
            <AdminSidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <header className="mb-8">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 capitalize">{activeTab.replace('-', ' ')}</h2>
                    <p className="text-slate-500 font-medium">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </header>
                {activeTab === 'dashboard' && <AdminDashboard />}
                {/* Placeholders for other tabs */}
                {activeTab !== 'dashboard' && <div className="text-slate-500">Component for {activeTab} not yet migrated.</div>}
            </main>
        </div>
    );
}
