import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Droplets, Users, Award, CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-bold uppercase">
            <Award className="w-4 h-4" /> About JK Washing Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">
            Detailing Excellence Born from Pure Passion
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Founded with a singular mission: to provide vehicle owners with studio-grade car and bike detailing without astronomical price tags or long waiting times.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 w-full rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80"
              alt="Detailing studio at JK Washing Center"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white">
              Why Standard Car Washes Damage Paint
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Most roadside washing places use hard tap water rich in calcium, harsh caustic washing powders, and re-used gritty rags that inflict thousands of microscopic swirl scratches into vehicle clear coats.
            </p>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              At <strong className="text-white">JK WASHING CENTER</strong>, every vehicle receives a two-bucket wash technique, multi-stage filtration water, dense snow foam pre-wash to dissolve road grit without contact, and plush 800 GSM microfibers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="font-bold text-white text-sm">RO Filtered Water</div>
                <p className="text-xs text-zinc-400">Zero white water stains or clear coat oxidation.</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="font-bold text-white text-sm">German Equipment</div>
                <p className="text-xs text-zinc-400">High-flow Kärcher pressure rigs and rotary polishers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-electric-500/10 text-electric-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Quality Guarantee</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every vehicle undergoes a 15-point inspection checklist prior to handover. If you spot a missed spot, we reclean it instantly.
            </p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-electric-500/10 text-electric-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Certified Technicians</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our detailers undergo rigorous hands-on training covering paint depth analysis, machine buffing, and ceramic coat curing.
            </p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-electric-500/10 text-electric-400 flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Eco-Conscious Recycling</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our workshop incorporates grit filtration and oil-water separation to minimize water consumption and environmental runoff.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
