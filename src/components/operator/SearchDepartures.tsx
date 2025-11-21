"use client";

import React, { useState, useEffect } from 'react';
import { useStaff } from '@/context/StaffContext';
import Spinner from '@/components/Spinner';
import { Route, Booking, SearchResult } from '@/types';

interface SearchDeparturesProps {
    onSelectDeparture: (departure: SearchResult) => void;
    onReprint: (booking: Booking) => void;
}

export default function SearchDepartures({ onSelectDeparture, onReprint }: SearchDeparturesProps) {
    const { showNotification, api } = useStaff();
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedRoute, setSelectedRoute] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [recentSales, setRecentSales] = useState<Booking[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [routesData, salesData] = await Promise.all([
                    api('/routes/list'),
                    api(`/bookings/operator-bookings?status=Confirmed`)
                ]);
                setRoutes(routesData);
                // Filter for today's sales only for quick reprint
                const today = new Date().toISOString().split('T')[0];
                setRecentSales((salesData as Booking[]).filter((b: Booking) => b.createdAt.startsWith(today)).slice(0, 10));
            } catch (error: any) { showNotification(error.message || 'Failed to load data', 'error'); }
        };
        fetchData();
    }, [api, showNotification]);

    const handleSearch = async () => {
        if(!selectedRoute || !selectedDate) { showNotification("Please select a route and date.", 'error'); return; }
        setLoading(true);
        try {
            const data = await api(`/departures/search?routeId=${selectedRoute}&date=${selectedDate}`);
            setSearchResults(data);
        } catch (error: any) { 
            showNotification(error.message || 'Search failed', 'error');
            setSearchResults([]); 
        } 
        finally { setLoading(false); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold mb-4 text-slate-900">Find a Trip</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-end p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div><label className="block text-sm font-semibold text-slate-700 mb-1">Route</label><select value={selectedRoute} onChange={e => setSelectedRoute(e.target.value)} className="input-field block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"><option value="">Select Route</option>{routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
                        <div><label className="block text-sm font-semibold text-slate-700 mb-1">Date</label><input type="date" value={selectedDate} min={new Date().toISOString().split('T')[0]} onChange={e => setSelectedDate(e.target.value)} className="input-field block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/></div>
                        <div><button onClick={handleSearch} disabled={loading} className="w-full px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50">{loading ? 'Searching...' : 'Search'}</button></div>
                    </div>
                    <div className="space-y-3">
                        {loading && <div className="text-center p-8"><Spinner/></div>}
                        {!loading && searchResults.length === 0 && <p className="text-slate-500 text-center py-8 bg-slate-50 rounded-xl border border-dashed">No departures found for criteria.</p>}
                        {searchResults.map(res => (
                            <div key={res.departure.id} className="p-5 border border-slate-200 rounded-xl flex justify-between items-center hover:border-orange-500 transition-all bg-white shadow-sm">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-lg text-slate-900">{res.departure.departureTime.slice(0,5)}</span>
                                        <span className="text-sm font-medium text-slate-600">{res.route.name}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{res.bus.name}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <p className={`font-bold ${res.availableSeats > 5 ? 'text-green-600' : 'text-orange-600'}`}>{res.availableSeats} seats</p>
                                    <button onClick={() => onSelectDeparture({...res})} className="px-6 py-2 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all">Select</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-8">
                    <h3 className="text-lg font-bold mb-4 text-slate-900">Recent Sales (Today)</h3>
                    {recentSales.length === 0 ? <div className="text-slate-500 text-sm text-center py-8 bg-slate-50 rounded-xl border border-dashed">No sales yet today.</div> : (
                        <ul className="space-y-2 max-h-[500px] overflow-y-auto">
                            {recentSales.map(sale => (
                                <li key={sale.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors">
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 truncate">{sale.passengerName}</p>
                                        <p className="text-xs font-mono text-slate-500">{sale.bookingRef}</p>
                                    </div>
                                    <button onClick={() => onReprint(sale)} className="text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wider bg-orange-50 px-3 py-1.5 rounded-md">Reprint</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
