"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  PlusCircle,
  Car,
  Bike,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Edit,
  Archive,
  ChevronRight,
  X,
  Plus,
} from "lucide-react";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  createVehicle,
  getBookings,
  getPayments,
} from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Customer, Vehicle } from "@/types";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Form states for customer creation
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Form states for vehicle creation
  const [vType, setVType] = useState<"car" | "bike">("car");
  const [vReg, setVReg] = useState("");
  const [vBrand, setVBrand] = useState("");
  const [vModel, setVModel] = useState("");
  const [vColor, setVColor] = useState("");
  const [vCategory, setVCategory] = useState("Sedan");
  const [vInstructions, setVInstructions] = useState("");

  const loadData = () => {
    const list = getCustomers(search);
    setCustomers(list);
    if (selectedCustomer) {
      const refreshed = list.find((c) => c.id === selectedCustomer.id);
      if (refreshed) setSelectedCustomer(refreshed);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    createCustomer({
      full_name: name.trim(),
      phone: phone.trim(),
      alt_phone: altPhone.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setCreateModalOpen(false);
    setName("");
    setPhone("");
    setAltPhone("");
    setEmail("");
    setAddress("");
    setNotes("");
    loadData();
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !vReg.trim() || !vModel.trim()) return;

    createVehicle({
      customer_id: selectedCustomer.id,
      vehicle_type: vType,
      reg_number: vReg.trim().toUpperCase(),
      brand: vBrand.trim() || "Brand",
      model: vModel.trim(),
      color: vColor.trim() || undefined,
      category: vCategory,
      special_instructions: vInstructions.trim() || undefined,
    });

    setVehicleModalOpen(false);
    setVReg("");
    setVBrand("");
    setVModel("");
    setVColor("");
    setVInstructions("");
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Customer Directory &amp; Fleet Management
          </h2>
          <p className="text-xs text-zinc-400">
            Search customer records, manage registered vehicles, and inspect lifetime wash spend.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-electric-600/30 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers by name, phone number, vehicle registration..."
          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-electric-500"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-zinc-400 bg-zinc-900 border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Customer ID</th>
                <th className="py-3.5 px-4">Full Name</th>
                <th className="py-3.5 px-4">Phone / Contact</th>
                <th className="py-3.5 px-4">Vehicles</th>
                <th className="py-3.5 px-4">Visits</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Balance Due</th>
                <th className="py-3.5 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {customers.length > 0 ? (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-800/30 transition">
                    <td className="py-3.5 px-4 font-mono text-zinc-400">{c.customer_code}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{c.full_name}</td>
                    <td className="py-3.5 px-4 text-zinc-300 font-mono">{c.phone}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {c.vehicles && c.vehicles.length > 0 ? (
                          c.vehicles.map((v) => (
                            <span
                              key={v.id}
                              className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono font-semibold text-white uppercase"
                            >
                              {v.reg_number}
                            </span>
                          ))
                        ) : (
                          <span className="text-zinc-500 text-[10px]">No vehicle</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">{c.visits_count || 0}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      {formatCurrency(c.total_spent || 0)}
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      {c.outstanding_balance && c.outstanding_balance > 0 ? (
                        <span className="text-rose-400">{formatCurrency(c.outstanding_balance)}</span>
                      ) : (
                        <span className="text-zinc-500 font-normal">₹0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 bg-electric-600/20 text-electric-400 hover:bg-electric-600/30 font-bold rounded-lg transition"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    No customers found matching &quot;{search}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER PROFILE MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 text-white space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-black">{selectedCustomer.full_name}</h3>
                <span className="font-mono text-xs text-electric-400">{selectedCustomer.customer_code}</span>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-zinc-800/50 rounded-2xl border border-zinc-700/60 text-center">
                <span className="text-[10px] text-zinc-400 uppercase">Lifetime Visits</span>
                <p className="text-xl font-black text-white mt-0.5">{selectedCustomer.visits_count || 0}</p>
              </div>
              <div className="p-3 bg-zinc-800/50 rounded-2xl border border-zinc-700/60 text-center">
                <span className="text-[10px] text-zinc-400 uppercase">Total Spend</span>
                <p className="text-xl font-black text-emerald-400 mt-0.5">{formatCurrency(selectedCustomer.total_spent || 0)}</p>
              </div>
              <div className="p-3 bg-zinc-800/50 rounded-2xl border border-zinc-700/60 text-center">
                <span className="text-[10px] text-zinc-400 uppercase">Balance Due</span>
                <p className="text-xl font-black text-rose-400 mt-0.5">{formatCurrency(selectedCustomer.outstanding_balance || 0)}</p>
              </div>
            </div>

            {/* Contact & Address */}
            <div className="p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-electric-400" />
                <span className="text-zinc-400">Mobile:</span>
                <span className="font-bold text-white font-mono">{selectedCustomer.phone}</span>
                {selectedCustomer.alt_phone && (
                  <span className="text-zinc-500 font-mono">/ {selectedCustomer.alt_phone}</span>
                )}
              </div>
              {selectedCustomer.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-electric-400" />
                  <span className="text-zinc-400">Email:</span>
                  <span className="text-white">{selectedCustomer.email}</span>
                </div>
              )}
              {selectedCustomer.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-electric-400 mt-0.5" />
                  <span className="text-zinc-400">Address:</span>
                  <span className="text-white">{selectedCustomer.address}</span>
                </div>
              )}
              {selectedCustomer.notes && (
                <div className="pt-2 border-t border-zinc-800 text-zinc-300">
                  <span className="font-semibold text-electric-400">Notes:</span> {selectedCustomer.notes}
                </div>
              )}
            </div>

            {/* Registered Vehicles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Registered Vehicles ({selectedCustomer.vehicles?.length || 0})
                </h4>
                <button
                  onClick={() => setVehicleModalOpen(true)}
                  className="px-2.5 py-1 bg-electric-600 hover:bg-electric-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Vehicle</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedCustomer.vehicles?.map((v) => (
                  <div key={v.id} className="p-3.5 bg-zinc-800/60 rounded-2xl border border-zinc-700/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white uppercase">{v.reg_number}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-electric-500/10 text-electric-400 uppercase font-semibold">
                        {v.vehicle_type}
                      </span>
                    </div>
                    <p className="text-zinc-300 font-medium">{v.brand} {v.model} ({v.color || "Color"})</p>
                    {v.special_instructions && (
                      <p className="text-[11px] text-amber-400/90 italic pt-1">{v.special_instructions}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* CREATE CUSTOMER MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base">Register New Customer</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Alt Phone</label>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  className="flex-1 py-2 bg-electric-600 font-bold rounded-xl text-xs"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {vehicleModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base">Add Vehicle to Customer</h3>
              <button onClick={() => setVehicleModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Vehicle Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVType("car")}
                    className={`py-2 rounded-xl text-xs font-bold ${
                      vType === "car" ? "bg-electric-600 text-white" : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    Car
                  </button>
                  <button
                    type="button"
                    onClick={() => setVType("bike")}
                    className={`py-2 rounded-xl text-xs font-bold ${
                      vType === "bike" ? "bg-electric-600 text-white" : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    Bike
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Registration Number *</label>
                <input
                  type="text"
                  required
                  value={vReg}
                  onChange={(e) => setVReg(e.target.value.toUpperCase())}
                  placeholder="e.g. MH 02 CZ 4492"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Brand</label>
                  <input
                    type="text"
                    value={vBrand}
                    onChange={(e) => setVBrand(e.target.value)}
                    placeholder="e.g. Honda"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Model *</label>
                  <input
                    type="text"
                    required
                    value={vModel}
                    onChange={(e) => setVModel(e.target.value)}
                    placeholder="e.g. City ZX"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Color</label>
                <input
                  type="text"
                  value={vColor}
                  onChange={(e) => setVColor(e.target.value)}
                  placeholder="e.g. Pearl White"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Special Detailing Instructions</label>
                <textarea
                  rows={2}
                  value={vInstructions}
                  onChange={(e) => setVInstructions(e.target.value)}
                  placeholder="e.g. Matte finish, avoid polish on decals..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVehicleModalOpen(false)}
                  className="flex-1 py-2 bg-zinc-800 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-electric-600 font-bold rounded-xl text-xs"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
