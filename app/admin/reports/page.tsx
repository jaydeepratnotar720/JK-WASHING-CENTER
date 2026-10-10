"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  PieChart as PieIcon,
  CheckCircle2,
  Car,
  Bike,
} from "lucide-react";
import {
  getBookings,
  getPayments,
  getExpenses,
  getCustomers,
  getPackages,
  getDashboardStats,
} from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"collections" | "bookings" | "packages" | "expenses">("collections");
  const [bookings, setBookings] = useState(getBookings());
  const [payments, setPayments] = useState(getPayments());
  const [expenses, setExpenses] = useState(getExpenses());
  const [packages, setPackages] = useState(getPackages());
  const [stats, setStats] = useState(getDashboardStats());

  useEffect(() => {
    setBookings(getBookings());
    setPayments(getPayments());
    setExpenses(getExpenses());
    setPackages(getPackages());
    setStats(getDashboardStats());
  }, []);

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (reportType === "collections") {
      csvContent += "Receipt_Ref,Booking_ID,Amount,Method,Type,Verified,Date\n";
      payments.forEach((p) => {
        csvContent += `${p.transaction_reference},${p.booking_id},${p.amount},${p.payment_method},${p.payment_type},${p.is_gateway_verified},${p.created_at}\n`;
      });
    } else if (reportType === "bookings") {
      csvContent += "Booking_Number,Customer,Phone,Vehicle_Reg,Package,Date,Slot,Status,Amount,Paid,Remaining\n";
      bookings.forEach((b) => {
        csvContent += `${b.booking_number},"${b.customer?.full_name}",${b.customer?.phone},${b.vehicle?.reg_number},"${b.package?.name}",${b.booking_date},"${b.time_slot}",${b.status},${b.final_amount},${b.amount_paid},${b.remaining_balance}\n`;
      });
    } else if (reportType === "packages") {
      csvContent += "Package_Name,Vehicle_Type,Price,Duration_Mins,Active,Bookings_Count\n";
      packages.forEach((pkg) => {
        const count = bookings.filter((b) => b.package_id === pkg.id).length;
        csvContent += `"${pkg.name}",${pkg.vehicle_type},${pkg.price},${pkg.estimated_duration_mins},${pkg.is_active},${count}\n`;
      });
    } else {
      csvContent += "Category,Description,Amount,Date\n";
      expenses.forEach((e) => {
        csvContent += `"${e.category}","${e.description}",${e.amount},${e.expense_date}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jk_washing_${reportType}_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Business Reports &amp; Analytics
          </h2>
          <p className="text-xs text-zinc-400">
            Generate financial summaries, export CSV records, and inspect service delivery metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setReportType("collections")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportType === "collections" ? "bg-electric-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          Daily &amp; Monthly Collections
        </button>
        <button
          onClick={() => setReportType("bookings")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportType === "bookings" ? "bg-electric-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          Bookings Performance
        </button>
        <button
          onClick={() => setReportType("packages")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportType === "packages" ? "bg-electric-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          Package Popularity
        </button>
        <button
          onClick={() => setReportType("expenses")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            reportType === "expenses" ? "bg-electric-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          Expense &amp; Profit Report
        </button>
      </div>

      {/* RENDER SELECTED REPORT */}
      {reportType === "collections" && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-white">Collections Audit Report</h3>
              <p className="text-xs text-zinc-400">Total verified collections: {formatCurrency(stats.monthly_collection)}</p>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              Receipt Records: {payments.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Booking #</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-white">{p.transaction_reference}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400">{p.booking_id}</td>
                    <td className="py-2.5 px-3 font-black text-emerald-400">{formatCurrency(p.amount)}</td>
                    <td className="py-2.5 px-3 uppercase text-zinc-300 font-bold">{p.payment_method}</td>
                    <td className="py-2.5 px-3 uppercase text-zinc-400">{p.payment_type}</td>
                    <td className="py-2.5 px-3 text-zinc-400">{formatDate(p.created_at, "dd MMM yyyy, HH:mm")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === "bookings" && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-white">All Bookings Summary</h3>
              <p className="text-xs text-zinc-400">Total Bookings: {bookings.length}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">Booking Ref</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Vehicle</th>
                  <th className="py-2.5 px-3">Package</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-white">{b.booking_number}</td>
                    <td className="py-2.5 px-3 text-white font-medium">{b.customer?.full_name}</td>
                    <td className="py-2.5 px-3 font-mono uppercase text-zinc-300">{b.vehicle?.reg_number}</td>
                    <td className="py-2.5 px-3 text-zinc-400">{b.package?.name}</td>
                    <td className="py-2.5 px-3 text-zinc-400">{formatDate(b.booking_date)}</td>
                    <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-electric-400">{b.status}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{formatCurrency(b.final_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === "packages" && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-white">Package Volume &amp; Revenue Contribution</h3>
              <p className="text-xs text-zinc-400">Analyzed against actual completed bookings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => {
              const count = bookings.filter((b) => b.package_id === pkg.id).length;
              const grossRevenue = count * pkg.price;

              return (
                <div key={pkg.id} className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{pkg.name}</h4>
                    <span className="text-[10px] font-bold uppercase text-zinc-400">{pkg.vehicle_type}</span>
                  </div>
                  <div className="text-xs text-zinc-400">Base Price: {formatCurrency(pkg.price)}</div>
                  <div className="pt-2 border-t border-zinc-700/60 flex items-center justify-between text-xs">
                    <span>Times Booked: <strong className="text-white">{count}</strong></span>
                    <span className="text-emerald-400 font-bold">{formatCurrency(grossRevenue)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {reportType === "expenses" && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-zinc-800 text-center">
            <div>
              <span className="text-xs text-zinc-400">Gross Collections</span>
              <p className="text-xl font-black text-emerald-400 mt-1">{formatCurrency(stats.monthly_collection)}</p>
            </div>
            <div>
              <span className="text-xs text-zinc-400">Total Overheads</span>
              <p className="text-xl font-black text-rose-400 mt-1">{formatCurrency(stats.total_expenses)}</p>
            </div>
            <div>
              <span className="text-xs text-zinc-400">Net Estimated Profit</span>
              <p className="text-xl font-black text-electric-400 mt-1">{formatCurrency(stats.estimated_profit)}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {expenses.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2.5 px-3 font-mono text-zinc-300">{formatDate(e.expense_date)}</td>
                    <td className="py-2.5 px-3 uppercase text-[10px] text-zinc-400 font-semibold">{e.category}</td>
                    <td className="py-2.5 px-3 text-white font-medium">{e.description}</td>
                    <td className="py-2.5 px-3 text-right font-black text-rose-400">{formatCurrency(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
