/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { TicketData } from '@/types';

interface TicketViewProps {
    ticket: TicketData;
}

export default function TicketView({ ticket }: TicketViewProps) {
    // Dynamic QR Code URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.bookingRef}`;
    
    const formatTime = (dateStr: string, timeStr: string) => {
        if (!dateStr || !timeStr) return 'To be advised';
        const dt = new Date(`${dateStr}T${timeStr}`);
        return isNaN(dt.getTime()) ? timeStr : dt.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'To be advised';
        const dt = new Date(dateStr);
        return isNaN(dt.getTime()) ? dateStr : dt.toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const isConfirmed = ticket.status === 'Confirmed' || ticket.status === 'Redeemed';

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
             {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="Vaya Africa" className="h-10" />
                    <div className="flex items-center gap-6">
                         {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                         <a href="/" className="text-sm font-medium text-blue-600 hover:text-blue-800">Book New Ticket</a>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4">
                <div id="printable-area" className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-2xl w-full">
                     {/* Print Styles Block */}
                     <style jsx global>{`
                        @media print {
                            @page { margin: 0; size: 58mm auto; }
                            body { background-color: #fff; margin: 0; width: 58mm; min-width: 58mm; max-width: 58mm; }
                            body * { visibility: hidden; height: 0; }
                            #printable-area, #printable-area * { visibility: visible !important; height: auto !important; color: black !important; }
                            #printable-area {
                                position: absolute; top: 0; left: 0; width: 58mm !important; max-width: 58mm !important;
                                margin: 0 !important; padding: 2mm !important; border: none !important; box-shadow: none !important;
                                filter: grayscale(100%) contrast(120%);
                            }
                            .print-heading { display: flex !important; flex-direction: column !important; align-items: center !important; text-align: center; border-bottom: 1px dashed #000 !important; padding-bottom: 5px; margin-bottom: 5px; width: 100% !important; }
                            .print-heading img { max-width: 40mm !important; height: auto !important; max-height: 20mm; margin: 0 auto 5px auto; order: -1; display: block; }
                            .print-grid { display: flex !important; flex-direction: column !important; gap: 6px !important; width: 100% !important; }
                            .print-grid > div { display: flex !important; flex-direction: column !important; align-items: flex-start !important; margin-bottom: 4px; border-bottom: 1px dotted #ccc; padding-bottom: 2px; width: 100% !important; }
                            .print-grid label { font-size: 7pt !important; font-weight: bold; color: #000 !important; text-transform: uppercase; display: block; }
                            .print-grid p { text-align: left !important; font-size: 10pt !important; width: 100%; word-break: break-all; }
                            .no-print { display: none !important; }
                            h1 { font-size: 12pt !important; }
                            .text-lg { font-size: 10pt !important; }
                            .text-sm, .text-xs { font-size: 8pt !important; }
                        }
                    `}</style>

                    {/* Ticket Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b-2 border-dashed border-gray-300 print-heading">
                        <div className="text-center sm:text-left w-full order-2 sm:order-1">
                            <h1 className="text-2xl font-bold text-gray-900">{ticket.companyName || 'Vaya Ticket'}</h1>
                            <p className="text-sm text-gray-500">Booking Confirmation</p>
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ticket.logoUrl || '/logo.jpg'} alt="Operator Logo" className="h-16 mb-4 sm:mb-0 sm:ml-4 order-1 sm:order-2 object-contain" onError={(e: any) => e.target.src='/logo.jpg'} />
                    </div>

                    {/* Booking Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 print-grid">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Passenger</label>
                            <p className="text-lg font-semibold text-gray-800">{ticket.passengerName}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Booking Ref</label>
                            <p className="text-lg font-semibold text-blue-600">{ticket.bookingRef}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Route</label>
                            <p className="text-lg font-semibold text-gray-800">{ticket.routeName}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Seat(s)</label>
                            <p className="text-lg font-semibold text-gray-800">{ticket.seatNumber || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Departure Date</label>
                            <p className="text-lg font-semibold text-gray-800">{formatDate(ticket.departureDate)}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Departure Time</label>
                            <p className="text-lg font-semibold text-gray-800">{formatTime(ticket.departureDate, ticket.departureTime)}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Total Amount</label>
                            <p className="text-lg font-semibold text-gray-800">R {parseFloat(ticket.amount).toFixed(2)}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase">Status</label>
                            <p className={`text-lg font-semibold ${isConfirmed ? 'text-green-600' : 'text-yellow-600'}`}>{ticket.status}</p>
                        </div>
                    </div>

                    {/* Operator Contact */}
                    {(ticket.contactPhone || ticket.contactEmail || ticket.address) && (
                        <div className="mt-4 text-sm text-gray-700 space-y-1 border-t pt-2 border-dashed border-gray-300">
                             {ticket.contactPhone && <p><span className="font-bold">Phone:</span> {ticket.contactPhone}</p>}
                             {ticket.contactEmail && <p><span className="font-bold">Email:</span> {ticket.contactEmail}</p>}
                             {ticket.address && <p><span className="font-bold">Address:</span> {ticket.address}</p>}
                        </div>
                    )}

                    {/* QR Code Section */}
                    <div className="text-center mt-6 pt-6 border-t border-gray-200">
                         {isConfirmed ? (
                             <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-40 h-40 border p-1" />
                                <p className="text-xs text-center mt-2 pt-2 text-gray-500 print:block hidden">Thank you for travelling with us.</p>
                             </>
                         ) : (
                             <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
                                 <p className="text-lg font-semibold">QR code will be available once payment is confirmed.</p>
                                 <p className="text-sm mt-2">Please present your Booking Reference to the agent to complete payment.</p>
                             </div>
                         )}
                    </div>
                    
                    {/* Web Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center no-print">
                        <p className="text-sm text-gray-600 mb-4">Please arrive at least 30 minutes before departure.</p>
                        <button onClick={() => window.print()} className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all w-full md:w-auto">
                            Print Ticket (Thermal/A4)
                        </button>
                    </div>
                </div>
            </main>

            <footer className="bg-slate-900 text-slate-400 py-12 text-center no-print mt-auto">
                <p>© 2025 Vaya Africa Ticket Easy.</p>
            </footer>
        </div>
    );
}
