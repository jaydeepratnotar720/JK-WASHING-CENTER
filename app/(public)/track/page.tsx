"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Clock,
  Car,
  Bike,
  Sparkles,
  PhoneCall,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { getBookings } from "@/lib/db";
import { Booking, BookingStatus } from "@/types";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";

const STAGES: { status: BookingStatus; label: string; desc: string }[] = [
  { status: "confirmed", label: "Confirmed", desc: "Appointment verified & bay reserved" },
  { status: "vehicle_received", label: "Vehicle Received", desc: "Vehicle checked in at workshop" },
  { status: "washing_in_progress", label: "Washing In Progress", desc: "Snow foam wash, interior cleaning underway" },
  { status: "ready_for_delivery", label: "Ready for Delivery", desc: "Quality check passed, keys ready for collection" },
  { status: "completed", label: "Delivered", desc: "Service completed & delivered" },
];

function TrackWashContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setSearchTerm(ref);
      findBooking(ref);
    }
  }, [searchParams]);

  const findBooking = (query: string) => {
    if (!query.trim()) return;
    setSearched(true);
    const cleanQ = query.trim().toLowerCase();
    const all = getBookings();
    const match = all.find(
      (b) =>
        b.booking_number.toLowerCase() === cleanQ ||
        b.vehicle?.reg_number.toLowerCase().replace(/\s+/g, "") === cleanQ.replace(/\s+/g, "") ||
        b.customer?.phone.replace(/\D/g, "") === cleanQ.replace(/\D/g, "")
    );
    setBooking(match || null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    findBooking(searchTerm);
  };

  const getCurrentStepIndex = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return 0;
      case "confirmed":
        return 0;
      case "vehicle_received":
        return 1;
      case "washing_in_progress":
        return 2;
      case "ready_for_delivery":
        return 3;
      case "completed":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-bold uppercase">
            <Clock className="w-4 h-4" /> Real-time Bay Monitor
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Track Your Vehicle Wash Progress
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Enter your booking reference number, mobile number, or vehicle registration.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. JK-20261010-001 or MH 02 CZ 4492"
              className="w-full pl-12 pr-4 py-3.5 bg-zinc-900 border border-zinc-700 rounded-2xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-electric-500 shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs rounded-2xl transition shadow-lg shadow-electric-600/30 flex items-center gap-1.5"
          >
            <span>Track</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        {/* Result Area */}
        {searched && (
          <div>
            {booking ? (
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in duration-300">
                {/* Header of tracker */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl font-black text-white">
                        {booking.booking_number}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${
                          getStatusBadge(booking.status).color
                        }`}
                      >
                        {getStatusBadge(booking.status).label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Scheduled for: {formatDate(booking.booking_date)} • {booking.time_slot}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-zinc-500">Vehicle Registered</p>
                    <div className="font-bold text-white text-sm">
                      {booking.vehicle?.reg_number} ({booking.vehicle?.brand} {booking.vehicle?.model})
                    </div>
                  </div>
                </div>

                {/* Progress Steps Timeline */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Wash Stages Timeline
                  </h3>

                  <div className="relative pt-2">
                    {/* Stepper Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                      {STAGES.map((st, i) => {
                        const curIdx = getCurrentStepIndex(booking.status);
                        const isDone = i < curIdx;
                        const isCurrent = i === curIdx;

                        return (
                          <div
                            key={st.status}
                            className={`p-4 rounded-2xl border transition ${
                              isCurrent
                                ? "bg-electric-500/10 border-electric-500 ring-1 ring-electric-500/40"
                                : isDone
                                ? "bg-zinc-800/60 border-zinc-700 text-zinc-300"
                                : "bg-zinc-900/40 border-zinc-800 text-zinc-500 opacity-60"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {isDone ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : isCurrent ? (
                                <span className="w-3.5 h-3.5 rounded-full bg-electric-400 animate-ping" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-zinc-600" />
                              )}
                              <span
                                className={`text-xs font-bold ${
                                  isCurrent ? "text-electric-400" : isDone ? "text-white" : "text-zinc-500"
                                }`}
                              >
                                Step {i + 1}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white mb-1">{st.label}</h4>
                            <p className="text-[10px] text-zinc-400 leading-snug">{st.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="bg-[#0c121e] border border-zinc-800 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                  <div>
                    <span className="text-zinc-500">Package Booked:</span>
                    <p className="font-bold text-white text-sm mt-0.5">{booking.package?.name || "Custom Detailing"}</p>
                    <p className="text-[11px] text-zinc-400 mt-1">Est. Duration: ~{booking.estimated_duration_mins} mins</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Service Amount:</span>
                    <p className="font-bold text-white text-sm mt-0.5">{formatCurrency(booking.final_amount)}</p>
                    <p className="text-[11px] text-emerald-400 mt-1">
                      Paid: {formatCurrency(booking.amount_paid || 0)} • Due: {formatCurrency(booking.remaining_balance || 0)}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Notes &amp; Bay Supervisor:</span>
                    <p className="font-semibold text-zinc-300 mt-0.5">{booking.notes || "Standard multi-point inspection."}</p>
                  </div>
                </div>

                {/* Help button */}
                <div className="text-center pt-2">
                  <a
                    href="tel:+919876543210"
                    className="inline-flex items-center gap-2 text-xs text-electric-400 hover:text-white transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Have a question? Call Workshop Front Desk at +91 98765 43210</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-10 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Booking Found</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  We couldn&apos;t find an active record matching &quot;{searchTerm}&quot;. Please verify your booking reference or phone number.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackWashPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-zinc-400">
          <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading Live Bay Monitor...</p>
        </div>
      }
    >
      <TrackWashContent />
    </Suspense>
  );
}
