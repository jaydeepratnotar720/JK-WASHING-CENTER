"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CalendarCheck,
  Car,
  Bike,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Printer,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  getPackages,
  getServices,
  createBooking,
  getBusinessSettings,
} from "@/lib/db";
import { Package, Service, Booking } from "@/types";
import { Suspense } from "react";

function BookContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Form states
  const [vehicleType, setVehicleType] = useState<"car" | "bike">("car");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [bookingDate, setBookingDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>("09:00 AM - 10:00 AM");
  const [notes, setNotes] = useState("");

  // Loading & confirmation
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // Catalog states
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const settings = getBusinessSettings();

  useEffect(() => {
    const pkgs = getPackages(vehicleType, true);
    setPackages(pkgs);

    const srvs = getServices(vehicleType, true);
    setServices(srvs);

    // If search param had package
    const paramPkg = searchParams.get("packageId");
    if (paramPkg) {
      const match = pkgs.find((p) => p.id === paramPkg);
      if (match) {
        setSelectedPackageId(match.id);
        setVehicleType(match.vehicle_type);
      } else if (pkgs.length > 0) {
        setSelectedPackageId(pkgs[0].id);
      }
    } else if (pkgs.length > 0) {
      setSelectedPackageId(pkgs[0].id);
    }
  }, [vehicleType, searchParams]);

  const toggleAddon = (sId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(sId) ? prev.filter((id) => id !== sId) : [...prev, sId]
    );
  };

  // Pricing calculations
  const selectedPkg = packages.find((p) => p.id === selectedPackageId);
  const packagePrice = selectedPkg ? selectedPkg.price : 0;

  const addonsTotal = selectedAddons.reduce((sum, sId) => {
    const s = services.find((item) => item.id === sId);
    return sum + (s ? s.price : 0);
  }, 0);

  const subtotal = packagePrice + addonsTotal;
  const taxAmount = (subtotal * settings.tax_percentage) / 100;
  const finalTotal = Math.round((subtotal + taxAmount) * 100) / 100;

  const timeSlots = [
    "08:30 AM - 09:30 AM",
    "09:30 AM - 10:30 AM",
    "10:30 AM - 11:30 AM",
    "11:30 AM - 12:30 PM",
    "01:30 PM - 02:30 PM",
    "02:30 PM - 03:30 PM",
    "03:30 PM - 04:30 PM",
    "04:30 PM - 05:30 PM",
    "05:30 PM - 06:30 PM",
    "06:30 PM - 07:30 PM",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim() || !phone.trim() || !regNumber.trim() || !model.trim()) {
      setErrorMessage("Please complete all required fields (Name, Phone, Registration, Model).");
      return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSubmitting(true);

    try {
      const created = createBooking({
        customer: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
        },
        vehicle: {
          vehicle_type: vehicleType,
          reg_number: regNumber.trim().toUpperCase(),
          brand: brand.trim() || (vehicleType === "car" ? "Car" : "Bike"),
          model: model.trim(),
          special_instructions: notes.trim(),
        },
        package_id: selectedPackageId || undefined,
        additional_services: selectedAddons,
        booking_date: bookingDate,
        time_slot: timeSlot,
        notes: notes.trim(),
      });

      setConfirmedBooking(created);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage("Failed to record booking. Please verify details and retry.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyBookingRef = () => {
    if (confirmedBooking) {
      navigator.clipboard.writeText(confirmedBooking.booking_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-bold uppercase">
            <CalendarCheck className="w-3.5 h-3.5" /> Fast Online Scheduling
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Book Your Detailing Appointment
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Select your vehicle, pick a time slot, and our technicians will have your bay ready.
          </p>
        </div>

        {/* If Booking Confirmed */}
        {confirmedBooking ? (
          <div className="bg-zinc-900/90 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white">Booking Confirmed!</h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Your wash appointment has been successfully scheduled. Please show your booking reference when you drive in.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="bg-[#0c121e] border border-zinc-800 rounded-2xl p-5 text-center max-w-md mx-auto space-y-2">
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                Booking Reference Number
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-black font-mono text-electric-400">
                  {confirmedBooking.booking_number}
                </span>
                <button
                  onClick={copyBookingRef}
                  className="p-1.5 text-zinc-400 hover:text-white transition"
                  title="Copy reference number"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <p className="text-[11px] text-emerald-400 font-medium">Copied to clipboard!</p>}
            </div>

            {/* Details Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-xs bg-zinc-800/40 border border-zinc-800 rounded-2xl p-5">
              <div>
                <span className="text-zinc-500">Customer Name:</span>
                <p className="font-bold text-white text-sm">{fullName}</p>
              </div>
              <div>
                <span className="text-zinc-500">Phone:</span>
                <p className="font-bold text-white text-sm">{phone}</p>
              </div>
              <div>
                <span className="text-zinc-500">Vehicle:</span>
                <p className="font-bold text-white text-sm">
                  {regNumber.toUpperCase()} ({brand} {model})
                </p>
              </div>
              <div>
                <span className="text-zinc-500">Appointment Slot:</span>
                <p className="font-bold text-electric-400 text-sm">
                  {bookingDate} • {timeSlot}
                </p>
              </div>
              <div>
                <span className="text-zinc-500">Package:</span>
                <p className="font-bold text-white">{selectedPkg?.name || "Custom Wash"}</p>
              </div>
              <div>
                <span className="text-zinc-500">Estimated Total (incl. GST):</span>
                <p className="font-black text-emerald-400 text-base">{formatCurrency(finalTotal)}</p>
              </div>
            </div>

            {/* Next Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => router.push(`/track?ref=${confirmedBooking.booking_number}`)}
                className="w-full sm:w-auto px-6 py-3.5 bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-electric-600/30 transition flex items-center justify-center gap-2"
              >
                <span>Track Live Wash Status</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Booking Slip</span>
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            {errorMessage && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Details */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Vehicle Type Toggle */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    1. Select Vehicle Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setVehicleType("car")}
                      className={`p-4 rounded-2xl border flex items-center justify-center gap-3 font-bold text-sm transition ${
                        vehicleType === "car"
                          ? "bg-electric-600/20 border-electric-500 text-electric-400 shadow-inner"
                          : "bg-zinc-800/40 border-zinc-700/60 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Car className="w-5 h-5" />
                      <span>Four Wheeler (Car)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVehicleType("bike")}
                      className={`p-4 rounded-2xl border flex items-center justify-center gap-3 font-bold text-sm transition ${
                        vehicleType === "bike"
                          ? "bg-electric-600/20 border-electric-500 text-electric-400 shadow-inner"
                          : "bg-zinc-800/40 border-zinc-700/60 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Bike className="w-5 h-5" />
                      <span>Two Wheeler (Bike)</span>
                    </button>
                  </div>
                </div>

                {/* 2. Customer & Vehicle Info */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    2. Owner &amp; Vehicle Registration
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 mb-1.5 block">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Vikram Malhotra"
                        className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-electric-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1.5 block">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9820011223"
                        className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-electric-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1.5 block">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vikram@example.com"
                        className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-electric-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1.5 block">Registration Number *</label>
                      <input
                        type="text"
                        required
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                        placeholder="e.g. MH 02 CZ 4492"
                        className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white uppercase font-mono placeholder-zinc-500 focus:outline-none focus:border-electric-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1.5 block">Brand / Make</label>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="e.g. Hyundai, Honda, KTM"
                        className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-electric-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1.5 block">Model *</label>
                      <input
                        type="text"
                        required
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="e.g. Creta SX / Duke 390"
                        className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-electric-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Package Selection */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    3. Select Detailing Package
                  </label>
                  <div className="space-y-3">
                    {packages.map((pkg) => {
                      const isSelected = selectedPackageId === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackageId(pkg.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                            isSelected
                              ? "bg-electric-500/10 border-electric-500 ring-1 ring-electric-500/40"
                              : "bg-zinc-800/30 border-zinc-700/60 hover:border-zinc-600"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{pkg.name}</span>
                              {pkg.is_popular && (
                                <span className="bg-electric-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                              {pkg.description}
                            </p>
                            <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                              Duration: ~{pkg.estimated_duration_mins} mins
                            </span>
                          </div>
                          <div className="text-right flex-shrink-0 ml-4">
                            <div className="text-base font-black text-white">
                              {formatCurrency(pkg.price)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Add-on Services */}
                {services.length > 0 && (
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                      4. Optional Add-ons &amp; Custom Care
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {services.map((svc) => {
                        const isChecked = selectedAddons.includes(svc.id);
                        return (
                          <div
                            key={svc.id}
                            onClick={() => toggleAddon(svc.id)}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                              isChecked
                                ? "bg-electric-500/10 border-electric-500"
                                : "bg-zinc-800/30 border-zinc-700/60 hover:border-zinc-600"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="mt-0.5 accent-electric-600 rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-semibold text-white truncate">{svc.name}</h5>
                              <p className="text-[11px] text-zinc-400 line-clamp-1">{svc.description}</p>
                              <span className="text-xs font-bold text-electric-400 mt-1 block">
                                +{formatCurrency(svc.price)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Date, Slot & Pricing Summary */}
              <div className="lg:col-span-5 space-y-6">
                {/* 5. Date & Time Slot */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    5. Select Appointment Slot
                  </label>

                  <div>
                    <label className="text-xs text-zinc-400 mb-1.5 block">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 mb-1.5 block">Time Slot *</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
                    >
                      {timeSlots.map((ts) => (
                        <option key={ts} value={ts} className="bg-zinc-900 text-white">
                          {ts}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 mb-1.5 block">Special Instructions (Optional)</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Focus on alloy wheels, ceramic paint, dog hair..."
                      className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-electric-500"
                    />
                  </div>
                </div>

                {/* 6. Pricing Breakdown Card */}
                <div className="bg-gradient-to-b from-zinc-900 to-[#0c1524] border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Summary Breakdown</span>
                    <span className="text-[10px] text-electric-400 font-mono">Live calculation</span>
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-zinc-300">
                      <span>Package ({selectedPkg?.name || "Selected"})</span>
                      <span className="font-semibold text-white">{formatCurrency(packagePrice)}</span>
                    </div>

                    {selectedAddons.length > 0 && (
                      <div className="flex justify-between text-zinc-300">
                        <span>Add-ons ({selectedAddons.length} items)</span>
                        <span className="font-semibold text-white">{formatCurrency(addonsTotal)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-zinc-400 pt-2 border-t border-zinc-800">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-zinc-400">
                      <span>GST ({settings.tax_percentage}%)</span>
                      <span>{formatCurrency(taxAmount)}</span>
                    </div>

                    <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-700">
                      <span>Total Amount Payable</span>
                      <span className="text-electric-400 text-base">{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed pt-2">
                    Payment can be completed online via UPI / QR or in cash upon vehicle drop-off at the center.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-electric-600 hover:bg-electric-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-electric-600/30 transition flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span>Saving Appointment...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Wash Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-zinc-400">
          <div className="w-8 h-8 border-2 border-electric-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading Booking Engine...</p>
        </div>
      }
    >
      <BookContent />
    </Suspense>
  );
}
