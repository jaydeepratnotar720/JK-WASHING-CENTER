"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  ShieldCheck,
  ChevronRight,
  X,
  DollarSign,
} from "lucide-react";
import {
  getPayments,
  getBookings,
  recordPayment,
  getCurrentUser,
} from "@/lib/db";
import { formatCurrency, formatDate, getPaymentMethodBadge } from "@/lib/utils";
import { Payment, Booking, PaymentMethod, PaymentType } from "@/types";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  // Record Payment Modal
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [type, setType] = useState<PaymentType>("full");
  const [ref, setRef] = useState("");
  const [notes, setNotes] = useState("");
  const [isVerified, setIsVerified] = useState(true);

  const currentUser = getCurrentUser();

  const loadData = () => {
    setPayments(getPayments());
    const bList = getBookings();
    setBookings(bList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingBookings = bookings.filter((b) => (b.remaining_balance || 0) > 0);

  const filteredPayments = payments.filter((p) => {
    if (methodFilter !== "all" && p.payment_method !== methodFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchRef = p.transaction_reference?.toLowerCase().includes(q);
      const matchBooking = p.booking_id.toLowerCase().includes(q);
      return matchRef || matchBooking;
    }
    return true;
  });

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = pendingBookings.reduce((sum, b) => sum + (b.remaining_balance || 0), 0);

  const handleOpenRecord = (bId?: string) => {
    if (bId) {
      const b = bookings.find((item) => item.id === bId);
      setSelectedBookingId(bId);
      setAmount(b?.remaining_balance || b?.final_amount || 0);
    } else if (pendingBookings.length > 0) {
      setSelectedBookingId(pendingBookings[0].id);
      setAmount(pendingBookings[0].remaining_balance || 0);
    }
    setMethod("upi");
    setType("full");
    setRef("");
    setNotes("");
    setRecordModalOpen(true);
  };

  const handleBookingSelect = (bId: string) => {
    setSelectedBookingId(bId);
    const b = bookings.find((item) => item.id === bId);
    if (b) {
      setAmount(b.remaining_balance || b.final_amount);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || amount <= 0) return;

    const b = bookings.find((item) => item.id === selectedBookingId);
    if (!b) return;

    recordPayment({
      booking_id: b.id,
      customer_id: b.customer_id,
      amount,
      payment_method: method,
      payment_type: type,
      transaction_reference: ref.trim() || undefined,
      is_gateway_verified: method === "upi" || method === "card" ? isVerified : false,
      notes: notes.trim() || `Collected at desk by ${currentUser?.full_name}`,
    });

    setRecordModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Payments &amp; Collections Ledger
          </h2>
          <p className="text-xs text-zinc-400">
            Dedicated payment ledger. Multi-payment support, pending balance reconciliation, and payment method audit.
          </p>
        </div>

        <button
          onClick={() => handleOpenRecord()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-emerald-500/30">
          <span className="text-xs text-zinc-400">Total Actual Collections</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {formatCurrency(totalCollected)}
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Directly recorded in database</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-rose-500/30">
          <span className="text-xs text-zinc-400">Outstanding Uncollected Balance</span>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {formatCurrency(totalOutstanding)}
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">{pendingBookings.length} bookings pending settlement</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-xs text-zinc-400">Recorded Receipts</span>
          <div className="text-2xl font-black text-white mt-1">{payments.length}</div>
          <p className="text-[10px] text-zinc-500 mt-1">Across Cash, UPI, Cards</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payments by reference number or booking..."
            className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-electric-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-zinc-800/80 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Payment Methods</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI / QR Code</option>
            <option value="card">Debit / Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-zinc-400 bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Receipt Ref</th>
                <th className="py-3.5 px-4">Booking Number</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Payment Type</th>
                <th className="py-3.5 px-4">Amount Paid</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Date &amp; Time</th>
                <th className="py-3.5 px-4 text-right">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => {
                  const methodBadge = getPaymentMethodBadge(p.payment_method);
                  const b = bookings.find((item) => item.id === p.booking_id);

                  return (
                    <tr key={p.id} className="hover:bg-zinc-800/30 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {p.transaction_reference || "CASH-REC"}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {b?.booking_number || p.booking_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${methodBadge.color}`}
                        >
                          {methodBadge.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 uppercase text-[10px] font-semibold text-zinc-400">
                        {p.payment_type}
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-400 text-sm">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="py-3.5 px-4">
                        {p.is_gateway_verified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                          </span>
                        ) : (
                          <span className="text-[10px] text-zinc-400">Manual Entry</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        {formatDate(p.created_at, "dd MMM yyyy, HH:mm")}
                      </td>
                      <td className="py-3.5 px-4 text-right text-zinc-400 italic">
                        {p.notes || "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    No payment records match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {recordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base">Record Payment Receipt</h3>
              <button onClick={() => setRecordModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Select Wash Booking *</label>
                <select
                  value={selectedBookingId}
                  onChange={(e) => handleBookingSelect(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
                >
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.booking_number} — {b.customer?.full_name} ({b.vehicle?.reg_number}) [Due: {formatCurrency(b.remaining_balance || 0)}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Amount to Collect (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Payment Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="cash">Cash at Desk</option>
                    <option value="card">Credit / Debit Card</option>
                    <option value="bank_transfer">Direct Bank Transfer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Payment Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["full", "advance", "partial"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition ${
                        type === t ? "bg-electric-600 text-white" : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Transaction Reference / UTR Number</label>
                <input
                  type="text"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                  placeholder="e.g. UPI/4920193/OKAXIS or POS-441"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Staff Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Scanned counter QR code..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  className="flex-1 py-2 bg-zinc-800 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/30"
                >
                  Save Receipt ({formatCurrency(amount)})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
