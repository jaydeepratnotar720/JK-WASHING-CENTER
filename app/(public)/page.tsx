"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  CalendarCheck,
  ShieldCheck,
  Clock,
  Droplets,
  Star,
  CheckCircle2,
  Car,
  Bike,
  ArrowRight,
  PhoneCall,
  MapPin,
  ChevronRight,
  Search,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { initialPackages } from "@/lib/db/seed-data";

export default function HomePage() {
  const [vehicleTab, setVehicleTab] = useState<"all" | "car" | "bike">("all");

  const filteredPackages =
    vehicleTab === "all"
      ? initialPackages
      : initialPackages.filter((p) => p.vehicle_type === vehicleTab);

  const stats = [
    { label: "Vehicles Cleaned", value: "15,200+", icon: Droplets },
    { label: "Customer Rating", value: "4.9 / 5.0", icon: Star },
    { label: "Wash Bays", value: "4 Dedicated", icon: ShieldCheck },
    { label: "Detailing Experts", value: "8 Trained", icon: Clock },
  ];

  const steps = [
    {
      num: "01",
      title: "Book Your Slot Online",
      desc: "Pick your car or bike package, select an available time slot, and receive instant confirmation.",
    },
    {
      num: "02",
      title: "Drive In & Relax",
      desc: "Bring your vehicle to our studio. Chill in our air-conditioned lounge with free Wi-Fi and coffee.",
    },
    {
      num: "03",
      title: "Deep Detailing & Wash",
      desc: "Snow foam bath, underbody high-pressure rinse, interior steam sanitization, and tire shine.",
    },
    {
      num: "04",
      title: "Quality Check & Deliver",
      desc: "Our supervisor performs a 15-point checklist before handing you back the keys with mirror shine.",
    },
  ];

  const benefits = [
    {
      title: "100% RO Soft Deionized Water",
      desc: "We use filtered soft water to ensure zero hard-water mineral spots on your vehicle paint.",
      icon: Droplets,
    },
    {
      title: "German High-Pressure Tech",
      desc: "Kärcher professional commercial washers with dense snow foam cannons that encapsulate dirt safely.",
      icon: Sparkles,
    },
    {
      title: "Color-Coded Microfiber Cloths",
      desc: "Separate plush 800 GSM towels for paintwork, wheels, and interior to prevent swirl marks.",
      icon: ShieldCheck,
    },
    {
      title: "Dedicated Bike Washing Bays",
      desc: "Custom bike lifts, safe chain degreasers, and gentle radiator fins pressure for motorcycles.",
      icon: Bike,
    },
    {
      title: "Live Bay Tracking",
      desc: "Track the real-time stage of your wash right from your smartphone browser or PWA app.",
      icon: Clock,
    },
    {
      title: "Transparent & Honest Pricing",
      desc: "Fixed packages with no hidden charges. Choose add-ons only if you need them.",
      icon: CheckCircle2,
    },
  ];

  const testimonials = [
    {
      name: "Rohan Kapoor",
      vehicle: "BMW 3 Series",
      rating: 5,
      comment:
        "The snow foam bath and interior deep clean at JK Washing Center is leagues ahead of other places. Not a single swirl mark on my black paint!",
      date: "2 days ago",
    },
    {
      name: "Aditya Sawant",
      vehicle: "Kawasaki Ninja ZX-6R",
      rating: 5,
      comment:
        "Finally a wash place that knows how to treat a superbike! Proper chain degreaser, pneumatic blow-dry, and no water in electricals. Highly recommended.",
      date: "1 week ago",
    },
    {
      name: "Pooja Deshmukh",
      vehicle: "Kia Seltos",
      rating: 5,
      comment:
        "Booking through their PWA was so quick. Booked a 10 AM slot, reached on time, and was out in 45 minutes with a gleaming car. Staff is very polite.",
      date: "2 weeks ago",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-radial-detailing">
        {/* Glow ambient effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-electric-600/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric-500/10 border border-electric-500/30 text-electric-400 text-xs font-semibold tracking-wide uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-electric-400 animate-spin" />
                <span>Next-Gen Detailing &amp; PWA Booking</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Your Car. Your Bike. <br />
                <span className="text-gradient-electric">Our Unmatched Shine.</span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Welcome to <strong className="text-white">JK WASHING CENTER</strong>. Premium automotive detailing, snow foam baths, interior steam sanitization, and 9H ceramic coating protection powered by precision German pressure equipment.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="/book"
                  className="w-full sm:w-auto px-8 py-4 bg-electric-600 hover:bg-electric-500 text-white font-bold text-base rounded-2xl transition shadow-xl shadow-electric-600/30 flex items-center justify-center gap-2 group"
                >
                  <CalendarCheck className="w-5 h-5 group-hover:scale-110 transition" />
                  <span>Book an Appointment</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  href="/track"
                  className="w-full sm:w-auto px-6 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-semibold text-base rounded-2xl transition flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-electric-400" />
                  <span>Track Live Wash</span>
                </Link>
              </div>

              {/* Quick highlights */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-electric-400" />
                  <span>Instant Slot Confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-electric-400" />
                  <span>Zero Hard-Water Marks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-electric-400" />
                  <span>Pay Online or at Desk</span>
                </div>
              </div>
            </div>

            {/* Right Media Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden border border-zinc-700/60 bg-gradient-to-b from-zinc-800/80 to-zinc-900/90 p-3 shadow-2xl shadow-black/80">
                <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1000&q=80"
                    alt="Premium Snow Foam Car Wash at JK Washing Center"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-black/30" />

                  {/* Floating badge top */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-zinc-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Bays Active: 4 / 4 Operating</span>
                  </div>

                  {/* Floating badge bottom */}
                  <div className="absolute bottom-4 left-4 right-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-700 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                    <div>
                      <p className="text-xs text-zinc-400">Special Introductory Wash</p>
                      <h4 className="text-base font-bold text-white">Basic Bike Wash from ₹99</h4>
                      <p className="text-[11px] text-electric-400 font-medium">Basic Car Foam Wash from ₹299</p>
                    </div>
                    <Link
                      href="/book"
                      className="px-4 py-2 bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs rounded-xl transition"
                    >
                      Book Slot
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-zinc-800/80 bg-[#0c121e]/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
                <div className="w-12 h-12 rounded-2xl bg-electric-500/10 border border-electric-500/20 flex items-center justify-center text-electric-400 flex-shrink-0">
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-zinc-400 font-medium">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES & PRICING SECTION */}
      <section className="py-20 bg-[#0a0e17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Transparent Detailing Packages
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Choose the Perfect Wash for Your Ride
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              No hidden fees, no unnecessary upselling. Every package includes precision high-pressure rinse, active foam bath, and scratch-free dry.
            </p>

            {/* Filter Pill Tabs */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setVehicleTab("all")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                  vehicleTab === "all"
                    ? "bg-electric-600 text-white shadow-lg shadow-electric-600/30"
                    : "bg-zinc-800/80 text-zinc-400 hover:text-white"
                }`}
              >
                All Packages
              </button>
              <button
                onClick={() => setVehicleTab("car")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  vehicleTab === "car"
                    ? "bg-electric-600 text-white shadow-lg shadow-electric-600/30"
                    : "bg-zinc-800/80 text-zinc-400 hover:text-white"
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                Car Wash
              </button>
              <button
                onClick={() => setVehicleTab("bike")}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  vehicleTab === "bike"
                    ? "bg-electric-600 text-white shadow-lg shadow-electric-600/30"
                    : "bg-zinc-800/80 text-zinc-400 hover:text-white"
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                Bike Wash
              </button>
            </div>
          </div>

          {/* Package Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col bg-zinc-900/60 ${
                  pkg.is_popular
                    ? "border-electric-500/70 shadow-2xl shadow-electric-600/10 ring-1 ring-electric-500/40"
                    : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                {pkg.is_popular && (
                  <div className="absolute top-4 right-4 z-20 bg-electric-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                {/* Package Image banner */}
                <div className="relative h-48 w-full bg-zinc-800">
                  <Image
                    src={pkg.image_url || "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80"}
                    alt={pkg.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold uppercase text-zinc-300 border border-zinc-700">
                      {pkg.vehicle_type === "car" ? "Car Detailing" : "Bike Wash"}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-medium text-zinc-300 flex items-center gap-1 border border-zinc-700">
                      <Clock className="w-3 h-3 text-electric-400" />
                      {pkg.estimated_duration_mins} mins
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">{pkg.description}</p>

                  <div className="mb-6 pb-6 border-b border-zinc-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        {formatCurrency(pkg.price)}
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">+ applicable GST</span>
                    </div>
                  </div>

                  {/* Included features */}
                  <div className="space-y-2.5 flex-1 mb-6">
                    <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Included Services:
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
                    className={`w-full py-3 rounded-xl font-bold text-sm text-center transition flex items-center justify-center gap-2 ${
                      pkg.is_popular
                        ? "bg-electric-600 hover:bg-electric-500 text-white shadow-lg shadow-electric-600/30"
                        : "bg-zinc-800 hover:bg-zinc-700 text-white"
                    }`}
                  >
                    <span>Book This Package</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 text-sm text-electric-400 hover:text-electric-300 font-semibold"
            >
              <span>Explore all custom add-ons &amp; standalone services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW OUR SERVICE WORKS */}
      <section className="py-20 bg-[#0c121e]/90 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              How JK Washing Center Works
            </h2>
            <p className="text-sm text-zinc-400">
              A hassle-free 4-step car and bike detailing journey from booking to driving off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((st, i) => (
              <div
                key={i}
                className="relative bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl font-black text-electric-500/20 font-mono mb-4">
                    {st.num}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{st.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE JK WASHING CENTER */}
      <section className="py-20 bg-[#0a0e17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-bold uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              The JK Advantage
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Why Automobile Owners Trust Us
            </h2>
            <p className="text-sm text-zinc-400">
              We treat every car and motorcycle with the same devotion as our own.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-zinc-900/40 border border-zinc-800/80 hover:border-electric-500/30 rounded-3xl p-6 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-electric-500/10 border border-electric-500/20 flex items-center justify-center text-electric-400 mb-5">
                  <b.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{b.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="py-20 bg-[#0c121e]/90 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Loved by Car &amp; Bike Enthusiasts
            </h2>
            <p className="text-sm text-zinc-400">
              Real feedback from regular motorists and weekend riders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-300 italic mb-6 leading-relaxed">
                    &quot;{t.comment}&quot;
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-electric-400 font-medium">{t.vehicle}</p>
                  </div>
                  <span className="text-[10px] text-zinc-500">{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKSHOP ADDRESS & CTA BANNER */}
      <section className="py-20 bg-[#0a0e17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-electric-500/30 bg-gradient-to-r from-zinc-900 via-[#0c1524] to-zinc-900 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold text-electric-400 uppercase tracking-widest">
                  Convenient Detailing Studio Location
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Drop In or Schedule Your Slot Today
                </h3>
                <div className="text-sm text-zinc-300 space-y-2">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-electric-400 flex-shrink-0" />
                    <span>Plot 42, Service Road, Near Highway Junction, Mumbai, Maharashtra 400001</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-electric-400 flex-shrink-0" />
                    <span>Open 7 Days a Week: 08:00 AM – 08:00 PM</span>
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link
                  href="/book"
                  className="px-6 py-3.5 bg-electric-600 hover:bg-electric-500 text-white font-bold text-sm rounded-xl text-center shadow-lg shadow-electric-600/30 transition"
                >
                  Book Wash Appointment
                </Link>
                <a
                  href="https://wa.me/919876543210?text=Hi%20JK%20Washing%20Center,%20I%20want%20to%20inquire%20about%20a%20wash%20slot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl text-center shadow transition flex items-center justify-center gap-2"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
