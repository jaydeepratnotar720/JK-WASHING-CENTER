# JK WASHING CENTER — Complete Deployment & Production Guide

This guide provides beginner-friendly, step-by-step instructions to take **JK WASHING CENTER** from local development to a live, secure production deployment on Vercel with a Supabase PostgreSQL database.

---

## 1. Prerequisites & Node.js Setup

### Step 1.1: Install Node.js
1. Download **Node.js (v18.x or v20+ LTS)** from [nodejs.org](https://nodejs.org).
2. Verify installation in your terminal:
   ```bash
   node -v
   npm -v
   ```

### Step 1.2: Install Dependencies
Open terminal inside the project directory and install all required packages:
```bash
cd "c:/mca/JK WASHING CENTER"
npm install
```

---

## 2. Supabase Database & Auth Setup

### Step 2.1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** and choose a database password.
3. Select your region (e.g. `ap-south-1` for Mumbai / India).

### Step 2.2: Apply the Database Migration
1. In your Supabase dashboard, click **SQL Editor** on the left menu.
2. Click **New Query**.
3. Open `supabase/migrations/20240101000000_jk_schema.sql` from your project folder, copy all contents, paste into the query window, and click **Run**.
4. This creates all tables:
   - `profiles`
   - `business_settings`
   - `customers`
   - `vehicles`
   - `services`
   - `packages`
   - `bookings`
   - `booking_services`
   - `payments`
   - `invoices`
   - `expenses`
   - `booking_status_history`
   - `audit_logs`
   - Along with Row Level Security (RLS) policies.

### Step 2.3: Load Initial Seed Data
1. In the Supabase SQL Editor, open a new query.
2. Copy contents of `supabase/seed.sql` and click **Run**.
3. This seeds standard packages, add-ons, and studio settings.

### Step 2.4: Copy Your API Keys
In Supabase dashboard, go to **Project Settings** → **API**:
- Copy **Project URL**
- Copy **anon / public key**
- Copy **service_role key** (Server-only secret)

---

## 3. Configure Local Environment & Provision Admin

### Step 3.1: Configure `.env.local`
Create `.env.local` in your project root with your Supabase values:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3.2: Securely Provision First Admin Account
Run the admin provision script:
```bash
node scripts/create-admin.js admin@jkwashingcenter.com YourSecurePassword123!
```
*Note: This creates the administrator in `auth.users` and sets their role to `admin` in `profiles` without exposing any hardcoded credentials in the repository.*

---

## 4. Test Production Build Locally

Run the production build command to verify that all TypeScript types, page routes, and bundles compile cleanly:
```bash
npm run build
npm run start
```
Visit `http://localhost:3000` to verify:
- Homepage, Car Wash, Bike Wash, Packages, Booking Wizard, Live Tracking
- Admin Login (`/login`) and Dashboard (`/admin/dashboard`)

---

## 5. Deploying to Vercel

### Step 5.1: Push to GitHub
1. Initialize a git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial production release of JK Washing Center PWA"
   ```
2. Create a new repository on [github.com](https://github.com) named `jk-washing-center`.
3. Link and push:
   ```bash
   git remote add origin https://github.com/your-username/jk-washing-center.git
   git branch -M main
   git push -u origin main
   ```

### Step 5.2: Import to Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New...** → **Project**.
3. Select your GitHub repository `jk-washing-center` and click **Import**.

### Step 5.3: Set Environment Variables in Vercel
Under **Environment Variables**, enter the following keys:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (Encrypted server-only)
- `NEXT_PUBLIC_APP_URL`: Your Vercel production domain (e.g. `https://jk-washing-center.vercel.app`)
- `RAZORPAY_KEY_ID`: *(Optional)* Your Razorpay Key ID
- `RAZORPAY_KEY_SECRET`: *(Optional)* Your Razorpay Secret Key
- `RAZORPAY_WEBHOOK_SECRET`: *(Optional)* Your Razorpay Webhook Secret

Click **Deploy**!

---

## 6. Custom Domain & HTTPS Setup (Required for PWA)

PWAs strictly require **HTTPS** (or `localhost`) to register service workers and trigger install banners:
1. In Vercel Project Dashboard, go to **Settings** → **Domains**.
2. Add your custom domain (e.g. `jkwashingcenter.com`).
3. Follow the DNS instructions to add the `CNAME` or `A` records at your registrar (GoDaddy, Namecheap, Cloudflare, etc.).
4. Vercel automatically issues a free, auto-renewing SSL certificate.

---

## 7. Testing PWA Installation

### On Android (Chrome):
1. Open your production URL (`https://your-domain.com`).
2. An **"Install JK Washing App"** banner will appear at the bottom.
3. Tap **Install** or open the 3-dots menu (⋮) → **Add to Home screen**.
4. The app icon appears on your home screen and launches full-screen in standalone mode!

### On Desktop (Chrome / Edge):
1. Notice the **Install** icon on the right side of the URL address bar.
2. Click **Install JK Washing Center** to launch as a standalone desktop application window.

---

## 8. Razorpay Payment Gateway (Optional)

1. Sign up at [razorpay.com](https://razorpay.com).
2. Go to **Settings** → **API Keys** → Generate **Key Id** and **Key Secret**.
3. Add these to Vercel Environment Variables:
   - `RAZORPAY_KEY_ID=rzp_live_...`
   - `RAZORPAY_KEY_SECRET=...`
4. Set up the webhook:
   - Webhook URL: `https://your-domain.com/api/payments/webhook`
   - Active events: `payment.captured`
   - Set `RAZORPAY_WEBHOOK_SECRET` in Vercel environment variables.

---

## 9. Database Backup Strategy

1. In Supabase Dashboard, navigate to **Database** → **Backups**.
2. Supabase automatically generates daily backups for projects on Pro plans.
3. To manually export a SQL dump from your terminal anytime:
   ```bash
   # Install Supabase CLI or pg_dump
   pg_dump "postgres://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres" > jk_washing_backup.sql
   ```
