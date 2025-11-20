"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Spinner from '@/components/Spinner';

export default function AdminDashboard() {
    const { API_URL } = useApp();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/superadmin/analytics`, {
                     headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setStats(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [API_URL]);

    if (loading) return <div className="flex justify-center p-12"><Spinner/></div>;
    if (!stats) return <div className="text-center p-8 text-slate-500">Failed to load analytics.</div>;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Ticket Revenue" value={`R ${stats.totalTicketRevenue.toLocaleString()}`} color="bg-emerald-500" />
                <StatCard title="Total Parcel Revenue" value={`R ${stats.totalParcelRevenue.toLocaleString()}`} color="bg-blue-500" />
                <StatCard title="Active Operators" value={stats.activeOperators} color="bg-red-600" />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Top Performing Operators</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b-2 border-slate-100">
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 sticky top-0 pl-0">Operator Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 sticky top-0 text-right pr-0">Total Revenue Generated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.revenueByOperator.map((op: any, i: number) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 border-t border-slate-100 pl-0 font-medium">{op.companyName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 border-t border-slate-100 pr-0 text-right font-mono font-bold">R {op.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, color }: { title: string, value: string | number, color: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center">
            <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center text-white shadow-lg mr-5`}>
                <span className="text-2xl font-bold">#</span>
            </div>
            <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</h4>
                <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
            </div>
        </div>
    );
}
