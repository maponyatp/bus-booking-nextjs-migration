"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { SearchResult, BookingDetails, Route, RouteStop } from '@/types';
import BookingForm from './BookingForm';
import ManageBooking from './ManageBooking';
import TrackParcel from './TrackParcel';
import Spinner from './Spinner';

export default function BookingWidget() {
    const { API_URL, showNotification, customer, openModal } = useApp();
    const [activeTab, setActiveTab] = useState('book');
    const [routes, setRoutes] = useState<Route[]>([]);
    const [stops, setStops] = useState<{ from: string[], to: string[] }>({ from: [], to: [] });
    const [search, setSearch] = useState({ from: '', to: '', date: new Date().toISOString().split('T')[0] });
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<SearchResult | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/public/routes-with-stops`)
            .then(res => res.json())
            .then((data: Route[]) => {
                setRoutes(data);
                const pickupStops = new Set<string>();
                const allDropoffStops = new Set<string>();
                data.forEach(r => r.stops?.forEach((s: RouteStop) => {
                    if (s.isPickupPoint) pickupStops.add(s.stopName);
                    if (s.isDropoffPoint) allDropoffStops.add(s.stopName);
                }));
                setStops({ from: Array.from(pickupStops).sort(), to: Array.from(allDropoffStops).sort() });
            })
            .catch(() => showNotification('Failed to load routes', 'error'));
    }, [API_URL, showNotification]);

    useEffect(() => {
        if (!search.from) {
            const allDropoffStops = new Set<string>();
            routes.forEach(r => r.stops?.forEach((s: RouteStop) => {
                    if (s.isDropoffPoint) allDropoffStops.add(s.stopName);
            }));
            setStops(prev => ({ ...prev, to: Array.from(allDropoffStops).sort() }));
            return;
        }
        const possibleDestinations = new Set<string>();
        routes.forEach(route => {
            const startNode = route.stops?.find(s => s.stopName === search.from && s.isPickupPoint);
            if (startNode) {
                route.stops?.forEach(s => {
                    if (s.stopOrder > startNode.stopOrder && s.isDropoffPoint) {
                        possibleDestinations.add(s.stopName);
                    }
                });
            }
        });
        setStops(prev => ({ ...prev, to: Array.from(possibleDestinations).sort() }));
        if (!possibleDestinations.has(search.to)) {
            setSearch(prev => ({...prev, to: ''}));
        }
    }, [search.from, routes]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/public/departures/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fromStop: search.from, toStop: search.to, departureDate: search.date })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Search failed');
            setResults(data);
            setActiveTab('results');
        } catch (e: any) {
            showNotification(e.message, 'error');
        } finally { setLoading(false); }
    };
    
    if (activeTab === 'booking' && selectedTrip) {
        return <BookingForm trip={selectedTrip} onBack={() => setActiveTab('results')} />;
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex border-b border-slate-100 mb-6 overflow-x-auto print:hidden">
                <button className={`flex-shrink-0 pb-4 px-4 font-bold text-sm ${activeTab === 'book' || activeTab === 'results' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`} onClick={() => setActiveTab('book')}>Book a Trip</button>
                <button className={`flex-shrink-0 pb-4 px-4 font-bold text-sm ${activeTab === 'manage' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`} onClick={() => setActiveTab('manage')}>Manage Booking</button>
                <button className={`flex-shrink-0 pb-4 px-4 font-bold text-sm ${activeTab === 'track' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`} onClick={() => setActiveTab('track')}>Track Parcel</button>
            </div>
            
            {(activeTab === 'book' || activeTab === 'results') && (
                <>
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end print:hidden">
                        <div><label htmlFor="fromStop" className="font-bold text-sm text-slate-700 ml-1">From</label><select id="fromStop" className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" value={search.from} onChange={e => setSearch({...search, from: e.target.value, to: ''})} required><option value="">Select Origin</option>{stops.from.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                        <div><label htmlFor="toStop" className="font-bold text-sm text-slate-700 ml-1">To</label><select id="toStop" className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" value={search.to} onChange={e => setSearch({...search, to: e.target.value})} required disabled={!search.from}><option value="">Select Destination</option>{stops.to.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                        <div><label htmlFor="travelDate" className="font-bold text-sm text-slate-700 ml-1">Date</label><input id="travelDate" type="date" className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" value={search.date} min={new Date().toISOString().split('T')[0]} onChange={e => setSearch({...search, date: e.target.value})} required /></div>
                        <button type="submit" className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50 h-[50px]" disabled={loading}>{loading ? 'Searching...' : 'Search Buses'}</button>
                    </form>
                    {activeTab === 'results' && (
                        <div className="mt-8 space-y-4">{loading ? <div className="p-8 text-center"><Spinner/></div> : results.length === 0 ? <div className="p-8 text-center bg-slate-50 rounded-xl"><p>No buses found.</p></div> : results.map(res => (<div key={res.departure.id} className="border-2 border-slate-100 hover:border-blue-600 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center print:hidden"><div><div className="flex items-center gap-2"><span className="text-2xl font-black">{res.departure.departureTime.slice(0,5)}</span><span className="text-slate-400">&rarr;</span><span className="text-lg font-bold">{res.route.toStop}</span></div><p className="text-sm text-blue-600">{res.operator.companyName} • {res.bus.name}</p></div><div className="flex items-center gap-6 mt-4 sm:mt-0"><div className="text-right"><p className="text-3xl font-black">R {Number(res.price).toFixed(0)}</p><p className={`text-sm font-bold ${res.availableSeats > 5 ? 'text-green-600' : 'text-orange-500'}`}>{res.bus.capacity - res.bookedCount} seats left</p></div><button onClick={() => { setSelectedTrip(res); setActiveTab('booking'); }} className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50 py-3 px-8">Book Now</button></div></div>))}</div>)}
                </>
            )}
            {activeTab === 'manage' && <ManageBooking />}
            {activeTab === 'track' && <TrackParcel />}
        </div>
    );
}
