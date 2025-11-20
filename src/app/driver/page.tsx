"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

export default function DriverPortal() {
    const [user, setUser] = useState<any>(null);
    const [trips, setTrips] = useState<any[]>([]);
    const [scanning, setScanning] = useState(false);
    const router = useRouter();
    const API_URL = '/api';

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/staff/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'Driver') {
            router.push('/staff/login');
            return;
        }
        setUser(parsedUser);
    }, [router]);

    useEffect(() => {
        if (user) {
            const fetchTrips = async () => {
                const token = localStorage.getItem('token');
                try {
                    const res = await fetch(`${API_URL}/driver/trips`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if(res.ok) setTrips(data);
                } catch (e) {
                    console.error(e);
                }
            };
            fetchTrips();
        }
    }, [user]);

    if (!user) return <div className="flex h-screen items-center justify-center"><Spinner /></div>;

    return (
        <div className="min-h-screen bg-slate-100 p-4">
            <div className="max-w-md mx-auto">
                <header className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">Driver Portal</h1>
                    <p className="text-slate-500">Welcome, {user.name}</p>
                </header>
                
                <div className="space-y-4">
                    <h2 className="font-bold text-lg text-slate-700">My Trips Today</h2>
                    {trips.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No trips assigned for today.</p>
                    ) : (
                        trips.map(trip => (
                            <div key={trip.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{trip.route.name}</h3>
                                        <p className="text-slate-500 text-sm">{trip.departureTime.slice(0,5)}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${trip.status === 'Boarding' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                                        {trip.status}
                                    </span>
                                </div>
                                <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl" onClick={() => setScanning(true)}>
                                    Scan Tickets
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {scanning && (
                 <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
                     <p className="text-white mb-4">Scanner Placeholder</p>
                     <button className="px-4 py-2 bg-white rounded-lg font-bold" onClick={() => setScanning(false)}>Close Scanner</button>
                 </div>
            )}
        </div>
    );
}
