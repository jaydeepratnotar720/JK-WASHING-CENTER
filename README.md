# JK WASHING CENTER — Car & Bike Wash Management System
> **"Your Car. Your Bike. Our Shine."**

A complete, production-ready, installable Progressive Web Application (PWA) built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase PostgreSQL**. Designed specifically for modern automobile detailing and washing studios in India and worldwide.

---

## 🌟 Key Highlights & Architecture

### 1. Dual-Core Application Architecture
- **Public Detailing Studio Website**:
  - Hero presentation with detailing shine visuals and real-time bay status counters.
  - Interactive catalogs for **Four Wheelers (Car Wash)** and **Two Wheelers (Bike Wash)**.
  - Transparent packages (Basic Bike Wash ₹99, Premium Bike Wash ₹199, Basic Car Wash ₹299, Premium Car Wash ₹499, Interior Deep Cleaning ₹999, Car Polishing ₹1,499).
  - Individual add-ons (Engine Bay Wash, Underbody Anti-Rust, Windshield Rain Repellent, Helmet UV sanitization).
  - Public booking wizard with automated conflict check, slot reservation, and instant booking slip generation.
  - **Live Wash Tracking (`/track`)**: Customers track their vehicle across the shop floor (*Vehicle Received → Washing In Progress → Ready for Delivery*).
  - WhatsApp chat button & Google Maps directions.

- **Private Business Operations Suite (`/admin`)**:
  - **Live Dashboard**: Today's bookings, wash bay occupancy, today's actual cash/UPI collections, monthly revenue, pending receivables, and net profit estimation.
  - **Booking Lifecycle Management**: Visual status progression (*Pending → Confirmed → Received → In Progress → Ready → Completed*), timestamped audit trail, rescheduling.
  - **Customer & Multi-Vehicle Fleet**: Full customer profiles, multiple cars/bikes per customer, lifetime visit counts, total spending ledger.
  - **Packages & Price Editor**: Create, update base prices, and toggle active packages with guaranteed historical price snapshots in past invoices.
  - **Payments & Collections (POS)**: Multiple payments per booking (Advance, Partial, Full), remaining balance calculation, receipt generation, server-side Razorpay gateway verification.
  - **Invoices & Tax Receipts**: Printable/downloadable GST tax invoices with business branding and vehicle details.
  - **Overhead Expense Tracker**: Track cleaning chemicals, utilities, salaries, maintenance, and compute true net profit.
  - **Reports & Analytics**: Daily/monthly revenue trends, package popularity, payment method breakdown, and 1-click CSV exports.
  - **Studio Settings & RBAC**: Configure business details, GSTIN, slot capacity per hour, and manage Staff vs Admin roles.

### 2. Progressive Web App (PWA) Superpowers
- **Installable**: Full `manifest.ts` configured with 192x192, 512x512 maskable app icons and standalone display mode.
- **Service Worker (`public/sw.js`)**: Caches safe public pages and assets while **strictly excluding sensitive admin routes, customer records, and payment requests** from public cache.
- **Offline Fallback (`/offline`)**: Friendly offline screen with direct workshop phone line when internet disconnects.
- **Online/Offline Status Banner**: Instant network status alerts for front-desk staff.
- **Update Handling**: Automatic new version detection with one-click reload button.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS with Electric Blue Detailing Theme |
| **Icons** | Lucide React |
| **Data & Charts** | Recharts (Revenue Trends & Status Mix) |
| **Database** | Supabase PostgreSQL with Row Level Security (RLS) |
| **Auth** | Supabase Authentication & Role-Based Access Control |
| **Forms** | React Hook Form & Zod Validations |
| **Payment Gateway** | Razorpay (Server-verified HMAC SHA256) |
| **PWA** | Web Manifest, Custom Service Worker, Cache API |

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
cd "c:/mca/JK WASHING CENTER"
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
copy .env.example .env.local
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Fast Role Switcher & Testing
- Visit [http://localhost:3000/login](http://localhost:3000/login) or [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard).
- Use the **Admin Mode / Staff Mode toggle** in the top navigation bar to test role permissions on the fly!
- To test the PWA offline fallback, open Chrome DevTools → **Network** tab → select **Offline** and refresh.

---

## 🔒 Security & Data Integrity Highlights

1. **Revenue Calculation Honesty**: Unpaid booking amounts are **never** treated as collected income. Dashboard collections strictly aggregate recorded payment receipts.
2. **Locked Price Snapshots**: Updating package prices never alters past bookings or customer invoices.
3. **PWA Cache Privacy**: Customer personal data, admin dashboards, and payment APIs are explicitly barred from the service worker cache.
4. **Server-Side Gateway Verification**: Online payments require HMAC SHA256 cryptographic verification before receipts are generated.

---

## 📁 Project Structure

```
├── app/
│   ├── (auth)/login/             # Admin & Staff Login
│   ├── (public)/                 # Public Detailing Website
│   │   ├── page.tsx              # Homepage
│   │   ├── car-wash/             # Car Wash Packages
│   │   ├── bike-wash/            # Bike Wash Packages
│   │   ├── packages/             # Full Catalog & Pricing
│   │   ├── book/                 # Public Booking Form
│   │   ├── track/                # Live Wash Bay Tracking
│   │   ├── about/                # Detailing Philosophy & Studio
│   │   └── contact/              # Location & Inquiries
│   ├── admin/                    # Business Management Suite
│   │   ├── dashboard/            # Live Operations Dashboard
│   │   ├── bookings/             # Booking Lifecycle & Calendar
│   │   ├── customers/            # Customers & Vehicle Fleet
│   │   ├── packages/             # Package & Service Manager
│   │   ├── payments/             # Payments POS & Ledger
│   │   ├── invoices/             # Invoices & Printable Receipts
│   │   ├── expenses/             # Workshop Expenses
│   │   ├── reports/              # Reports & CSV Export
│   │   └── settings/             # Settings & RBAC Roles
│   ├── api/payments/             # Razorpay & Webhook Server Routes
│   ├── offline/                  # PWA Offline Fallback Page
│   ├── layout.tsx                # Root App Layout with PWA Manager
│   └── manifest.ts               # Web App Manifest
├── components/
│   ├── layout/                   # Headers, Footers, Sidebar, Topbar, Mobile Nav
│   └── pwa/                      # PWA Manager, Online/Offline Banners
├── lib/
│   ├── db/                       # Persistent Data Layer, CRUD & Seed Data
│   ├── supabase/                 # Supabase Browser, Server, Admin Clients
│   └── utils.ts                  # Currency & Date Formatters, Status Badges
├── public/
│   ├── icons/                    # PWA Icons (192x192, 512x512, logo.svg)
│   └── sw.js                     # Secure Service Worker
├── supabase/
│   ├── migrations/               # Complete PostgreSQL Schema & RLS
│   └── seed.sql                  # Seed Data for Supabase
└── scripts/
    ├── generate-icons.js         # Programmatic Icon Generator
    └── create-admin.js           # Secure Initial Admin Provisioning
```

---

## 📄 License
JK WASHING CENTER Management System. Built for professional automotive business operations.
