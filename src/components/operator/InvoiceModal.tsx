"use client";

import React from 'react';
import { Invoice } from '@/types';

interface InvoiceModalProps {
    invoice: Invoice;
    onClose: () => void;
    onPrint: () => void;
    logoUrl: string;
}

export default function InvoiceModal({ invoice, onClose, onPrint, logoUrl }: InvoiceModalProps) {
    if (!invoice) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
                <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">Invoice Preview</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Close invoice preview"
                    >
                        ✕
                    </button>
                </div>
                <InvoiceDocument invoice={invoice} logoUrl={logoUrl} />
                <div className="print:hidden flex flex-col sm:flex-row sm:justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <button
                        type="button"
                        onClick={onPrint}
                        className="px-6 py-3 font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Print Invoice
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 font-bold text-slate-700 bg-slate-100 rounded-xl shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function InvoiceDocument({ invoice, logoUrl }: { invoice: Invoice, logoUrl: string }) {
    if (!invoice) return null;

    const issueDate = invoice.invoiceDate ? new Date(invoice.invoiceDate) : null;
    const dueDate = issueDate ? new Date(issueDate.getTime()) : null;
    if (dueDate) dueDate.setDate(dueDate.getDate() + 7);
    const generatedAt = invoice.generatedAt ? new Date(invoice.generatedAt) : null;
    const perTicket = invoice.ticketsSold > 0 ? Number(invoice.systemFeeTotal || 0) / Number(invoice.ticketsSold) : 0;
    const balanceDue = invoice.status === 'Paid' ? 0 : Number(invoice.systemFeeTotal || 0);
    const invoiceNumber = `INV-${String(invoice.id).padStart(6, '0')}`;
    const formatCurrency = (value: string | number | undefined) => `R ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

    return (
        <div className="printable-area px-6 py-8 bg-white text-slate-900">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {logoUrl && <img src={logoUrl} alt="Operator logo" className="h-16 mb-4 rounded" />}
                    <h2 className="text-2xl font-black">System Fee Invoice</h2>
                    <p className="text-sm text-slate-500">Issued by Vaya Ticket Easy</p>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-slate-600">Invoice #{invoiceNumber}</p>
                    {issueDate && <p className="text-sm text-slate-600">Invoice Date: {issueDate.toLocaleDateString()}</p>}
                    {dueDate && <p className="text-sm text-slate-600">Due Date: {dueDate.toLocaleDateString()}</p>}
                    <p className={`text-sm font-semibold ${invoice.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>Status: {invoice.status}</p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">Bill To</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">{invoice.operatorName}</p>
                    {invoice.operatorAddress && <p className="text-sm text-slate-600 whitespace-pre-line mt-2">{invoice.operatorAddress}</p>}
                    {(invoice.operatorContactEmail || invoice.operatorContactPhone) && (
                        <div className="text-sm text-slate-600 mt-3 space-y-1">
                            {invoice.operatorContactEmail && <p>Email: {invoice.operatorContactEmail}</p>}
                            {invoice.operatorContactPhone && <p>Phone: {invoice.operatorContactPhone}</p>}
                        </div>
                    )}
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Tickets Sold</span>
                        <span className="font-semibold text-slate-900">{invoice.ticketsSold.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>System Fee / Ticket</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(perTicket)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Subtotal</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(invoice.systemFeeTotal)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2">
                        <span>Balance Due</span>
                        <span>{formatCurrency(balanceDue)}</span>
                    </div>
                </div>
            </div>

            <table className="w-full mt-6 text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-xs font-bold uppercase text-slate-600 tracking-wider">
                    <tr>
                        <th className="px-4 py-3 text-left">Description</th>
                        <th className="px-4 py-3 text-right">Quantity</th>
                        <th className="px-4 py-3 text-right">Fee / Ticket</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    <tr>
                        <td className="px-4 py-4">
                            <p className="font-semibold text-slate-900">System Usage Fees</p>
                            {issueDate && <p className="text-xs text-slate-500">Tickets processed on {issueDate.toLocaleDateString()}</p>}
                        </td>
                        <td className="px-4 py-4 text-right font-semibold text-slate-900">{invoice.ticketsSold.toLocaleString()}</td>
                        <td className="px-4 py-4 text-right text-slate-900">{formatCurrency(perTicket)}</td>
                        <td className="px-4 py-4 text-right font-bold text-slate-900">{formatCurrency(invoice.systemFeeTotal)}</td>
                    </tr>
                </tbody>
            </table>

            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 text-sm text-slate-600">
                <div>
                    <p className="font-semibold text-slate-700 uppercase text-xs">Payment Instructions</p>
                    <p className="mt-2">Kindly settle the outstanding balance via EFT using the invoice number as reference.</p>
                </div>
                {generatedAt && <p className="text-xs text-slate-500">Generated on {generatedAt.toLocaleString()}</p>}
            </div>
        </div>
    );
}
