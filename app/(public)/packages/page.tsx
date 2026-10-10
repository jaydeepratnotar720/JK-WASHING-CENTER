"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Car, Bike, CheckCircle2, Clock, Sparkles, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { initialPackages, initialServices } from "@/lib/db/seed-data";

export default function PackagesPage() {
  const [tab, setTab] = useState<"all" | "car" | "bike">("all");

  const packages = tab === "all" ? initialPackages : initialPackages.filter((p) => p.vehicle_type === tab);
  const services = tab === "all" ? initialServices : initialServices.filter((s) => s.vehicle_type === tab || s.vehicle_type === "both");

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-bold uppercase">
            <Sparkles className="w-4 h-4" /> Comprehensive Catalog
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">
            Transparent Detailing &amp; Wash Packages
          </h1>
          <p className="text-sm sm:text-base text-zinc-400">
            Crafted for maximum shine, paint preservation, and interior hygiene. Compare services and choose what suits your automobile.
          </p>

          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setTab("all")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition ${
                tab === "all"
                  ? "bg-electric-600 text-white shadow-lg shadow-electric-600/30"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-white"
              }`}
            >
              All Packages ({initialPackages.length})
            </button>
            <button
              onClick={() => setTab("car")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                tab === "car"
                  ? "bg-electric-600 text-white shadow-lg shadow-electric-600/30"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-white"
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              Car ({initialPackages.filter((p) => p.vehicle_type === "car").length})
            </button>
            <button
              onClick={() => setTab("bike")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                tab === "bike"
                  ? "bg-electric-600 text-white shadow-lg shadow-electric-600/30"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-white"
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              Bike ({initialPackages.filter((p) => p.vehicle_type === "bike").length})
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-zinc-900/60 border rounded-3xl overflow-hidden flex flex-col justify-between transition ${
                pkg.is_popular
                  ? "border-electric-500/60 shadow-xl shadow-electric-600/10 ring-1 ring-electric-500/30"
                  : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="relative h-48 w-full bg-zinc-800">
                <Image
                  src={pkg.image_url || "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80"}
                  alt={pkg.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/30" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold uppercase text-zinc-300 border border-zinc-700">
                    {pkg.vehicle_type === "car" ? "Car Detailing" : "Bike Care"}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-medium text-zinc-300 flex items-center gap-1 border border-zinc-700">
                    <Clock className="w-3 h-3 text-electric-400" />
                    {pkg.estimated_duration_mins} mins
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                <p className="text-xs text-zinc-400 mb-4">{pkg.description}</p>
                <div className="text-3xl font-black text-white mb-6">
                  {formatCurrency(pkg.price)}{" "}
                  <span className="text-xs text-zinc-500 font-normal">+ GST</span>
                </div>

                <div className="space-y-2 flex-1 mb-6">
                  <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Included Features:
                  </p>
                  {pkg.included_services.map((svc, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-electric-400 flex-shrink-0 mt-0.5" />
                      <span>{svc}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/book?packageId=${pkg.id}`}
                  className="w-full py-3 bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs rounded-xl text-center transition"
                >
                  Book Package
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Standalone Add-ons */}
        <div className="bg-[#0c121e] border border-zinc-800 rounded-3xl p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              Add-ons &amp; Individual Treatments
            </h3>
            <p className="text-xs text-zinc-400">
              Personalize your wash with targeted treatments like engine bay degrease, AC vent disinfection, and rain-repellent coat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{s.name}</h4>
                  <p className="text-xs text-zinc-400">{s.description}</p>
                  <span className="text-[10px] text-electric-400 font-mono mt-1 block">
                    Duration: ~{s.estimated_duration_mins} mins
                  </span>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-base font-black text-white">{formatCurrency(s.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
