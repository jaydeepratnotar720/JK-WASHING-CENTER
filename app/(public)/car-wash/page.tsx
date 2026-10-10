import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Car, Droplets, Sparkles, CheckCircle2, CalendarCheck, ShieldCheck, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { initialPackages, initialServices } from "@/lib/db/seed-data";

export default function CarWashPage() {
  const carPackages = initialPackages.filter((p) => p.vehicle_type === "car");
  const carAddons = initialServices.filter((s) => s.vehicle_type === "car" || s.vehicle_type === "both");

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-bold uppercase">
            <Car className="w-4 h-4" /> Professional Automobile Detailing
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">
            Precision Car Wash &amp; Paint Care
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            From quick exterior active snow foam baths to deep interior steam extraction and 9H paint protection, we keep your car immaculate inside and out.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {carPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-electric-500/40 transition"
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
                  <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-medium text-zinc-300 flex items-center gap-1 border border-zinc-700">
                    <Clock className="w-3 h-3 text-electric-400" />
                    {pkg.estimated_duration_mins} mins
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                <p className="text-xs text-zinc-400 mb-4">{pkg.description}</p>
                <div className="text-2xl font-black text-white mb-6">
                  {formatCurrency(pkg.price)}{" "}
                  <span className="text-xs text-zinc-500 font-normal">+ GST</span>
                </div>

                <div className="space-y-2 flex-1 mb-6">
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
                  Book Car Slot
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="bg-[#0c121e] border border-zinc-800 rounded-3xl p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">Car Detailing Add-ons</h3>
              <p className="text-xs text-zinc-400">Can be combined with any wash package.</p>
            </div>
            <Link
              href="/book"
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-semibold rounded-xl text-center"
            >
              Custom Booking
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {carAddons.map((ad) => (
              <div
                key={ad.id}
                className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white">{ad.name}</h4>
                  <p className="text-[11px] text-zinc-400">{ad.description}</p>
                  <span className="text-[10px] text-electric-400 font-mono mt-1 block">
                    ~{ad.estimated_duration_mins} mins
                  </span>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <div className="text-sm font-bold text-white">{formatCurrency(ad.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
