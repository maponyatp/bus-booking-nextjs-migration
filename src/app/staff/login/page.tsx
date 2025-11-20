"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

export default function StaffLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            switch (data.user.role) {
                case 'SuperAdmin':
                    router.push('/admin');
                    break;
                case 'Admin':
                case 'SalesAgent':
                case 'FleetManager':
                case 'LoadingTeam': 
                    router.push('/staff/portal');
                    break;
                case 'TerminalAdmin':
                case 'TerminalSecurity':
                case 'TerminalCashier':
                    router.push('/terminal');
                    break;
                case 'Driver':
                    router.push('/driver');
                    break;
                default:
                    setError('Unknown role. Access denied.');
            }
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="mx-auto h-12 w-auto" src="/logo.png" alt="Vaya Africa" />
                <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-slate-900">
                    Staff Portal Sign-in
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Access your designated portal
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                            <input 
                                type="text" 
                                className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                        
                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center">
                                <p className="font-medium text-sm text-red-700">{error}</p>
                            </div>
                        )}
                    </form>
                    
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-slate-500">Or</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <a href="/" className="font-medium text-blue-600 hover:text-blue-700 text-sm">
                                Return to Home
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
