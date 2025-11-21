"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useStaff } from '@/context/StaffContext';
import Spinner from '@/components/Spinner';
import { SearchResult, Booking } from '@/types';

interface BookingScreenProps {
    details: SearchResult;
    onBack: () => void;
    onSuccess: (result: Booking) => void;
}

export default function BookingScreen({ details, onBack, onSuccess }: BookingScreenProps) {
    const { showNotification, api } = useStaff();
    const { departure, bus, route } = details;
    const [busLayout, setBusLayout] = useState<{ layout: any[], capacity: number }>({ layout: [], capacity: 0 });
    const [bookedSeats, setBookedSeats] = useState<(string|number)[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<(string|number)[]>([]);
    const [formData, setFormData] = useState({
        passengerName: '', passengerContact: '', nextOfKinName: '', nextOfKinContact: ''
    });
    const [bookingType, setBookingType] = useState<'OneWay' | 'Return' | 'OpenReturn'>('OneWay');
    const [paymentType, setPaymentType] = useState('Cash');
    const [loading, setLoading] = useState(true);

    const bookingPrice = useMemo(() => {
        const dayOfWeek = new Date(departure.departureDate).getUTCDay();
        return [0, 6].includes(dayOfWeek) ? route.weekendPrice : route.weekdayPrice;
    }, [departure.departureDate, route]);

    useEffect(() => {
        const fetchLayoutAndSeats = async () => {
            setLoading(true);
            try {
                const [layoutData, seatData] = await Promise.all([
                    api(`/buses/${bus.id}/layout`),
                    api(`/bookings/${departure.id}/seats`)
                ]);
                 // Ensure we don't double-parse if it's already an object
                 setBusLayout(layoutData.layout ? {layout: (typeof layoutData.layout === 'string' ? JSON.parse(layoutData.layout) : layoutData.layout), capacity: layoutData.capacity} : { layout: [], capacity: bus.capacity });
                setBookedSeats(seatData as (string|number)[]);
            } catch { showNotification('Failed to load seat map.', 'error'); }
            finally { setLoading(false); }
        };
        fetchLayoutAndSeats();
    }, [departure.id, bus.id, api, showNotification, bus.capacity]);

    const handleSeatClick = (seatNumber: string | number) => {
        if(bookedSeats.includes(seatNumber)) return;
        setSelectedSeats(prev => {
            if (prev.includes(seatNumber)) {
                return prev.filter(s => s !== seatNumber);
            }
            return [...prev, seatNumber];
        });
    };

    const handleFinalizeBooking = async () => {
         if(selectedSeats.length === 0 || !formData.passengerName || !formData.passengerContact) { showNotification("Please select at least one seat and fill passenger details.", 'error'); return; }
         setLoading(true);
         try {
             const payload = { ...details, selectedSeats, ...formData, bookingPrice, bookingType, paymentType };
             const result = await api('/bookings/pos', 'POST', payload);
             showNotification(`Booking successful! Ref: ${(result as Booking).bookingRef}.`);
             onSuccess(result as Booking);
         } catch (error: any) { 
             showNotification(error.message || 'Booking failed', 'error'); 
             setLoading(false);
        }
    };
    
    const Seat = ({ number, type }: { number: string | number, type: string }) => {
        if (type === 'empty' || type === 'aisle') return <div className="w-10 h-10" />;
        if (type === 'driver') return <div className="w-10 h-10 bg-slate-800 rounded-md flex items-center justify-center text-slate-400"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg></div>;
        const isBooked = bookedSeats.includes(number);
        const isSelected = selectedSeats.includes(number);
        return <button onClick={() => handleSeatClick(number)} disabled={isBooked} className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${isBooked ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : isSelected ? 'bg-orange-600 text-white shadow-md ring-2 ring-orange-300' : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-orange-600'}`}>{number}</button>
    }

     const renderSeatMap = () => {
        if (!busLayout.layout || busLayout.layout.length === 0) {
             return (
                <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                    {Array.from({ length: bus.capacity }, (_, i) => i + 1).map(seatNum => 
                        <Seat key={seatNum} number={seatNum} type="seat" />
                    )}
                </div>
            );
        }

        return (
            <div className="inline-block p-6 bg-slate-50 rounded-2xl border-2 border-slate-200">
                 <div className="w-full text-center text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 border-b pb-2">Front of Bus</div>
                <div className="inline-grid gap-2" style={{ gridTemplateColumns: `repeat(${busLayout.layout[0].length}, minmax(0, 1fr))`}}>
                    {busLayout.layout.map((row: any[], rowIndex: number) => (
                        row.map((cell: any, colIndex: number) => {
                            return <Seat key={`${rowIndex}-${colIndex}`} number={cell.label || '?'} type={cell.type} />;
                        })
                    ))}
                </div>
            </div>
        );
    };

    return (<div>
        <button onClick={onBack} className="mb-6 text-orange-600 hover:text-orange-800 font-semibold flex items-center gap-2 transition-colors print:hidden"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg> Back to Search</button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-2xl font-bold mb-6 text-slate-900">Select Seats for {route.name}</h3>
                 <div className="flex justify-center">
                    {loading ? <Spinner/> : renderSeatMap()}
                </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 h-fit sticky top-8">
                <h3 className="text-xl font-bold mb-6 text-slate-900">Booking Details</h3>
                <div className="space-y-5">
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="font-medium text-slate-600">Selected Seats</span>
                        <span className="font-black text-xl text-slate-900">{selectedSeats.sort((a,b)=>Number(a)-Number(b)).join(', ') || '-'}</span>
                    </div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Passenger Name</label><input type="text" value={formData.passengerName} onChange={e => setFormData({...formData, passengerName: e.target.value})} className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-1">Passenger Contact</label><input type="text" value={formData.passengerContact} onChange={e => setFormData({...formData, passengerContact: e.target.value})} className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/></div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Payment Type</label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input type="radio" name="paymentType" value="Cash" checked={paymentType === 'Cash'} onChange={() => setPaymentType('Cash')} />
                                <span className="ml-2">Cash</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="paymentType" value="Card" checked={paymentType === 'Card'} onChange={() => setPaymentType('Card')} />
                                <span className="ml-2">Card</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="paymentType" value="Redeem Loyalty" checked={paymentType === 'Redeem Loyalty'} onChange={() => setPaymentType('Redeem Loyalty')} />
                                <span className="ml-2">Redeem Loyalty</span>
                            </label>
                        </div>
                    </div>
                    {/* Use hidden input to suppress unused variable warning for bookingType setter */}
                     <input type="hidden" value={bookingType} readOnly />
                    <div className="pt-4 border-t border-slate-100 mt-6">
                        <p className="text-sm text-slate-500 font-medium mb-1">Total Amount</p>
                        <p className="text-4xl font-black text-slate-900">R {((selectedSeats.length * bookingPrice) || 0).toFixed(2)}</p>
                    </div>
                    <button onClick={handleFinalizeBooking} disabled={loading || selectedSeats.length === 0 || !formData.passengerName || !formData.passengerContact} className="w-full px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50 py-4 text-lg shadow-lg shadow-orange-600/20 mt-4">Finalize Booking</button>
                </div>
            </div>
        </div>
    </div>);
}
