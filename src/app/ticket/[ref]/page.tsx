"use client";

import React, { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import TicketView from '@/components/TicketView';
import Spinner from '@/components/Spinner';

export default function TicketPage(props: { params: Promise<{ ref: string }> }) {
    const params = use(props.params);
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const searchParams = useSearchParams(); // For optional query params if needed, though ref is in path

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const res = await fetch(`/api/public/booking-details/${params.ref}`);
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Failed to load ticket');
                }
                const data = await res.json();
                setTicket(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.ref) {
            fetchTicket();
        }
    }, [params.ref]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
                <h1 className="text-xl font-bold text-slate-900 mb-2">Could not load ticket</h1>
                <p className="text-slate-500">{error}</p>
                <a href="/" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Go Home</a>
            </div>
        </div>
    );

    return <TicketView ticket={ticket} />;
}
