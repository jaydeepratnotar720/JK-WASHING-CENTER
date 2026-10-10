"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Calendar,
  TrendingDown,
  TrendingUp,
  X,
  PieChart,
} from "lucide-react";
import {
  getExpenses,
  createExpense,
  deleteExpense,
  getDashboardStats,
  getCurrentUser,
} from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Expense, ExpenseCategory } from "@/types";

const CATEGORIES: { key: ExpenseCategory; label: string }[] = [
  { key: "cleaning_products", label: "Cleaning Products & Chemicals" },
  { key: "water_and_electricity", label: "Water & Electricity Utilities" },
  { key: "staff_salaries", label: "Staff Salaries & Wages" },
  { key: "equipment_maintenance", label: "Equipment Maintenance & Parts" },
  { key: "rent", label: "Workshop Shed Rent" },
  { key: "marketing", label: "Marketing & Local Ads" },
  { key: "other", label: "Other Expenses" },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form states
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<ExpenseCategory>("cleaning_products");
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");

  const [stats, setStats] = useState(getDashboardStats());
  const currentUser = getCurrentUser();

  const loadData = () => {
    setExpenses(getExpenses(categoryFilter));
    setStats(getDashboardStats());
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter]);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description.trim()) return;

    createExpense({
      category,
      amount,
      expense_date: expenseDate,
      description: description.trim(),
    });

    setCreateModalOpen(false);
    setAmount(0);
    setDescription("");
    loadData();
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm("Are you sure you want to delete this expense record?")) {
      deleteExpense(id);
      loadData();
    }
  };

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Workshop Expense Management
          </h2>
          <p className="text-xs text-zinc-400">
            Log overhead costs, equipment parts, and chemicals. Net profit is computed strictly against actual collected revenues.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Workshop Expense</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-emerald-500/30">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Monthly Cash Collected
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {formatCurrency(stats.monthly_collection)}
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Verified customer receipts</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-rose-500/30">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <TrendingDown className="w-4 h-4 text-rose-400" />
            Monthly Expenses Logged
          </span>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {formatCurrency(stats.total_expenses)}
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Cleaning materials &amp; overheads</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-electric-500/30">
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-electric-400" />
            Estimated Net Profit
          </span>
          <div className="text-2xl font-black text-electric-400 mt-1">
            {formatCurrency(stats.estimated_profit)}
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">Collected Revenue minus Expenses</p>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Category Filter:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-800/80 border border-zinc-700/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="all">All Expense Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          Total Filtered: <span className="text-white font-bold">{formatCurrency(totalExpenseAmount)}</span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-zinc-400 bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {expenses.length > 0 ? (
                expenses.map((e) => {
                  const catObj = CATEGORIES.find((c) => c.key === e.category);
                  return (
                    <tr key={e.id} className="hover:bg-zinc-800/30 transition">
                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {formatDate(e.expense_date)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-semibold text-zinc-200">
                          {catObj?.label || e.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-white font-medium">{e.description}</td>
                      <td className="py-3.5 px-4 font-black text-rose-400 text-sm">
                        {formatCurrency(e.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteExpense(e.id)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 transition rounded-lg hover:bg-rose-500/10"
                          title="Delete expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500">
                    No expense records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD EXPENSE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base">Record Workshop Expense</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Amount (₹) *</label>
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
                  <label className="text-xs text-zinc-400 mb-1 block">Expense Date *</label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Description &amp; Vendor Name *</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Koch-Chemie 5L shampoo can from Metro Auto Supplies..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-2 bg-zinc-800 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 font-bold rounded-xl text-xs shadow-lg shadow-rose-600/30"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
