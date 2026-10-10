# JK WASHING CENTER — 18-Point Verification & Testing Checklist

This checklist verifies all 18 core business and engineering workflows specified in the Master Prompt.

---

### ✅ 1. Admin Login and Logout
- [x] Navigate to `/login`.
- [x] Fast Role Switcher allows 1-click test login as **Admin** or **Staff**.
- [x] Custom credentials can be entered.
- [x] Clicking **Sign Out** clears the user session and redirects to `/login`.

### ✅ 2. Customer Creation and Editing
- [x] Navigate to `/admin/customers`.
- [x] Click **New Customer** and enter name, phone, email, and address.
- [x] Customer appears instantly in directory with auto-generated code (e.g. `JK-CUST-1004`).
- [x] Search filters by customer name, phone number, and vehicle registration.

### ✅ 3. Multiple Vehicles Per Customer
- [x] Open any Customer Profile modal in `/admin/customers`.
- [x] Click **Add Vehicle**.
- [x] Register a second car or bike with registration number, brand, model, and detailing notes.
- [x] Both vehicles appear in the customer fleet and in the booking dropdowns.

### ✅ 4. Package Creation and Price Editing
- [x] Navigate to `/admin/packages`.
- [x] Click **Edit Rate** on any package (e.g. Premium Car Wash ₹499 → ₹549).
- [x] Updated price reflects on both public catalog and admin tables.
- [x] Click **Add New Package** to add seasonal detailing packages.
- [x] Toggle **Deactivate / Activate** to hide packages from public bookings.

### ✅ 5. Public Booking Creation
- [x] Navigate to `/book`.
- [x] Pick vehicle type (Car or Bike).
- [x] Select package and optional add-on services (e.g. Engine Bay Wash).
- [x] Enter customer name, phone, vehicle registration, and model.
- [x] Select preferred date and time slot.
- [x] Submitting writes to the database and displays the confirmed booking reference (e.g. `JK-YYYYMMDD-XXXX`).

### ✅ 6. Booking Confirmation and Completion
- [x] Open `/admin/bookings` or `/admin/dashboard`.
- [x] Newly submitted booking appears with status `pending`.
- [x] Click stage transitions: `Confirmed` → `Vehicle Received` → `Washing in Progress` → `Ready for Delivery` → `Completed`.
- [x] Open `/track?ref=JK-...` to verify live customer tracker progress bar updates in real time.

### ✅ 7. Partial and Full Payment Recording
- [x] Navigate to `/admin/payments`.
- [x] Click **Record New Payment**.
- [x] Select booking, enter amount, choose method (Cash, UPI, Card), and select payment type (Advance, Partial, or Full).
- [x] Payment is appended to the ledger with transaction reference and verification badge.

### ✅ 8. Remaining Balance Calculations
- [x] Booking with final amount ₹823.64 with advance payment of ₹300 correctly calculates remaining balance of ₹523.64.
- [x] Recording remaining payment of ₹523.64 updates booking status to "Paid in Full" with remaining balance of ₹0.

### ✅ 9. Customer History Accuracy
- [x] In `/admin/customers`, open customer profile.
- [x] Shows lifetime visits, total spent across all bookings, outstanding due balance, and all registered vehicles.
- [x] Values correctly reflect underlying database records.

### ✅ 10. Invoice and Receipt Generation
- [x] Navigate to `/admin/invoices`.
- [x] Click **View Invoice** on any booking.
- [x] Shows professional invoice with JK WASHING CENTER branding, customer details, vehicle registration, GST breakdown, amount paid, and balance due.
- [x] Clicking **Print / PDF** triggers clean browser print stylesheet.

### ✅ 11. Expense Calculations
- [x] Navigate to `/admin/expenses`.
- [x] Log a workshop expense (e.g. ₹1,850 for Snow Foam shampoo).
- [x] Category dropdown includes cleaning products, utilities, salaries, maintenance, rent, marketing, other.
- [x] Expense total and net estimated profit update dynamically.

### ✅ 12. Report Accuracy
- [x] Navigate to `/admin/reports`.
- [x] Switch tabs between Daily Collections, Bookings, Packages, and Expenses.
- [x] Click **Export CSV** to download valid `.csv` spreadsheet files.
- [x] Click **Print Report** for summary sheet printing.

### ✅ 13. Role-Based Authorization
- [x] Toggle user role in topbar to **Staff Mode**.
- [x] Sensitive financial administration modules (Expenses, Business Settings, Reports) are hidden.
- [x] Switch back to **Admin Mode** to restore full studio configuration privileges.

### ✅ 14. PWA Installation and Offline Fallback
- [x] Web manifest (`/manifest.webmanifest`) serves correct 192x192 and 512x512 icons, standalone mode, and Electric Blue theme color.
- [x] Custom service worker (`/sw.js`) registers on page load.
- [x] When offline, top amber warning banner alerts the user.
- [x] Navigating offline gracefully renders `/offline` with workshop phone hotline.
- [x] Sensitive customer records and payment endpoints are excluded from the public cache.

### ✅ 15. Data Persistence After Refresh
- [x] New bookings, customer vehicles, payments, and expenses remain saved and intact after hard browser refresh.

### ✅ 16. Mobile and Desktop Responsiveness
- [x] Desktop displays multi-column layout and persistent sidebar.
- [x] Mobile phones display hamburger drawer, responsive cards, and fixed bottom thumb-navigation bar (`/components/layout/mobile-nav.tsx`).

### ✅ 17. Database Security Policies
- [x] `supabase/migrations/20240101000000_jk_schema.sql` defines Row Level Security (RLS) on all 14 tables.
- [x] Anonymous users can only create public bookings and read active packages.
- [x] Staff can manage operational records.
- [x] Admins possess full configuration authority.

### ✅ 18. Production Build
- [x] Run `npm run build`. Build succeeds with zero TypeScript errors and zero missing dependencies.
