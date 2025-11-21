import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { SearchResult } from '@/types';
import Spinner from './Spinner';
import BookingConfirmation from './BookingConfirmation';

interface BookingFormProps {
    trip: SearchResult;
    onBack: () => void;
}

export default function BookingForm({ trip, onBack }: BookingFormProps) {
    const { API_URL, showNotification, customer } = useApp();
    const [seats, setSeats] = useState<{ layout: any[], booked: string[] }>({ layout: [], booked: [] });
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Pre-fill passenger data from customer profile if available
    const [passenger, setPassenger] = useState({ 
        name: customer?.name || '', 
        contact: customer?.contactNumber || '', 
        nextOfKinName: customer?.nextOfKinName || '', 
        nextOfKinContact: customer?.nextOfKinContact || '' 
    });
    const [confirmed, setConfirmed] = useState<any>(null);

    const bookingPrice = useMemo(() => {
        return trip.price; 
    }, [trip.price]);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch(`${API_URL}/public/bus-layout/${trip.bus.id}`).then(r => r.json()),
            fetch(`${API_URL}/public/booked-seats/${trip.departure.id}`).then(r => r.json())
        ]).then(([layoutData, bookedData]) => {
            const parsedLayout = layoutData.layout ? (typeof layoutData.layout === 'string' ? JSON.parse(layoutData.layout) : layoutData.layout) : [];
            setSeats({ layout: parsedLayout.length > 0 ? parsedLayout : [], booked: bookedData || [] });
        }).catch(e => {
            showNotification('Error loading seat map: ' + e.message, 'error');
        }).finally(() => {
            setLoading(false);
        });
    }, [trip, API_URL, showNotification]);
    
    useEffect(() => {
        if (customer) {
            setPassenger(prev => ({
                ...prev,
                name: prev.name || customer.name || '',
                contact: prev.contact || customer.contactNumber || '',
                nextOfKinName: prev.nextOfKinName || customer.nextOfKinName || '',
                nextOfKinContact: prev.nextOfKinContact || customer.nextOfKinContact || ''
            }));
        }
    }, [customer]);
    
    const handleSeatClick = (seatNumber: string) => {
        if(seats.booked.includes(seatNumber)) return;
        setSelectedSeats(prev => {
            if (prev.includes(seatNumber)) {
                return prev.filter(s => s !== seatNumber);
            }
            return [...prev, seatNumber];
        });
    };

    const renderSeatMap = () => {
        if (loading) return <div className="flex justify-center p-12"><Spinner/></div>;
        
        // Fallback to simple grid if layout is empty
        if (seats.layout.length === 0) {
             return (
                <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                    {Array.from({ length: trip.bus.capacity }, (_, i) => i + 1).map(seatNum => {
                        const seatNumStr = seatNum.toString();
                        const isBooked = seats.booked.includes(seatNumStr);
                        const isSelected = selectedSeats.includes(seatNumStr);
                        return (
                            <button key={seatNumStr} disabled={isBooked} onClick={() => handleSeatClick(seatNumStr)}
                                type="button"
                                className={`w-12 h-12 rounded-xl font-bold text-sm transition-all ${isBooked ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : isSelected ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-blue-500'}`}>
                                {seatNumStr}
                            </button>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className="inline-grid gap-3" style={{ gridTemplateColumns: `repeat(${seats.layout[0]?.length || 5}, minmax(0, 1fr))` }}>
                {seats.layout.flat().map((cell: any, i: number) => {
                    if (!cell.type || cell.type === 'aisle' || cell.type === 'empty') return <div key={i} className="w-12 h-12" />;
                    if (cell.type === 'driver') return <div key={i} className="w-12 h-12 bg-slate-800 rounded-md flex items-center justify-center text-slate-400"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg></div>;
                    
                    const seatNum = cell.label;
                    if (!seatNum) return <div key={i} className="w-12 h-12" />; 
                    
                    const isBooked = seats.booked.includes(seatNum);
                    const isSelected = selectedSeats.includes(seatNum);
                    return (
                        <button key={i} disabled={isBooked} onClick={() => handleSeatClick(seatNum)}
                            type="button"
                            className={`w-12 h-12 rounded-xl font-bold text-sm transition-all ${isBooked ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : isSelected ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-blue-500'}`}>
                            {seatNum}
                        </button>
                    );
                })}
            </div>
        );
    };

    const handleBook = async () => {
        if (selectedSeats.length === 0 || !passenger.name || !passenger.contact || !passenger.nextOfKinName || !passenger.nextOfKinContact) {
            showNotification('Please select at least one seat and fill all passenger & next of kin info', 'error');
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('customerToken');
            const headers: any = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}/public/bookings`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    details: {
                        trip,
                        selectedSeats,
                        bookingPrice: bookingPrice,
                        pickupStopName: trip.route.fromStop,
                        dropoffStopName: trip.route.toStop
                    },
                    passengerName: passenger.name,
                    passengerContact: passenger.contact,
                    nextOfKinName: passenger.nextOfKinName,
                    nextOfKinContact: passenger.nextOfKinContact,
                    bookingType: 'OneWay'
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setConfirmed(data);
        } catch (e: any) { showNotification(e.message, 'error'); }
        finally { setLoading(false); }
    };

    if (confirmed) return <BookingConfirmation data={confirmed} onReset={() => window.location.reload()} />;

    return (
        <div className="print:hidden">
            <button onClick={onBack} className="text-blue-600 font-bold flex items-center gap-2 mb-6 hover:underline"><span className="text-xl">&larr;</span> Back to Results</button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Select Seats</h3>
                    <div className="bg-slate-100 p-8 rounded-2xl border-2 border-slate-200 flex justify-center">
                        {renderSeatMap()}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border-2 border-blue-50 shadow-lg">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Trip Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span>Route</span><span className="font-bold text-right">{trip.route.name}</span></div>
                            <div className="flex justify-between"><span>From</span><span className="font-bold text-right">{trip.route.fromStop}</span></div>
                            <div className="flex justify-between"><span>To</span><span className="font-bold text-right">{trip.route.toStop}</span></div>
                            <div className="flex justify-between"><span>Date</span><span className="font-bold">{new Date(trip.departure.departureDate).toLocaleDateString()}</span></div>
                            <div className="flex justify-between"><span>Time</span><span className="font-bold">{trip.departure.departureTime.slice(0, 5)}</span></div>
                            <div className="flex justify-between pt-3 border-t"><span>Seats</span><span className="font-bold">{selectedSeats.join(', ') || '-'}</span></div>
                            <div className="flex justify-between text-lg pt-3 border-t text-blue-900"><span>Total</span><span className="font-black">R {(selectedSeats.length * bookingPrice).toFixed(2)}</span></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-700">Passenger Info</h4>
                        <input type="text" placeholder="Passenger Name" className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" value={passenger.name} onChange={e => setPassenger({ ...passenger, name: e.target.value })} />
                        <input type="tel" placeholder="Contact Number" className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" value={passenger.contact} onChange={e => setPassenger({ ...passenger, contact: e.target.value })} />

                        <h4 className="font-bold text-slate-700 mt-6">Next of Kin (Emergency)</h4>
                        <input type="text" placeholder="Next of Kin Name" className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" value={passenger.nextOfKinName} onChange={e => setPassenger({ ...passenger, nextOfKinName: e.target.value })} />
                        <input type="tel" placeholder="Next of Kin Contact" className="mt-1 block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" value={passenger.nextOfKinContact} onChange={e => setPassenger({ ...passenger, nextOfKinContact: e.target.value })} />

                        <button onClick={handleBook} disabled={loading} className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50 w-full py-4 text-lg shadow-blue-200/50 shadow-xl mt-6">Confirm Booking</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
