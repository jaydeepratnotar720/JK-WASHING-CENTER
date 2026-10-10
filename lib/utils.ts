import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { BookingStatus, PaymentMethod } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, symbol: string = "₹"): string {
  if (isNaN(amount)) return `${symbol}0`;
  return `${symbol}${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}`;
}

export function formatDate(dateStr: string | Date | undefined, formatPattern = "dd MMM yyyy"): string {
  if (!dateStr) return "-";
  try {
    const d = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
    return format(d, formatPattern);
  } catch {
    return String(dateStr);
  }
}

export function formatTime(timeStr: string | undefined): string {
  if (!timeStr) return "-";
  return timeStr;
}

export function getStatusBadge(status: BookingStatus) {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        dot: "bg-amber-400",
      };
    case "confirmed":
      return {
        label: "Confirmed",
        color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        dot: "bg-blue-400",
      };
    case "vehicle_received":
      return {
        label: "Vehicle Received",
        color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        dot: "bg-purple-400",
      };
    case "washing_in_progress":
      return {
        label: "Washing In Progress",
        color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 animate-pulse",
        dot: "bg-cyan-400",
      };
    case "ready_for_delivery":
      return {
        label: "Ready for Delivery",
        color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        dot: "bg-emerald-400",
      };
    case "completed":
      return {
        label: "Completed",
        color: "bg-green-500/10 text-green-400 border-green-500/20",
        dot: "bg-green-500",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        dot: "bg-rose-500",
      };
    default:
      return {
        label: status,
        color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
        dot: "bg-zinc-400",
      };
  }
}

export function getPaymentMethodBadge(method: PaymentMethod) {
  switch (method) {
    case "cash":
      return { label: "Cash", color: "bg-emerald-500/10 text-emerald-400" };
    case "upi":
      return { label: "UPI", color: "bg-blue-500/10 text-blue-400" };
    case "card":
      return { label: "Card", color: "bg-purple-500/10 text-purple-400" };
    case "bank_transfer":
      return { label: "Bank Transfer", color: "bg-indigo-500/10 text-indigo-400" };
    default:
      return { label: "Other", color: "bg-zinc-500/10 text-zinc-400" };
  }
}

export function generateBookingNumber(): string {
  const dateStr = format(new Date(), "yyyyMMdd");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `JK-${dateStr}-${rand}`;
}

export function generateInvoiceNumber(): string {
  const dateStr = format(new Date(), "yyyyMMdd");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${dateStr}-${rand}`;
}
