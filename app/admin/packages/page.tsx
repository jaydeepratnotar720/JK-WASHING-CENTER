"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Package as PackageIcon,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Car,
  Bike,
  Sparkles,
  X,
  Star,
} from "lucide-react";
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
  getServices,
  createService,
  updateService,
} from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Package, Service } from "@/types";

export default function PackagesAdminPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [tab, setTab] = useState<"all" | "car" | "bike">("all");

  // Modals
  const [editPkgModal, setEditPkgModal] = useState(false);
  const [createPkgModal, setCreatePkgModal] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [vType, setVType] = useState<"car" | "bike">("car");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState<number>(299);
  const [duration, setDuration] = useState<number>(45);
  const [featuresStr, setFeaturesStr] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [isPopular, setIsPopular] = useState(false);

  const loadData = () => {
    setPackages(getPackages());
    setServices(getServices());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPackages = packages.filter((p) => {
    if (tab !== "all" && p.vehicle_type !== tab) return false;
    return true;
  });

  const handleOpenEdit = (pkg: Package) => {
    setSelectedPkg(pkg);
    setName(pkg.name);
    setVType(pkg.vehicle_type);
    setDesc(pkg.description);
    setPrice(pkg.price);
    setDuration(pkg.estimated_duration_mins);
    setFeaturesStr(pkg.included_services.join("\n"));
    setImgUrl(pkg.image_url || "");
    setIsPopular(Boolean(pkg.is_popular));
    setEditPkgModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;

    updatePackage(selectedPkg.id, {
      name,
      vehicle_type: vType,
      description: desc,
      price,
      estimated_duration_mins: duration,
      included_services: featuresStr.split("\n").filter((f) => f.trim().length > 0),
      image_url: imgUrl,
      is_popular: isPopular,
    });

    setEditPkgModal(false);
    loadData();
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createPackage({
      name,
      vehicle_type: vType,
      description: desc,
      price,
      estimated_duration_mins: duration,
      included_services: featuresStr.split("\n").filter((f) => f.trim().length > 0),
      image_url: imgUrl || "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80",
      is_popular: isPopular,
      is_active: true,
    });

    setCreatePkgModal(false);
    loadData();
  };

  const handleToggleActive = (pkg: Package) => {
    updatePackage(pkg.id, { is_active: !pkg.is_active });
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Packages &amp; Pricing Management
          </h2>
          <p className="text-xs text-zinc-400">
            Configure detailing rates, add seasonal packages, and toggle active status. Past invoices preserve locked price snapshots.
          </p>
        </div>

        <button
          onClick={() => {
            setName("");
            setDesc("");
            setPrice(499);
            setDuration(45);
            setFeaturesStr("Exterior Foam Wash\nInterior Vacuum\nDashboard Polish");
            setImgUrl("");
            setIsPopular(false);
            setCreatePkgModal(true);
          }}
          className="px-4 py-2 bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-electric-600/30 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            tab === "all" ? "bg-electric-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          All Packages
        </button>
        <button
          onClick={() => setTab("car")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            tab === "car" ? "bg-electric-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          Cars
        </button>
        <button
          onClick={() => setTab("bike")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            tab === "bike" ? "bg-electric-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
        >
          <Bike className="w-3.5 h-3.5" />
          Bikes
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-zinc-900/60 border rounded-3xl overflow-hidden flex flex-col justify-between transition ${
              pkg.is_active ? "border-zinc-800" : "border-rose-900/40 opacity-70"
            }`}
          >
            <div className="relative h-40 w-full bg-zinc-800">
              <Image
                src={pkg.image_url || "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80"}
                alt={pkg.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/30" />
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                {pkg.is_popular && (
                  <span className="bg-electric-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Popular
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    pkg.is_active
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {pkg.is_active ? "Active" : "Disabled"}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-white text-base">{pkg.name}</h3>
                <span className="font-mono text-base font-black text-electric-400">
                  {formatCurrency(pkg.price)}
                </span>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{pkg.description}</p>

              <div className="space-y-1.5 flex-1 mb-4 text-xs text-zinc-300">
                {pkg.included_services.slice(0, 3).map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-electric-400 flex-shrink-0" />
                    <span className="line-clamp-1">{s}</span>
                  </div>
                ))}
                {pkg.included_services.length > 3 && (
                  <span className="text-[10px] text-zinc-500 font-medium">
                    +{pkg.included_services.length - 3} more treatments
                  </span>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleActive(pkg)}
                  className={`text-[11px] font-semibold transition ${
                    pkg.is_active ? "text-amber-400 hover:text-amber-300" : "text-emerald-400 hover:text-emerald-300"
                  }`}
                >
                  {pkg.is_active ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={() => handleOpenEdit(pkg)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit Rate</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editPkgModal && selectedPkg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base">Edit Package: {selectedPkg.name}</h3>
              <button onClick={() => setEditPkgModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Package Name</label>
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
                  <label className="text-xs text-zinc-400 mb-1 block">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Duration (mins)</label>
                  <input
                    type="number"
                    required
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Description</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Included Services (1 per line)</label>
                <textarea
                  rows={4}
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pop"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="accent-electric-600 rounded"
                />
                <label htmlFor="pop" className="text-xs text-zinc-300">Mark as Popular Badge</label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditPkgModal(false)}
                  className="flex-1 py-2 bg-zinc-800 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-electric-600 font-bold rounded-xl text-xs shadow-lg shadow-electric-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PACKAGE MODAL */}
      {createPkgModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-base">Create Detailing Package</h3>
              <button onClick={() => setCreatePkgModal(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePackage} className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Package Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Monsoon Shield Foam Wash"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Vehicle Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVType("car")}
                    className={`py-2 rounded-xl text-xs font-bold ${vType === "car" ? "bg-electric-600 text-white" : "bg-zinc-800 text-zinc-400"}`}
                  >
                    Car Wash
                  </button>
                  <button
                    type="button"
                    onClick={() => setVType("bike")}
                    className={`py-2 rounded-xl text-xs font-bold ${vType === "bike" ? "bg-electric-600 text-white" : "bg-zinc-800 text-zinc-400"}`}
                  >
                    Bike Wash
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Duration (mins)</label>
                  <input
                    type="number"
                    required
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Description</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Brief summary of package treatments..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Included Services (1 per line)</label>
                <textarea
                  rows={3}
                  value={featuresStr}
                  onChange={(e) => setFeaturesStr(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setCreatePkgModal(false)}
                  className="flex-1 py-2 bg-zinc-800 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-electric-600 font-bold rounded-xl text-xs shadow-lg shadow-electric-600/30"
                >
                  Add Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
