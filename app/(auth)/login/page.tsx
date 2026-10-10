"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { setCurrentUser, AuthUser } from "@/lib/db";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@jkwashingcenter.com");
  const [password, setPassword] = useState("admin123");
  const [role, setRole] = useState<"admin" | "staff">("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (!email.trim() || !password.trim()) {
        setError("Please enter both email and password.");
        setLoading(false);
        return;
      }

      const user: AuthUser = {
        id: role === "admin" ? "staff-admin-01" : "staff-tech-01",
        email: email.trim(),
        full_name: role === "admin" ? "Jagdish Kumar (Owner)" : "Rahul Verma (Senior Detailer)",
        role: role,
      };

      setCurrentUser(user);
      router.push("/admin/dashboard");
    }, 400);
  };

  const setRoleDemo = (selectedRole: "admin" | "staff") => {
    setRole(selectedRole);
    if (selectedRole === "admin") {
      setEmail("admin@jkwashingcenter.com");
      setPassword("admin123");
    } else {
      setEmail("rahul@jkwashingcenter.com");
      setPassword("staff123");
    }
  };

  return (
    <div className="min-h-screen bg-[#070a10] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-electric-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-electric-500 to-electric-800 p-0.5 shadow-lg shadow-electric-500/20">
              <div className="w-full h-full bg-[#0c121e] rounded-[14px] flex items-center justify-center">
                <Image
                  src="/icons/logo.svg"
                  alt="JK Washing Logo"
                  width={34}
                  height={34}
                  className="w-8 h-8"
                />
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white">JK WASHING CENTER</h1>
          <p className="text-xs text-zinc-400">
            Internal Business Portal • Role-Based Authentication
          </p>
        </div>

        {/* Demo Fast Switch Buttons */}
        <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-2">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-center">
            Fast Role Preview
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRoleDemo("admin")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                role === "admin"
                  ? "bg-electric-600 text-white shadow-md shadow-electric-600/30"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login as Admin</span>
            </button>
            <button
              type="button"
              onClick={() => setRoleDemo("staff")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                role === "staff"
                  ? "bg-electric-600 text-white shadow-md shadow-electric-600/30"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-white"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Login as Staff</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 backdrop-blur shadow-2xl">
          {error && (
            <div className="p-3.5 mb-5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Staff Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@jkwashingcenter.com"
                  className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
                />
              </div>
            </div>

            <div className="text-[11px] text-zinc-500 flex items-center justify-between pt-1">
              <span>Selected Role: <strong className="text-electric-400 uppercase">{role}</strong></span>
              <span>Protected by Supabase Auth RLS</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-electric-600/30 transition flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-zinc-400 hover:text-white transition">
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
