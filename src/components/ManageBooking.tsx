import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import PrintableTicket from './PrintableTicket';

export default function ManageBooking() {
    const { API_URL, showNotification } = useApp();
    const [bookingRef, setBookingRef] = useState('');
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleFind = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTicket(null);
        try {
            const res = await fetch(`${API_URL}/public/bookings/reference/${bookingRef}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setTicket(data);
        } catch (e: any) {
            showNotification(e.message, 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-xl mx-auto">
            <form onSubmit={handleFind} className="flex gap-4 print:hidden">
                <input
                    type="text"
                    value={bookingRef}
                    onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
                    className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex-grow"
                    placeholder="Enter your booking reference (e.g., VAYA-...)"
                    required
                />
                <button type="submit" className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50" disabled={loading}>
                    {loading ? 'Finding...' : 'Find Booking'}
                </button>
            </form>

            {ticket && (
                <div className="mt-8">
                    <PrintableTicket ticket={ticket} onPrint={handlePrint} />
                </div>
            )}
        </div>
    );
}
