"use client";

import React from 'react';
import ThermalTicket from '@/components/operator/ThermalTicket';
import { Booking } from '@/types';

interface ConfirmationScreenProps {
    result: Booking;
    onNewSale: () => void;
    operatorLogoUrl: string;
}

export default function ConfirmationScreen({ result, onNewSale, operatorLogoUrl }: ConfirmationScreenProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-xl mx-auto border border-slate-100 mt-12 print:hidden">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                        <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-3xl font-black text-green-600 mb-4">Booking Confirmed!</h2>
                    <div className="inline-block bg-green-50 px-6 py-3 rounded-xl border border-green-100 mb-8">
                        <p className="text-sm text-green-800 uppercase font-bold mb-1">Booking Reference</p>
                        <p className="font-mono text-3xl font-black tracking-wider text-green-900">{result.bookingRef}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={onNewSale} className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all py-3 px-6 text-base">New Sale</button>
                        <button onClick={handlePrint} className="px-6 py-3 font-bold text-slate-700 bg-slate-100 rounded-xl shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all py-3 px-6 text-base flex items-center justify-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg> Print Ticket</button>
                    </div>
                </div>
            </div>
            {/* Printable Ticket - hidden until print, but used as print source */}
            <div id="printable-root" className="hidden print:block">
                 <ThermalTicket booking={result} operatorLogoUrl={operatorLogoUrl} />
            </div>
        </>
    );
}
