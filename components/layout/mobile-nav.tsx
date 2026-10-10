"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  CreditCard,
  PlusCircle,
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
    { href: "/book", label: "New Wash", icon: PlusCircle, isHighlight: true },
    { href: "/admin/payments", label: "Collections", icon: CreditCard },
    { href: "/admin/customers", label: "Customers", icon: Users },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080c14]/95 backdrop-blur-md border-t border-zinc-800 px-2 py-2 flex items-center justify-around">
      {items.map((item) => {
        const isActive = pathname === item.href;
        if (item.isHighlight) {
          return (
            <Link
              key={item.href}
              href={item.href}
              target="_blank"
              className="flex flex-col items-center justify-center text-electric-400 group -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-electric-600 text-white flex items-center justify-center shadow-lg shadow-electric-600/40 border-2 border-[#080c14] group-active:scale-95 transition">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-white mt-1">Book</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-3 py-1 text-[10px] font-semibold transition ${
              isActive ? "text-electric-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <item.icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-electric-400" : "text-zinc-500"}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
