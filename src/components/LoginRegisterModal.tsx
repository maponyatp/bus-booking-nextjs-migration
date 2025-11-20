"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

interface LoginRegisterModalProps {
    onClose: () => void;
}

export default function LoginRegisterModal({ onClose }: LoginRegisterModalProps) {
    const { login, showNotification, API_URL } = useApp();
    const [view, setView] = useState<'login' | 'register' | 'forgot'>('login'); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ 
        name: '', 
        phone: '', 
        email: '', 
        password: '',
        emailOrPhone: '' 
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, [e.target.name]: e.target.value});
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/customer-auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrPhone: formData.emailOrPhone, password: formData.password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            login(data.customer, data.token); 
            showNotification('Login successful!', 'success');
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };
    
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/customer-auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    password: formData.password
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            showNotification('Registration successful! Please log in.', 'success');
            setView('login'); 
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/customer-auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            showNotification(data.message, 'success');
            setView('login');
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/75 flex justify-center items-start pt-[5vh] z-[100] overflow-y-auto" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 mb-[5vh]" onClick={e => e.stopPropagation()}>
                <div className="flex mb-6">
                    <button onClick={() => setView('login')} className={`flex-1 pb-2 font-bold ${view === 'login' || view === 'forgot' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>Login</button>
                    <button onClick={() => setView('register')} className={`flex-1 pb-2 font-bold ${view === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>Register</button>
                </div>
                
                {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg mb-4 text-sm">{error}</div>}

                {view === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">Welcome Back</h2>
                        <div>
                            <label className="font-medium text-sm text-slate-700">Email or Phone</label>
                            <input type="text" name="emailOrPhone" className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="font-medium text-sm text-slate-700">Password</label>
                            <input type="password" name="password" className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" onChange={handleChange} required />
                        </div>
                        <div className="text-right">
                            <button type="button" onClick={() => setView('forgot')} className="text-sm font-medium text-blue-600 hover:underline">
                                Forgot Password?
                            </button>
                        </div>
                        <button type="submit" disabled={loading} className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50 w-full">{loading ? 'Logging in...' : 'Login'}</button>
                    </form>
                )}
                
                {view === 'register' && (
                    <form onSubmit={handleRegister} className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">Create Account</h2>
                        <div>
                            <label className="font-medium text-sm text-slate-700">Full Name</label>
                            <input type="text" name="name" className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="font-medium text-sm text-slate-700">Contact Number</label>
                            <input type="tel" name="phone" className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="font-medium text-sm text-slate-700">Email</label>
                            <input type="email" name="email" className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="font-medium text-sm text-slate-700">Password</label>
                            <input type="password" name="password" className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" onChange={handleChange} required />
                        </div>
                        <button type="submit" disabled={loading} className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50 w-full">{loading ? 'Registering...' : 'Create Account'}</button>
                    </form>
                )}

                {view === 'forgot' && (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">Reset Password</h2>
                        <p className="text-sm text-slate-600 text-center -mt-4 mb-4">Enter your email to receive a password reset link.</p>
                        <div>
                            <label className="font-medium text-sm text-slate-700">Email</label>
                            <input type="email" name="email" className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" onChange={handleChange} required />
                        </div>
                        <button type="submit" disabled={loading} className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50 w-full">{loading ? 'Sending Link...' : 'Send Reset Link'}</button>
                        <div className="text-center">
                            <button type="button" onClick={() => setView('login')} className="text-sm font-medium text-blue-600 hover:underline">
                                &larr; Back to Login
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
