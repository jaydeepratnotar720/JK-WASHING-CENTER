"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black text-white">
            Get In Touch With Us
          </h1>
          <p className="text-sm text-zinc-400">
            Have questions about specialized paint correction, ceramic coatings, or fleet bookings? We&apos;re here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Workshop Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 space-y-6">
              <h2 className="text-xl font-bold text-white">Studio Information</h2>

              <div className="space-y-4 text-xs text-zinc-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-electric-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Location</span>
                    <p className="text-zinc-400 leading-relaxed">
                      Plot 42, Service Road, Near Highway Junction, Mumbai, Maharashtra 400001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-electric-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Hotline Numbers</span>
                    <a href="tel:+919876543210" className="text-zinc-300 font-mono hover:text-white block">
                      +91 98765 43210
                    </a>
                    <a href="tel:+919876543211" className="text-zinc-300 font-mono hover:text-white block">
                      +91 98765 43211
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-electric-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Email Inquiries</span>
                    <a href="mailto:contact@jkwashingcenter.com" className="text-zinc-400 hover:text-white">
                      contact@jkwashingcenter.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-electric-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Working Hours</span>
                    <p className="text-zinc-400">Monday to Sunday: 08:00 AM – 08:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <a
                  href="https://wa.me/919876543210?text=Hello%20JK%20Washing%20Center,%20I%20have%20an%20inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Connect on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8">
              <h2 className="text-xl font-bold text-white mb-2">Send Us an Inquiry</h2>
              <p className="text-xs text-zinc-400 mb-6">
                Fill in your details below and our service supervisor will get back to you promptly.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">Inquiry Received</h4>
                  <p className="text-xs text-zinc-300">
                    Thank you, {form.name}! Our team will contact you at {form.phone} shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-400 mb-1.5 block">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Anand Rathi"
                      className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1.5 block">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. 9811223344"
                      className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1.5 block">Your Message / Query *</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your vehicle model and required detailing service..."
                      className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-electric-600/30 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
