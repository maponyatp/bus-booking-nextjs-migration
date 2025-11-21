"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StaffSidebar from '@/components/staff/Sidebar';
import StaffDashboard from '@/components/staff/Dashboard';
import { User } from '@/types';
import Spinner from '@/components/Spinner';

export default function StaffPortal() {
    const [user, setUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState('dashboard');
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/staff/login');
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/staff/login');
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard': return <StaffDashboard />;
            // Add other cases as we migrate components
            default: return <StaffDashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-100">
            <StaffSidebar user={user} currentView={currentView} setView={setCurrentView} onLogout={handleLogout} />
            <div className="flex-1 ml-64 p-8">
                {renderContent()}
            </div>
        </div>
    );
}
