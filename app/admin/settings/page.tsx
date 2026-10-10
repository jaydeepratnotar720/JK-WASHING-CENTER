"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  UserCheck,
  Save,
  CheckCircle2,
  Users,
} from "lucide-react";
import {
  getBusinessSettings,
  updateBusinessSettings,
  getCurrentUser,
} from "@/lib/db";
import { initialStaffProfiles } from "@/lib/db/seed-data";
import { BusinessSettings, StaffProfile } from "@/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings>(getBusinessSettings());
  const [staff, setStaff] = useState<StaffProfile[]>(initialStaffProfiles);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    setSettings(getBusinessSettings());
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Studio Configuration &amp; Workshop Settings
          </h2>
          <p className="text-xs text-zinc-400">
            Configure workshop location, GST taxation rate, bay throughput limits, and staff roles.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Form Card */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-electric-400" />
            <span>Business Profile &amp; Contact Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Business Name</label>
              <input
                type="text"
                required
                value={settings.business_name}
                onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Tagline</label>
              <input
                type="text"
                required
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Primary Phone</label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Alternate Phone / WhatsApp</label>
              <input
                type="text"
                value={settings.alt_phone || ""}
                onChange={(e) => setSettings({ ...settings, alt_phone: e.target.value })}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Official Email</label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">GSTIN Identification Number</label>
              <input
                type="text"
                value={settings.gstin || ""}
                onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                placeholder="27AAAAA0000A1Z5"
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400 mb-1.5 block">Workshop Studio Address</label>
            <textarea
              rows={2}
              required
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full bg-zinc-800/70 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white"
            />
          </div>
        </div>

        {/* Operating Hours & Bay Capacity */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-electric-400" />
            <span>Capacity &amp; Taxation Setup</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">GST Tax Rate (%)</label>
              <input
                type="number"
                required
                min={0}
                max={50}
                value={settings.tax_percentage}
                onChange={(e) => setSettings({ ...settings, tax_percentage: parseFloat(e.target.value) || 0 })}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Slot Capacity / Hour (Bays)</label>
              <input
                type="number"
                required
                min={1}
                max={20}
                value={settings.slot_capacity_per_hour}
                onChange={(e) => setSettings({ ...settings, slot_capacity_per_hour: parseInt(e.target.value) || 4 })}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Currency Symbol</label>
              <input
                type="text"
                required
                value={settings.currency_symbol}
                onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                className="w-full bg-zinc-800/70 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-electric-600/30 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Staff & Roles Section */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-electric-400" />
            <span>Staff Members &amp; RBAC Roles</span>
          </h3>
        </div>

        <div className="space-y-3">
          {staff.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/60 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-electric-600/20 text-electric-400 flex items-center justify-center font-bold">
                  {s.role === "admin" ? <ShieldCheck className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{s.full_name}</h4>
                  <p className="text-zinc-400 font-mono text-[11px]">{s.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    s.role === "admin"
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}
                >
                  {s.role}
                </span>
                <span className="text-emerald-400 text-[10px] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
