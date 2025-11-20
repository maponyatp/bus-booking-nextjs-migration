import React from 'react';

export default function StaffDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium uppercase">Today&apos;s Sales</h3>
                    <p className="text-3xl font-black text-slate-900 mt-2">R 0.00</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium uppercase">Active Buses</h3>
                    <p className="text-3xl font-black text-slate-900 mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium uppercase">Departures Today</h3>
                    <p className="text-3xl font-black text-slate-900 mt-2">0</p>
                </div>
            </div>
            <div className="mt-8 bg-white p-8 rounded-xl border border-slate-200 text-center py-12">
                <p className="text-slate-500">Select an option from the sidebar to get started.</p>
            </div>
        </div>
    );
}
