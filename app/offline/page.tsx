"use client";

import React from "react";
import Link from "next/link";
import { WifiOff, RefreshCw, Home, PhoneCall } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 backdrop-blur shadow-2xl">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-amber-400 mb-6 shadow-inner">
          <WifiOff className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-black text-white mb-2">You are currently Offline</h1>
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          JK Washing Center requires an active internet connection to submit new bookings and view real-time bay statuses.
        </p>

        <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl p-4 text-left text-xs text-zinc-300 space-y-2 mb-8">
          <p className="font-semibold text-electric-400 flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4" /> Direct Workshop Hotline:
          </p>
          <p className="text-zinc-200 font-mono text-sm font-bold">+91 98765 43210</p>
          <p className="text-zinc-400">
            For urgent vehicle wash slots, feel free to give our front desk a direct phone call.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              if (typeof window !== "undefined") window.location.reload();
            }}
            className="flex-1 py-3 px-4 bg-electric-600 hover:bg-electric-500 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-electric-600/30"
          >
            <RefreshCw className="w-4 h-4" /> Try Reconnecting
          </button>
          <Link
            href="/"
            className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 text-zinc-200 transition"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
