"use client";

import React, { useState, useEffect } from 'react';
import { useStaff } from '@/context/StaffContext';
import SearchDepartures from './SearchDepartures';
import BookingScreen from './BookingScreen';
import ConfirmationScreen from './ConfirmationScreen';
import OperatorInvoices from './OperatorInvoices';
import { Booking, Operator, SearchResult } from '@/types';

export default function SalesAgentPOS() {
    const { user, logout, api } = useStaff();
    const [view, setView] = useState('search');
    const [activeTab, setActiveTab] = useState('pos');
    const [departureDetails, setDepartureDetails] = useState<SearchResult | null>(null);
    const [bookingResult, setBookingResult] = useState<Booking | null>(null);
    const [operatorLogoUrl, setOperatorLogoUrl] = useState('');

    useEffect(() => {
        const fetchOperatorLogo = async () => {
            try {
                const profile: Operator = await api('/operators/profile');
                if (profile.logoUrl) {
                    setOperatorLogoUrl(profile.logoUrl);
                }
            } catch (error) {
                console.error("Could not fetch operator logo", error);
            }
        };
        fetchOperatorLogo();
    }, [api]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        if (tab === 'pos') {
            setView('search');
        }
    };

    const handleSelectDeparture = (details: SearchResult) => {
        setDepartureDetails(details);
        setView('booking');
    };

    const handleBookingSuccess = (result: Booking) => {
        setBookingResult(result);
        setView('confirmation');
    };

    const handleNewSale = () => {
        setDepartureDetails(null);
        setBookingResult(null);
        setView('search');
    };

    const handleReprint = (booking: Booking) => {
        setBookingResult(booking);
        setView('confirmation');
    }

    const renderContent = () => {
        if (activeTab === 'invoices') {
            return <OperatorInvoices logoUrl={operatorLogoUrl} />;
        }

        switch(view) {
            case 'booking':
                if (!departureDetails) return null;
                return <BookingScreen details={departureDetails} onBack={handleNewSale} onSuccess={handleBookingSuccess} />;
            case 'confirmation':
                if (!bookingResult) return null;
                return <ConfirmationScreen result={bookingResult} onNewSale={handleNewSale} operatorLogoUrl={operatorLogoUrl} />;
            default:
                return <SearchDepartures onSelectDeparture={handleSelectDeparture} onReprint={handleReprint} />;
        }
    };

    if (!user) return null;
    
    return (
        <div className="min-h-screen bg-slate-100">
             <header className="bg-white shadow-sm print:hidden border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {operatorLogoUrl && <img src={operatorLogoUrl} alt="Operator Logo" className="h-12 rounded" />}
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Operator Portal</h1>
                                <p className="text-sm text-slate-500">Manage ticket sales and system fee invoices</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="font-semibold text-slate-900 block">{user.name}</span>
                            <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">{user.role}</p>
                            <button onClick={logout} type="button" className="text-sm font-medium text-slate-500 hover:text-red-600 mt-1">Logout</button>
                        </div>
                    </div>
                    <nav className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => handleTabChange('pos')}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'pos' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                        >
                            Sell Tickets
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange('invoices')}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'invoices' ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                        >
                            System Fee Invoices
                        </button>
                    </nav>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {renderContent()}
            </main>
        </div>
    )
}
