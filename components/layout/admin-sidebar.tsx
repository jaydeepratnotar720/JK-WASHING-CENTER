"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Package,
  CreditCard,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  ShieldCheck,
  UserCheck,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { getCurrentUser, setCurrentUser } from "@/lib/db";
import { useRouter } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  const navItems = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, adminOnly: false },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarDays, adminOnly: false },
    { href: "/admin/customers", label: "Customers & Cars", icon: Users, adminOnly: false },
    { href: "/admin/packages", label: "Packages & Prices", icon: Package, adminOnly: false },
    { href: "/admin/payments", label: "Payments & POS", icon: CreditCard, adminOnly: false },
    { href: "/admin/invoices", label: "Invoices & Receipts", icon: FileText, adminOnly: false },
    { href: "/admin/expenses", label: "Expenses", icon: DollarSign, adminOnly: true },
    { href: "/admin/reports", label: "Reports & Analytics", icon: BarChart3, adminOnly: true },
    { href: "/admin/settings", label: "Business Settings", icon: Settings, adminOnly: true },
  ];

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/login");
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#080c14] border-r border-zinc-800/80 p-4 min-h-screen">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 py-4 mb-4 border-b border-zinc-800/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-500 to-electric-800 p-0.5">
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
        <div className="min-w-0">
          <h2 className="text-sm font-black text-white truncate">JK WASHING</h2>
          <p className="text-[10px] text-electric-400 font-semibold tracking-wider uppercase">
            Management Suite
          </p>
        </div>
      </div>

      {/* User Role Card */}
      <div className="p-3 mb-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-electric-600/20 text-electric-400 flex items-center justify-center flex-shrink-0 font-bold text-xs">
            {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{currentUser?.full_name || "Staff Member"}</p>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-electric-500/10 text-electric-400 border border-electric-500/20">
              {currentUser?.role || "Staff"}
            </span>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? "bg-electric-600 text-white shadow-lg shadow-electric-600/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer controls */}
      <div className="pt-4 mt-auto border-t border-zinc-800/80 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
