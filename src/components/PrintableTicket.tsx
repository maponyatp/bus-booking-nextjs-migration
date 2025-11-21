/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface PrintableTicketProps {
    ticket: any;
    onPrint: () => void;
}

export default function PrintableTicket({ ticket, onPrint }: PrintableTicketProps) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.booking.referenceNumber}`;

    const parseDepartureDateTime = () => {
        const { departureDate, departureTime } = ticket.departure || {};
        const candidates: string[] = [];

        if (departureDate && departureTime) candidates.push(`${departureDate}T${departureTime}`);
        if (departureTime) candidates.push(departureTime);
        if (departureDate) candidates.push(departureDate);

        for (const value of candidates) {
            const parsed = new Date(value);
            if (!isNaN(parsed.getTime())) return parsed;
        }

        return null;
    };

    const departureDateTime = parseDepartureDateTime();
    const departureDateLabel = departureDateTime
        ? departureDateTime.toLocaleDateString()
        : 'To be advised';
    const departureTimeLabel = departureDateTime
        ? departureDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'To be advised';
    
    return (
        <div>
            <div id="printable-area" className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b-2 border-dashed border-gray-300">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-gray-900">{ticket.operator.name || 'Vaya'}</h1>
                        <p className="text-sm text-gray-500">Booking Confirmation</p>
                    </div>
                    <img src={ticket.operator.logoUrl || '/logo.jpg'} alt="Operator Logo" className="h-16 mt-4 sm:mt-0" onError={(e: any) => e.target.src='/logo.jpg'} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div><label className="block text-xs font-medium text-gray-500 uppercase">Passenger</label><p className="text-lg font-semibold text-gray-800">{ticket.booking.passengerName}</p></div>
                    <div><label className="block text-xs font-medium text-gray-500 uppercase">Booking Ref</label><p className="text-lg font-semibold text-blue-600">{ticket.booking.referenceNumber}</p></div>
                    <div><label className="block text-xs font-medium text-gray-500 uppercase">Route</label><p className="text-lg font-semibold text-gray-800">{ticket.route.name}</p></div>
                    <div><label className="block text-xs font-medium text-gray-500 uppercase">Seat(s)</label><p className="text-lg font-semibold text-gray-800">{ticket.booking.seatNumbers || 'N/A'}</p></div>
                    <div><label className="block text-xs font-medium text-gray-500 uppercase">Departure Date</label><p className="text-lg font-semibold text-gray-800">{departureDateLabel}</p></div>
                    <div><label className="block text-xs font-medium text-gray-500 uppercase">Departure Time</label><p className="text-lg font-semibold text-gray-800">{departureTimeLabel}</p></div>
                    
                    <div><label className="block text-xs font-medium text-gray-500 uppercase">Total Amount</label><p className="text-lg font-semibold text-gray-800">R {parseFloat(ticket.booking.totalAmount).toFixed(2)}</p></div>
                    <div><label className="block text-xs font-medium text-gray-500 uppercase">Status</label><p className={`text-lg font-semibold ${ticket.booking.status === 'Confirmed' || ticket.booking.status === 'Redeemed' ? 'text-green-600' : 'text-yellow-600'}`}>{ticket.booking.status}</p></div>
                </div>

                <div className="text-center mt-6 pt-6 border-t border-gray-200">
                    {(ticket.booking.status === 'Confirmed' || ticket.booking.status === 'Redeemed') ? (
                        <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-40 h-40 border p-1" />
                    ) : (
                        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                            <p className="font-bold">Payment Pending</p>
                            <p className="text-sm">QR code will be available once payment is confirmed at the terminal.</p>
                        </div>
                    )}
                </div>
            </div>
            <button onClick={onPrint} className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50 w-full mt-6 print:hidden">
                Print Ticket
            </button>
        </div>
    );
}
