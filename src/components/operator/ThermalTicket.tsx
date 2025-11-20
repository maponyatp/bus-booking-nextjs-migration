/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Booking } from '@/types';

interface ThermalTicketProps {
    booking: Booking;
    operatorLogoUrl: string;
}

export default function ThermalTicket({ booking, operatorLogoUrl }: ThermalTicketProps) {
    // Dynamic QR Code URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.bookingRef}`;

    return (
        <div id="ticket-to-print" className="printable-area p-2 bg-white text-black font-sans w-[58mm] mx-auto overflow-hidden">
             <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: 58mm auto;
                    }
                    body {
                        width: 58mm;
                        margin: 0;
                    }
                    /* Hide everything else */
                    body > *:not(#printable-root) {
                        display: none;
                    }
                    #printable-root {
                        display: block !important;
                    }
                }
            `}</style>
            <div className="text-center pb-2 border-b border-dashed border-black mb-2">
                {operatorLogoUrl && <img src={operatorLogoUrl} alt="Operator Logo" className="h-8 mx-auto mb-1 grayscale" />}
                <h2 className="text-sm font-black uppercase tracking-tight leading-none">{booking.companyName}</h2>
            </div>
            <div className="space-y-2 mb-4 text-[10px]">
                <div className="flex justify-between">
                    <div><p className="font-bold uppercase text-gray-600 mb-0.5">Passenger</p><p className="font-bold leading-tight">{booking.passengerName}</p></div>
                    <div className="text-right"><p className="font-bold uppercase text-gray-600 mb-0.5">Seat</p><p className="font-black text-xl">{booking.seatNumber}</p></div>
                </div>
                <div><p className="font-bold uppercase text-gray-600 mb-0.5">Route</p><p className="font-bold">{booking.routeName}</p></div>
                <div className="flex justify-between">
                     <div><p className="font-bold uppercase text-gray-600 mb-0.5">Date</p><p className="font-bold">{new Date(booking.departureDate).toLocaleDateString()}</p></div>
                     <div className="text-right"><p className="font-bold uppercase text-gray-600 mb-0.5">Time</p><p className="font-bold">{booking.departureTime.slice(0,5)}</p></div>
                </div>
                 <div><p className="font-bold uppercase text-gray-600 mb-0.5">Bus</p><p className="font-bold">{booking.busName}</p></div>
            </div>
            <div className="flex justify-center my-4">
                <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 border border-black p-1" />
            </div>
            <div className="border-t border-dashed border-black pt-2 text-center">
                <p className="text-[8px] font-bold uppercase text-gray-600 mb-1">Booking Reference</p>
                <p className="text-lg font-black tracking-widest font-mono">{booking.bookingRef}</p>
                <p className="text-[10px] font-bold mt-1">PAID: R{parseFloat(booking.amount).toFixed(2)}</p>
            </div>
            <div className="text-center mt-4 text-[8px] font-semibold text-gray-500 uppercase tracking-wider">
                <p>Please arrive 30 mins before departure.</p>
            </div>
        </div>
    );
}
