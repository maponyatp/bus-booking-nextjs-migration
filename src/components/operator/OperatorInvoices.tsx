"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useStaff } from '@/context/StaffContext';
import Spinner from '@/components/Spinner';
import InvoiceModal from './InvoiceModal';
import { Invoice } from '@/types';

interface OperatorInvoicesProps {
    logoUrl: string;
}

export default function OperatorInvoices({ logoUrl }: OperatorInvoicesProps) {
    const { showNotification, api } = useStaff();
    const [filters, setFilters] = useState({ startDate: '', endDate: '' });
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const buildQuery = useCallback(() => {
        const params = new URLSearchParams();
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        const query = params.toString();
        return query ? `?${query}` : '';
    }, [filters]);

    const fetchInvoices = useCallback(async () => {
        setLoading(true);
        try {
            const query = buildQuery();
            const data = await api(`/operators/system-fee-invoices${query}`);
            setInvoices(Array.isArray(data) ? data : []);
        } catch (error: any) {
            console.error(error);
            showNotification(error.message, 'error');
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    }, [api, buildQuery, showNotification]);

    useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

    const resetFilters = () => setFilters({ startDate: '', endDate: '' });

    const totals = useMemo(() => {
        return invoices.reduce((acc, invoice) => {
            const amount = Number(invoice.systemFeeTotal) || 0;
            acc.totalAmount += amount;
            if (invoice.status === 'Paid') {
                acc.paidAmount += amount;
            } else {
                acc.pendingAmount += amount;
            }
            return acc;
        }, { totalAmount: 0, paidAmount: 0, pendingAmount: 0 });
    }, [invoices]);

    const formatCurrency = (value: number | string | undefined) => `R ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                            className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            max={filters.endDate || undefined}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">End Date</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={e => setFilters({ ...filters, endDate: e.target.value })}
                            className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            min={filters.startDate || undefined}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={resetFilters} className="px-6 py-3 font-bold text-slate-700 bg-slate-100 rounded-xl shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all">Reset</button>
                        <button type="button" onClick={fetchInvoices} className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50" disabled={loading}>
                            {loading ? 'Loading…' : 'Refresh'}
                        </button>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <p className="text-xs font-bold uppercase text-slate-500">Invoices</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{invoices.length.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <p className="text-xs font-bold uppercase text-slate-500">Pending Amount</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totals.pendingAmount)}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <p className="text-xs font-bold uppercase text-slate-500">Paid Amount</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totals.paidAmount)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">System Fee Invoices</h2>
                        <p className="text-sm text-slate-500">Invoices generated by the Super Admin for your organisation.</p>
                    </div>
                    <p className="text-sm text-slate-500">Total Fees: <span className="font-semibold text-slate-900">{formatCurrency(totals.totalAmount)}</span></p>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center p-10"><Spinner /></div>
                    ) : (
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice Date</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Tickets</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">System Fees</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No invoices found for the selected period.</td>
                                    </tr>
                                ) : (
                                    invoices.map(invoice => (
                                        <tr key={invoice.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-sm text-slate-900 font-mono">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-sm text-right text-slate-900">{invoice.ticketsSold.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-sm text-right font-semibold text-slate-900">{formatCurrency(invoice.systemFeeTotal)}</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedInvoice(invoice)}
                                                    className="text-orange-600 font-semibold hover:text-orange-700"
                                                >
                                                    View &amp; Print
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {selectedInvoice && (
                <InvoiceModal
                    invoice={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                    onPrint={() => window.print()}
                    logoUrl={logoUrl}
                />
            )}
        </div>
    );
}
