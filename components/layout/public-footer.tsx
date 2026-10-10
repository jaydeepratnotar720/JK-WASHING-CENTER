import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, MessageSquare, Shield, Sparkles } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-[#070a10] border-t border-zinc-800 text-zinc-400 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-500 to-electric-700 p-0.5">
                <div className="w-full h-full bg-[#0c121e] rounded-[10px] flex items-center justify-center">
                  <Image
                    src="/icons/logo.svg"
                    alt="Logo"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                </div>
              </div>
              <span className="text-xl font-black text-white tracking-wide">
                JK <span className="text-electric-400 font-bold">WASHING</span>
              </span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed font-medium">
              &quot;Your Car. Your Bike. Our Shine.&quot;
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Premium automotive detailing studio in Mumbai. State-of-the-art foam cannons, deionized water rinsing, pH neutral cleaning, and ceramic coating protection.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/919876543210?text=Hello%20JK%20Washing%20Center,%20I%20would%20like%20to%20book%20a%20wash"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-xs font-semibold transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Wash &amp; Detailing
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/car-wash" className="hover:text-electric-400 transition">
                  Exterior Snow Foam Car Wash
                </Link>
              </li>
              <li>
                <Link href="/car-wash" className="hover:text-electric-400 transition">
                  Interior Deep Upholstery Shampoo
                </Link>
              </li>
              <li>
                <Link href="/car-wash" className="hover:text-electric-400 transition">
                  Paint Correction &amp; Machine Polish
                </Link>
              </li>
              <li>
                <Link href="/bike-wash" className="hover:text-electric-400 transition">
                  Superbike Foam &amp; Chain Degrease
                </Link>
              </li>
              <li>
                <Link href="/bike-wash" className="hover:text-electric-400 transition">
                  Teflon &amp; Matte Finish Protection
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-electric-400 transition">
                  9H Ceramic Coating Shield
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Customer Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/book" className="hover:text-electric-400 transition">
                  Book a Wash Appointment
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-electric-400 transition">
                  Track Live Wash Status
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-electric-400 transition">
                  Packages &amp; Transparent Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-electric-400 transition">
                  About Our Detailing Studio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-electric-400 transition">
                  Workshop Location &amp; Directions
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-electric-400 transition">
                  Staff &amp; Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Workshop Contact
            </h4>
            <div className="flex items-start gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-electric-400 flex-shrink-0 mt-0.5" />
              <span>Plot 42, Service Road, Near Highway Junction, Mumbai, Maharashtra 400001</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Phone className="w-4 h-4 text-electric-400 flex-shrink-0" />
              <a href="tel:+919876543210" className="hover:text-white font-mono">
                +91 98765 43210 / +91 98765 43211
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Mail className="w-4 h-4 text-electric-400 flex-shrink-0" />
              <a href="mailto:contact@jkwashingcenter.com" className="hover:text-white">
                contact@jkwashingcenter.com
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs pt-1">
              <Clock className="w-4 h-4 text-electric-400 flex-shrink-0" />
              <span>Mon – Sun: 08:00 AM – 08:00 PM</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} JK WASHING CENTER. All rights reserved.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1 text-electric-400">
              <Sparkles className="w-3.5 h-3.5" /> Certified PWA App
            </span>
            <Link href="/admin/dashboard" className="hover:text-zinc-200">
              Business Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
