"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FileText,
  Printer,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Sparkles,
} from "lucide-react";
import {
  getBookings,
  getBusinessSettings,
  generateOrGetInvoice,
  getInvoices,
} from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Booking, Invoice } from "@/types";

export default function InvoicesPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<{
    invoice: Invoice;
    booking: Booking;
  } | null>(null);

  const settings = getBusinessSettings();

  const loadData = () => {
    const bList = getBookings();
    setBookings(bList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = b.booking_number.toLowerCase().includes(q);
      const matchName = b.customer?.full_name.toLowerCase().includes(q);
      const matchReg = b.vehicle?.reg_number.toLowerCase().includes(q);
      return matchNum || matchName || matchReg;
    }
    return true;
  });

  const handleViewInvoice = (b: Booking) => {
    const inv = generateOrGetInvoice(b.id);
    if (inv) {
      setSelectedInvoice({ invoice: inv, booking: b });
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Invoices &amp; Tax Receipts
          </h2>
          <p className="text-xs text-zinc-400">
            Generate printable GST invoices and customer payment receipts with locked price breakdowns.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by invoice number, booking reference, customer name, vehicle registration..."
          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-electric-500"
        />
      </div>

      {/* Invoices List */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-zinc-400 bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Booking Number</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Vehicle</th>
                <th className="py-3.5 px-4">Service Package</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Paid Amount</th>
                <th className="py-3.5 px-4">Invoice Status</th>
                <th className="py-3.5 px-4 text-right">Receipt Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => {
                  const paid = b.amount_paid || 0;
                  const balance = b.remaining_balance || 0;
                  const isPaid = balance === 0;

                  return (
                    <tr key={b.id} className="hover:bg-zinc-800/30 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {b.booking_number}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{b.customer?.full_name}</div>
                        <div className="text-[10px] text-zinc-400">{b.customer?.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono uppercase text-zinc-300">
                        {b.vehicle?.reg_number}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300">{b.package?.name}</td>
                      <td className="py-3.5 px-4 font-black text-white">
                        {formatCurrency(b.final_amount)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-400">
                        {formatCurrency(paid)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                            isPaid
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : paid > 0
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {isPaid ? "Paid in Full" : paid > 0 ? "Partially Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleViewInvoice(b)}
                          className="px-3 py-1.5 bg-electric-600 hover:bg-electric-500 text-white font-bold rounded-lg transition inline-flex items-center gap-1.5 shadow"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Invoice</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINTABLE INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-zinc-900 rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl relative my-8 print:m-0 print:p-4 print:shadow-none print:w-full">
            {/* Action Bar (Hidden in Print) */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 no-print">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-zinc-500">Invoice Preview</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                  {selectedInvoice.invoice.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Header */}
            <div className="flex items-start justify-between gap-6 border-b border-zinc-200 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center p-1">
                    <Image src="/icons/logo.svg" alt="JK" width={24} height={24} />
                  </div>
                  <h1 className="text-xl font-black tracking-tight">{settings.business_name}</h1>
                </div>
                <p className="text-[11px] text-zinc-600 font-medium italic">{settings.tagline}</p>
                <p className="text-[11px] text-zinc-500 max-w-xs">{settings.address}</p>
                <p className="text-[11px] text-zinc-500 font-mono">
                  Phone: {settings.phone} • Email: {settings.email}
                </p>
                {settings.gstin && (
                  <p className="text-[11px] font-mono text-zinc-700 font-bold">
                    GSTIN: {settings.gstin}
                  </p>
                )}
              </div>

              <div className="text-right space-y-1">
                <h2 className="text-2xl font-black text-zinc-900 tracking-wider">TAX INVOICE</h2>
                <p className="font-mono text-xs font-bold text-electric-600">
                  {selectedInvoice.invoice.invoice_number}
                </p>
                <p className="text-xs text-zinc-500">
                  Date: {formatDate(selectedInvoice.invoice.issued_at, "dd MMMM yyyy")}
                </p>
                <p className="text-xs text-zinc-500 font-mono">
                  Booking Ref: {selectedInvoice.booking.booking_number}
                </p>
              </div>
            </div>

            {/* Bill To & Vehicle Info */}
            <div className="grid grid-cols-2 gap-6 text-xs bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
              <div>
                <span className="font-bold text-zinc-400 uppercase text-[10px] block mb-1">
                  Billed To Customer:
                </span>
                <p className="font-bold text-zinc-900 text-sm">
                  {selectedInvoice.booking.customer?.full_name}
                </p>
                <p className="font-mono text-zinc-600">{selectedInvoice.booking.customer?.phone}</p>
                {selectedInvoice.booking.customer?.address && (
                  <p className="text-zinc-500 mt-1">{selectedInvoice.booking.customer?.address}</p>
                )}
              </div>

              <div>
                <span className="font-bold text-zinc-400 uppercase text-[10px] block mb-1">
                  Vehicle Serviced:
                </span>
                <p className="font-bold font-mono text-zinc-900 text-sm uppercase">
                  {selectedInvoice.booking.vehicle?.reg_number}
                </p>
                <p className="text-zinc-600">
                  {selectedInvoice.booking.vehicle?.brand} {selectedInvoice.booking.vehicle?.model}
                </p>
                <p className="text-[11px] text-zinc-500 capitalize">
                  Type: {selectedInvoice.booking.vehicle?.vehicle_type}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-zinc-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-zinc-900">
                      {selectedInvoice.booking.package?.name || "Wash Service Package"}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-500">Base Package</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-900">
                      {formatCurrency(selectedInvoice.booking.package_price)}
                    </td>
                  </tr>
                  {selectedInvoice.booking.services_total > 0 && (
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-zinc-900">
                        Additional Detailing Treatments
                      </td>
                      <td className="py-2.5 px-3 text-zinc-500">Add-ons</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-900">
                        {formatCurrency(selectedInvoice.booking.services_total)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-zinc-900">
                    {formatCurrency(selectedInvoice.invoice.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({selectedInvoice.invoice.tax_rate}%):</span>
                  <span className="font-mono font-bold text-zinc-900">
                    {formatCurrency(selectedInvoice.invoice.tax_amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-zinc-900 pt-2 border-t border-zinc-300">
                  <span>Grand Total:</span>
                  <span className="font-mono text-electric-600 text-base">
                    {formatCurrency(selectedInvoice.invoice.grand_total)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold pt-1">
                  <span>Amount Paid:</span>
                  <span className="font-mono">
                    {formatCurrency(selectedInvoice.invoice.amount_paid)}
                  </span>
                </div>
                <div className="flex justify-between text-rose-700 font-bold">
                  <span>Balance Due:</span>
                  <span className="font-mono">
                    {formatCurrency(selectedInvoice.invoice.balance_due)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="pt-4 border-t border-zinc-200 text-center text-[10px] text-zinc-500 space-y-1">
              <p className="font-semibold text-zinc-700">Thank you for choosing JK WASHING CENTER!</p>
              <p>Computer generated tax invoice. Goods and services once rendered cannot be returned.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
