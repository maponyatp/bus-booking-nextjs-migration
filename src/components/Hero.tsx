import React from 'react';

export default function Hero() {
    return (
        <div className="bg-slate-900 h-[450px] relative overflow-hidden print:hidden">
            <img src="/hero.jpg" className="w-full h-full object-cover opacity-40" alt="Hero" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-3xl px-4">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">Travel Made Simple.</h1>
                    <p className="text-xl text-slate-300">Book bus tickets across Southern Africa with ease.</p>
                </div>
            </div>
        </div>
    );
}
