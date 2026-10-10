"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Users,
  Car,
  Bike,
  Sparkles,
  ArrowUpRight,
  PlusCircle,
  CreditCard,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import {
  getDashboardStats,
  getBookings,
  getPayments,
  getRevenueChartData,
  getStatusChartData,
  updateBookingStatus,
  getCurrentUser,
} from "@/lib/db";
import { formatCurrency, formatDate, getStatusBadge } from "@/lib/utils";
import { Booking, BookingStatus } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState(getDashboardStats());
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [revenueData, setRevenueData] = useState(getRevenueChartData());
  const [statusData, setStatusData] = useState(getStatusChartData());
  const [dateFilter, setDateFilter] = useState("all");
  const currentUser = getCurrentUser();

  const refreshData = () => {
    setStats(getDashboardStats());
    const all = getBookings();
    setRecentBookings(all.slice(0, 6));
    setRevenueData(getRevenueChartData());
    setStatusData(getStatusChartData());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleQuickStatusChange = (bookingId: string, nextStatus: BookingStatus) => {
    updateBookingStatus(bookingId, nextStatus, `Updated via Quick Dashboard Action by ${currentUser?.full_name}`);
    refreshData();
  };

  const getNextStatusAction = (currentStatus: BookingStatus): { label: string; next: BookingStatus; color: string } | null => {
    switch (currentStatus) {
      case "pending":
        return { label: "Confirm", next: "confirmed", color: "bg-blue-600 hover:bg-blue-500" };
      case "confirmed":
        return { label: "Check In Vehicle", next: "vehicle_received", color: "bg-purple-600 hover:bg-purple-500" };
      case "vehicle_received":
        return { label: "Start Washing", next: "washing_in_progress", color: "bg-cyan-600 hover:bg-cyan-500" };
      case "washing_in_progress":
        return { label: "Mark Ready", next: "ready_for_delivery", color: "bg-emerald-600 hover:bg-emerald-500" };
      case "ready_for_delivery":
        return { label: "Complete & Deliver", next: "completed", color: "bg-green-600 hover:bg-green-500" };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Live Operations Dashboard
          </h2>
          <p className="text-xs text-zinc-400">
            Real-time workshop bay occupancy, customer visits, and actual financial collections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/payments"
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Record Payment</span>
          </Link>
          <Link
            href="/book"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-electric-600/30 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Booking</span>
          </Link>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Today's Bookings */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Today&apos;s Bookings</span>
            <CalendarDays className="w-4 h-4 text-electric-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.today_bookings}</div>
          <p className="text-[10px] text-zinc-500 mt-1">Scheduled today</p>
        </div>

        {/* Washing In Progress */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-cyan-500/30">
          <div className="flex items-center justify-between text-cyan-400 text-xs mb-1">
            <span>In Wash Bay</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div className="text-2xl font-black text-white">{stats.washing_in_progress}</div>
          <p className="text-[10px] text-cyan-400/80 mt-1">Vehicles currently being washed</p>
        </div>

        {/* Pending Approval */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.pending_bookings}</div>
          <p className="text-[10px] text-amber-400 mt-1">Needs confirmation</p>
        </div>

        {/* Today's Actual Collection */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-400 text-xs mb-1">
            <span>Today&apos;s Cash/UPI</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            {formatCurrency(stats.today_collection)}
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">Actual collected today</p>
        </div>

        {/* Outstanding Balance */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Outstanding Due</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400">
            {formatCurrency(stats.outstanding_balance)}
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Unpaid balances</p>
        </div>

        {/* Estimated Monthly Profit */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
            <span>Monthly Est. Profit</span>
            <TrendingUp className="w-4 h-4 text-electric-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-electric-400">
            {formatCurrency(stats.estimated_profit)}
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Revenue minus expenses</p>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trends (7 Days) */}
        <div className="lg:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white">Daily Collections &amp; Activity</h3>
              <p className="text-[11px] text-zinc-400">Actual payment collections recorded in the database</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Month Total: {formatCurrency(stats.monthly_collection)}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0c121e",
                    borderColor: "#27272a",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${formatCurrency(value)}`, "Collected"]}
                />
                <Bar dataKey="revenue" fill="#0066ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie */}
        <div className="lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Booking Status Mix</h3>
            <p className="text-[11px] text-zinc-400 mb-4">Breakdown across active workshop stages</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0c121e",
                      borderColor: "#27272a",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-zinc-800">
            {statusData.map((st) => (
              <div key={st.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                <span className="text-zinc-400 text-[11px]">
                  {st.name} ({st.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT BOOKINGS & BAY FLOW */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Active Wash Appointments</h3>
            <p className="text-xs text-zinc-400">
              One-click stage progression for workshop technicians
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-electric-400 hover:text-white flex items-center gap-1 transition"
          >
            <span>View All Bookings</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3 px-3">Booking Ref</th>
                <th className="py-3 px-3">Customer &amp; Phone</th>
                <th className="py-3 px-3">Vehicle</th>
                <th className="py-3 px-3">Package</th>
                <th className="py-3 px-3">Slot Time</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Amount / Balance</th>
                <th className="py-3 px-3 text-right">Quick Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {recentBookings.map((b) => {
                const badge = getStatusBadge(b.status);
                const nextAction = getNextStatusAction(b.status);

                return (
                  <tr key={b.id} className="hover:bg-zinc-800/30 transition">
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      <Link href={`/track?ref=${b.booking_number}`} className="hover:text-electric-400">
                        {b.booking_number}
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{b.customer?.full_name || "Customer"}</div>
                      <div className="text-[10px] text-zinc-400">{b.customer?.phone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white uppercase">{b.vehicle?.reg_number}</div>
                      <div className="text-[10px] text-zinc-400">
                        {b.vehicle?.brand} {b.vehicle?.model}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-zinc-300 font-medium">
                      {b.package?.name || "Wash Service"}
                    </td>
                    <td className="py-3 px-3 text-zinc-400">
                      <div>{formatDate(b.booking_date, "dd MMM")}</div>
                      <div className="text-[10px] text-zinc-500">{b.time_slot}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${badge.color}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{formatCurrency(b.final_amount)}</div>
                      <div className="text-[10px]">
                        {b.remaining_balance && b.remaining_balance > 0 ? (
                          <span className="text-amber-400">Due: {formatCurrency(b.remaining_balance)}</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">Fully Paid</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {nextAction ? (
                        <button
                          onClick={() => handleQuickStatusChange(b.id, nextAction.next)}
                          className={`px-3 py-1.5 rounded-lg text-white font-bold text-[11px] transition shadow ${nextAction.color}`}
                        >
                          {nextAction.label}
                        </button>
                      ) : (
                        <span className="text-zinc-500 text-[11px] font-mono">Delivered</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
