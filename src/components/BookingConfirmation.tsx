import React from 'react';

interface BookingConfirmationProps {
    data: any;
    onReset: () => void;
}

export default function BookingConfirmation({ data, onReset }: BookingConfirmationProps) {
    return (
        <div className="text-center py-12 print:hidden">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Booking Successful!</h2>
            <p className="text-xl text-slate-600 mb-8">Your booking reference is: <span className="font-mono font-bold bg-slate-100 px-4 py-1 rounded-lg">{data.bookingRef}</span></p>
            <p className="text-slate-500 max-w-md mx-auto mb-8">Please present this reference number at the terminal to complete payment and board your bus.</p>
            <button onClick={onReset} className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50">Book Another Trip</button>
        </div>
    );
}
