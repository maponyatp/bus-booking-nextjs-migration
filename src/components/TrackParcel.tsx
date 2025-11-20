import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function TrackParcel() {
    const { API_URL, showNotification } = useApp();
    const [trackingNumber, setTrackingNumber] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch(`${API_URL}/public/track-parcel/${trackingNumber}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setResult(data);
        } catch (e: any) {
            showNotification(e.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="print:hidden">
            <form onSubmit={handleTrack} className="flex gap-4">
                <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                    className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex-grow"
                    placeholder="Enter your tracking number"
                    required
                />
                <button type="submit" className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50" disabled={loading}>
                    {loading ? 'Tracking...' : 'Track Parcel'}
                </button>
            </form>
            {result && (
                <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Parcel Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div><span className="font-bold">Tracking #</span>: {result.trackingNumber}</div>
                        <div><span className="font-bold">Status</span>: <span className={`font-bold ${result.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'}`}>{result.status}</span></div>
                        <div><span className="font-bold">Sender</span>: {result.senderName}</div>
                        <div><span className="font-bold">Receiver</span>: {result.receiverName}</div>
                        <div><span className="font-bold">From</span>: {result.fromStop}</div>
                        <div><span className="font-bold">To</span>: {result.toStop}</div>
                        <div><span className="font-bold">Operator</span>: {result.operatorName}</div>
                        <div><span className="font-bold">Date</span>: {new Date(result.dateSent).toLocaleDateString()}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
