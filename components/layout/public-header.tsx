"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  PhoneCall,
  CalendarCheck,
  ShieldCheck,
  Car,
  Bike,
  Search,
} from "lucide-react";
import Image from "next/image";

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/car-wash", label: "Car Wash", icon: Car },
    { href: "/bike-wash", label: "Bike Wash", icon: Bike },
    { href: "/packages", label: "Packages & Pricing" },
    { href: "/track", label: "Track Wash", icon: Search },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0e17]/90 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-electric-500 to-electric-800 p-0.5 shadow-lg shadow-electric-500/20 group-hover:scale-105 transition">
              <div className="w-full h-full bg-[#0c121e] rounded-[14px] flex items-center justify-center overflow-hidden">
                <Image
                  src="/icons/logo.svg"
                  alt="JK Washing Center Logo"
                  width={38}
                  height={38}
                  className="w-9 h-9 object-contain"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-wider text-white">JK</span>
                <span className="text-xl font-bold tracking-wider text-electric-400">WASHING</span>
              </div>
              <p className="text-[10px] tracking-widest text-zinc-400 uppercase font-semibold">
                Car &amp; Bike Detailing
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive
                      ? "text-electric-400 bg-electric-500/10 font-semibold"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 transition flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-electric-400" />
              Staff / Admin
            </Link>

            <Link
              href="/book"
              className="px-5 py-2.5 bg-electric-600 hover:bg-electric-500 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-electric-600/30 flex items-center gap-2 group"
            >
              <CalendarCheck className="w-4 h-4 group-hover:scale-110 transition" />
              <span>Book a Wash</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/book"
              className="px-3 py-1.5 bg-electric-600 text-white text-xs font-semibold rounded-lg"
            >
              Book Now
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-zinc-800 bg-[#0c121e]/98 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium transition ${
                  isActive
                    ? "bg-electric-600 text-white font-semibold"
                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-electric-600 hover:bg-electric-500 text-white text-center font-bold rounded-xl shadow-lg shadow-electric-600/30"
            >
              Book an Appointment
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-xs text-zinc-400 hover:text-white border border-zinc-800 rounded-xl"
            >
              Admin &amp; Staff Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
