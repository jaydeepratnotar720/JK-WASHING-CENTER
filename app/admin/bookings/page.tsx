"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Search,
  Filter,
  PlusCircle,
  Clock,
  Car,
  Bike,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Eye,
  History,
  Edit,
  X,
  CreditCard,
  Printer,
} from "lucide-react";
import {
  getBookings,
  getBookingById,
  updateBookingStatus,
  updateBooking,
  getBookingStatusHistory,
  getCustomers,
  getVehicles,
  getPackages,
  createBooking,
  recordPayment,
  getCurrentUser,
} from "@/lib/db";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";
import { Booking, BookingStatus, BookingStatusHistory } from "@/types";

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [vehicleFilter, setVehicleFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  // Modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [auditHistory, setAuditHistory] = useState<BookingStatusHistory[]>([]);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<BookingStatus>("confirmed");
  const [statusNotes, setStatusNotes] = useState("");
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<"cash" | "upi" | "card">("upi");

  const currentUser = getCurrentUser();

  const loadData = () => {
    const list = getBookings();
    setBookings(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (vehicleFilter !== "all" && b.vehicle?.vehicle_type !== vehicleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNumber = b.booking_number.toLowerCase().includes(q);
      const matchName = b.customer?.full_name.toLowerCase().includes(q);
      const matchPhone = b.customer?.phone.includes(q);
      const matchReg = b.vehicle?.reg_number.toLowerCase().includes(q);
      return matchNumber || matchName || matchPhone || matchReg;
    }
    return true;
  });

  const handleOpenStatusModal = (b: Booking) => {
    setSelectedBooking(b);
    setNewStatus(b.status);
    setStatusNotes("");
    setStatusModalOpen(true);
  };

  const handleSaveStatus = () => {
    if (!selectedBooking) return;
    updateBookingStatus(selectedBooking.id, newStatus, statusNotes);
    setStatusModalOpen(false);
    loadData();
  };

  const handleOpenHistory = (b: Booking) => {
    setSelectedBooking(b);
    const hist = getBookingStatusHistory(b.id);
    setAuditHistory(hist);
    setHistoryModalOpen(true);
  };

  const handleOpenPayment = (b: Booking) => {
    setSelectedBooking(b);
    setPayAmount(b.remaining_balance || b.final_amount);
    setPayModalOpen(true);
  };

  const handleRecordPayment = () => {
    if (!selectedBooking || payAmount <= 0) return;
    recordPayment({
      booking_id: selectedBooking.id,
      customer_id: selectedBooking.customer_id,
      amount: payAmount,
      payment_method: payMethod,
      payment_type: payAmount >= (selectedBooking.remaining_balance || 0) ? "full" : "partial",
      notes: `Recorded at workshop desk by ${currentUser?.full_name}`,
    });
    setPayModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Booking &amp; Bay Management
          </h2>
          <p className="text-xs text-zinc-400">
            Control vehicle progression across wash bays, reschedule slots, and inspect audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle view mode */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-1 flex">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "table" ? "bg-electric-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === "calendar" ? "bg-electric-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              Slots View
            </button>
          </div>

          <Link
            href="/book"
            target="_blank"
            className="px-4 py-2 bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-electric-600/30 transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Booking</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking #, customer name, mobile, registration..."
            className="w-full bg-zinc-800/80 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-electric-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-800/80 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="vehicle_received">Vehicle Received</option>
            <option value="washing_in_progress">Washing In Progress</option>
            <option value="ready_for_delivery">Ready for Delivery</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="bg-zinc-800/80 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Vehicles</option>
            <option value="car">Cars Only</option>
            <option value="bike">Bikes Only</option>
          </select>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === "table" ? (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-zinc-400 bg-zinc-900 border-b border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">Booking Number</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Vehicle Details</th>
                  <th className="py-3.5 px-4">Package</th>
                  <th className="py-3.5 px-4">Date &amp; Slot</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4">Billing &amp; Due</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => {
                    const badge = getStatusBadge(b.status);
                    return (
                      <tr key={b.id} className="hover:bg-zinc-800/30 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          <Link href={`/track?ref=${b.booking_number}`} className="hover:text-electric-400">
                            {b.booking_number}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{b.customer?.full_name}</div>
                          <div className="text-[10px] text-zinc-400">{b.customer?.phone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white uppercase">{b.vehicle?.reg_number}</div>
                          <div className="text-[10px] text-zinc-400">
                            {b.vehicle?.brand} {b.vehicle?.model}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300">
                          {b.package?.name || "Standard Wash"}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400">
                          <div className="font-medium text-white">{formatDate(b.booking_date)}</div>
                          <div className="text-[10px] text-zinc-500">{b.time_slot}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleOpenStatusModal(b)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border hover:opacity-80 transition ${badge.color}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            <span>{badge.label}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{formatCurrency(b.final_amount)}</div>
                          <div className="text-[10px]">
                            {b.remaining_balance && b.remaining_balance > 0 ? (
                              <span className="text-rose-400">Due: {formatCurrency(b.remaining_balance)}</span>
                            ) : (
                              <span className="text-emerald-400">Paid in Full</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.remaining_balance && b.remaining_balance > 0 ? (
                              <button
                                onClick={() => handleOpenPayment(b)}
                                className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition"
                                title="Collect Payment"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                              </button>
                            ) : null}
                            <button
                              onClick={() => handleOpenHistory(b)}
                              className="p-1.5 bg-zinc-800 text-zinc-300 hover:text-white rounded-lg transition"
                              title="View Status Audit Trail"
                            >
                              <History className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenStatusModal(b)}
                              className="p-1.5 bg-electric-600/20 text-electric-400 hover:bg-electric-600/30 rounded-lg transition"
                              title="Update Status"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-500">
                      No wash bookings match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CALENDAR / SLOTS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 space-y-4 hover:border-zinc-700 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-sm font-bold text-white">{b.booking_number}</span>
                  <p className="text-xs text-electric-400 font-semibold">{b.time_slot}</p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                    getStatusBadge(b.status).color
                  }`}
                >
                  {getStatusBadge(b.status).label}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-bold text-white text-sm">
                  {b.vehicle?.reg_number} • {b.vehicle?.brand} {b.vehicle?.model}
                </div>
                <div className="text-zinc-400">{b.customer?.full_name} ({b.customer?.phone})</div>
                <div className="text-zinc-300 font-medium">{b.package?.name}</div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-zinc-500">Bill: </span>
                  <span className="font-bold text-white">{formatCurrency(b.final_amount)}</span>
                </div>
                <button
                  onClick={() => handleOpenStatusModal(b)}
                  className="px-3 py-1.5 bg-electric-600 hover:bg-electric-500 text-white font-bold text-[11px] rounded-lg transition"
                >
                  Update Stage
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STATUS UPDATE MODAL */}
      {statusModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-white space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base">Update Wash Stage</h3>
              <button onClick={() => setStatusModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-zinc-400">
                Booking: <span className="font-mono font-bold text-white">{selectedBooking.booking_number}</span> ({selectedBooking.vehicle?.reg_number})
              </p>
            </div>

            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Select New Stage</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-electric-500"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="vehicle_received">Vehicle Received</option>
                <option value="washing_in_progress">Washing In Progress</option>
                <option value="ready_for_delivery">Ready for Delivery</option>
                <option value="completed">Completed &amp; Handed Over</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Audit Notes (Optional)</label>
              <textarea
                rows={2}
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                placeholder="e.g. Completed underbody wash, waiting for customer pickup..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-electric-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStatusModalOpen(false)}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                className="flex-1 py-2.5 bg-electric-600 hover:bg-electric-500 rounded-xl text-xs font-bold shadow-lg shadow-electric-600/30"
              >
                Save Progression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT HISTORY MODAL */}
      {historyModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 text-white space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-base">Stage History Audit Trail</h3>
                <p className="text-xs text-zinc-400 font-mono">{selectedBooking.booking_number}</p>
              </div>
              <button onClick={() => setHistoryModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-3">
              {auditHistory.length > 0 ? (
                auditHistory.map((h) => (
                  <div key={h.id} className="p-3 bg-zinc-800/60 rounded-xl text-xs border border-zinc-700/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-electric-400 uppercase">{h.to_status}</span>
                      <span className="text-[10px] text-zinc-500">{formatDate(h.created_at, "dd MMM, HH:mm")}</span>
                    </div>
                    <p className="text-zinc-300">{h.notes}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 text-center py-6">
                  No previous audit notes logged yet for this booking.
                </p>
              )}
            </div>

            <button
              onClick={() => setHistoryModalOpen(false)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* QUICK PAYMENT MODAL */}
      {payModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-white space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base">Collect Payment</h3>
              <button onClick={() => setPayModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-zinc-800/60 rounded-xl text-xs space-y-1">
              <p className="text-zinc-400">Total Billed: <span className="text-white font-bold">{formatCurrency(selectedBooking.final_amount)}</span></p>
              <p className="text-zinc-400">Balance Due: <span className="text-rose-400 font-bold">{formatCurrency(selectedBooking.remaining_balance || 0)}</span></p>
            </div>

            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Amount to Collect (₹)</label>
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {(["upi", "cash", "card"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPayMethod(m)}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition ${
                      payMethod === m
                        ? "bg-electric-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setPayModalOpen(false)}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30"
              >
                Record {formatCurrency(payAmount)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
