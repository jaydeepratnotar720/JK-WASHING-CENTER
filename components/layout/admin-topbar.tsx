"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  X,
  PlusCircle,
  ShieldCheck,
  UserCheck,
  Bell,
  Search,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { getCurrentUser, setCurrentUser } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export function AdminTopbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  const toggleRole = () => {
    const nextRole = isAdmin ? "staff" : "admin";
    setCurrentUser({
      id: nextRole === "admin" ? "staff-admin-01" : "staff-tech-01",
      email: nextRole === "admin" ? "admin@jkwashingcenter.com" : "rahul@jkwashingcenter.com",
      full_name: nextRole === "admin" ? "Jagdish Kumar (Owner)" : "Rahul Verma (Senior Detailer)",
      role: nextRole,
    });
    router.refresh();
  };

  const getPageTitle = () => {
    if (pathname.includes("/admin/dashboard")) return "Operations Overview";
    if (pathname.includes("/admin/bookings")) return "Wash Bookings & Slots";
    if (pathname.includes("/admin/customers")) return "Customer Profiles & Fleet";
    if (pathname.includes("/admin/packages")) return "Services & Packages";
    if (pathname.includes("/admin/payments")) return "Payments & Cash Collections";
    if (pathname.includes("/admin/invoices")) return "Tax Invoices & Receipts";
    if (pathname.includes("/admin/expenses")) return "Workshop Expenses";
    if (pathname.includes("/admin/reports")) return "Business Reports & Analytics";
    if (pathname.includes("/admin/settings")) return "Studio Configuration";
    return "Management Suite";
  };

  return (
    <header className="sticky top-0 z-30 bg-[#080c14]/95 backdrop-blur border-b border-zinc-800/80 px-4 sm:px-6 h-16 flex items-center justify-between">
      {/* Left Title & Date */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm sm:text-base font-bold text-white truncate">
            {getPageTitle()}
          </h1>
          <p className="text-[10px] text-zinc-400 hidden sm:block">
            {formatDate(new Date(), "EEEE, dd MMMM yyyy")}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Toggle Switch for Testing */}
        <button
          onClick={toggleRole}
          className="px-2.5 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-600 bg-zinc-800/60 text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5 transition"
          title="Click to toggle between Admin and Staff permissions"
        >
          {isAdmin ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-electric-400" />
              <span>Admin Mode</span>
            </>
          ) : (
            <>
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Staff Mode</span>
            </>
          )}
        </button>

        {/* Quick New Booking Button */}
        <Link
          href="/book"
          target="_blank"
          className="px-3 py-1.5 bg-electric-600 hover:bg-electric-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-electric-600/20"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Booking</span>
        </Link>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 lg:hidden flex">
          <div className="w-64 bg-[#080c14] border-r border-zinc-800 h-full p-4 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
                <span className="font-bold text-white text-sm">Navigation Menu</span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold rounded-lg text-zinc-300 hover:bg-zinc-800"
                >
                  Overview Dashboard
                </Link>
                <Link
                  href="/admin/bookings"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold rounded-lg text-zinc-300 hover:bg-zinc-800"
                >
                  Bookings &amp; Bay Status
                </Link>
                <Link
                  href="/admin/customers"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold rounded-lg text-zinc-300 hover:bg-zinc-800"
                >
                  Customers &amp; Vehicles
                </Link>
                <Link
                  href="/admin/packages"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold rounded-lg text-zinc-300 hover:bg-zinc-800"
                >
                  Packages &amp; Services
                </Link>
                <Link
                  href="/admin/payments"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold rounded-lg text-zinc-300 hover:bg-zinc-800"
                >
                  Payments &amp; Collections
                </Link>
                <Link
                  href="/admin/invoices"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block px-3 py-2 text-xs font-semibold rounded-lg text-zinc-300 hover:bg-zinc-800"
                >
                  Invoices &amp; Receipts
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      href="/admin/expenses"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block px-3 py-2 text-xs font-semibold rounded-lg text-zinc-300 hover:bg-zinc-800"
                    >
                      Workshop Expenses
                    </Link>
                    <Link
                      href="/admin/reports"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block px-3 py-2 text-xs font-semibold rounded-lg text-zinc-300 hover:bg-zinc-800"
                    >
                      Reports &amp; Analytics
                    </Link>
                    <Link
                      href="/admin/settings"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block px-3 py-2 text-xs font-semibold rounded-lg text-zinc-300 hover:bg-zinc-800"
                    >
                      Business Settings
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <Link
                href="/"
                className="block text-xs text-zinc-400 hover:text-white py-2"
                onClick={() => setMobileDrawerOpen(false)}
              >
                Public Website
              </Link>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  router.push("/login");
                }}
                className="text-xs text-rose-400 hover:text-rose-300 py-2 block w-full text-left"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
