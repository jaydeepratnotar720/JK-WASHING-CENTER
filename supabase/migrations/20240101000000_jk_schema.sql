-- JK WASHING CENTER: COMPLETE DATABASE SCHEMA MIGRATION
-- Compatible with Supabase PostgreSQL with Row Level Security (RLS)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'staff');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_type AS ENUM ('car', 'bike');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM (
        'pending',
        'confirmed',
        'vehicle_received',
        'washing_in_progress',
        'ready_for_delivery',
        'completed',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('cash', 'upi', 'bank_transfer', 'card', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_type AS ENUM ('advance', 'partial', 'full');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE expense_category AS ENUM (
        'cleaning_products',
        'water_and_electricity',
        'staff_salaries',
        'equipment_maintenance',
        'rent',
        'marketing',
        'other'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. BUSINESS SETTINGS TABLE
CREATE TABLE IF NOT EXISTS business_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(150) NOT NULL DEFAULT 'JK WASHING CENTER',
    tagline VARCHAR(255) NOT NULL DEFAULT 'Your Car. Your Bike. Our Shine.',
    phone VARCHAR(20) NOT NULL DEFAULT '+91 98765 43210',
    alt_phone VARCHAR(20) DEFAULT '+91 98765 43211',
    email VARCHAR(100) NOT NULL DEFAULT 'contact@jkwashingcenter.com',
    address TEXT NOT NULL DEFAULT 'Plot 42, Service Road, Near Highway Junction, Mumbai, Maharashtra 400001',
    gstin VARCHAR(30) DEFAULT '',
    currency_symbol VARCHAR(10) NOT NULL DEFAULT '₹',
    tax_percentage NUMERIC(5,2) NOT NULL DEFAULT 18.00,
    slot_capacity_per_hour INTEGER NOT NULL DEFAULT 4,
    opening_time TIME NOT NULL DEFAULT '08:00:00',
    closing_time TIME NOT NULL DEFAULT '20:00:00',
    slot_interval_minutes INTEGER NOT NULL DEFAULT 60,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PROFILES / STAFF TABLE (references auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role user_role NOT NULL DEFAULT 'staff',
    phone VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(30) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alt_phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    notes TEXT,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_full_name ON customers(full_name);

-- 6. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    vehicle_type vehicle_type NOT NULL,
    reg_number VARCHAR(30) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    category VARCHAR(50), -- 'Hatchback', 'Sedan', 'SUV', 'Superbike', 'Scooter', etc.
    special_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_customer_reg UNIQUE (customer_id, reg_number)
);

CREATE INDEX IF NOT EXISTS idx_vehicles_reg_number ON vehicles(reg_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_customer_id ON vehicles(customer_id);

-- 7. SERVICES TABLE (standalone add-ons & individual services)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    estimated_duration_mins INTEGER NOT NULL DEFAULT 30,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PACKAGES TABLE
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    vehicle_type vehicle_type NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    estimated_duration_mins INTEGER NOT NULL DEFAULT 45,
    included_services TEXT[] DEFAULT ARRAY[]::TEXT[],
    image_url TEXT,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. PACKAGE SERVICES JUNCTION (Optional Normalized Relation)
CREATE TABLE IF NOT EXISTS package_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_package_service UNIQUE (package_id, service_id)
);

-- 10. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    assigned_staff_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    estimated_duration_mins INTEGER NOT NULL DEFAULT 45,
    package_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    services_total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    final_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    advance_payment NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);

-- 11. BOOKING SERVICES TABLE (Price Snapshots)
CREATE TABLE IF NOT EXISTS booking_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    service_name VARCHAR(150) NOT NULL,
    price_at_booking NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    payment_method payment_method NOT NULL DEFAULT 'cash',
    payment_type payment_type NOT NULL DEFAULT 'full',
    transaction_reference VARCHAR(100),
    gateway_order_id VARCHAR(100),
    gateway_payment_id VARCHAR(100),
    is_gateway_verified BOOLEAN NOT NULL DEFAULT false,
    received_by_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- 13. INVOICES TABLE
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    balance_due NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'unpaid', -- 'unpaid', 'partially_paid', 'paid'
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category expense_category NOT NULL DEFAULT 'other',
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    receipt_url TEXT,
    created_by_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- 15. BOOKING STATUS AUDIT TRAIL
CREATE TABLE IF NOT EXISTS booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    from_status booking_status,
    to_status booking_status NOT NULL,
    notes TEXT,
    changed_by_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Business Settings: Anyone can read, only Admin can update
CREATE POLICY "Public can view business settings" ON business_settings FOR SELECT USING (true);
CREATE POLICY "Only admin can update business settings" ON business_settings FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Profiles: Authenticated users can view profiles; only admin can insert/update
CREATE POLICY "Staff can view staff profiles" ON profiles FOR SELECT
    USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage profiles" ON profiles FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Services & Packages: Public can view active services and packages; Staff/Admin can manage
CREATE POLICY "Public can view active packages" ON packages FOR SELECT USING (is_active = true OR auth.uid() IS NOT NULL);
CREATE POLICY "Staff can view all packages" ON packages FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Public can view active services" ON services FOR SELECT USING (is_active = true OR auth.uid() IS NOT NULL);
CREATE POLICY "Staff can view all services" ON services FOR ALL USING (auth.uid() IS NOT NULL);

-- Customers & Vehicles:
-- Public can create new customer & vehicle during public booking
-- Staff and Admin can view and manage all customers and vehicles
CREATE POLICY "Public can insert customer" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert vehicle" ON vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff full access customers" ON customers FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff full access vehicles" ON vehicles FOR ALL USING (auth.uid() IS NOT NULL);

-- Bookings:
-- Public can insert new bookings
-- Staff and Admin have full access
CREATE POLICY "Public can create booking" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff manage bookings" ON bookings FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Public can create booking services" ON booking_services FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff manage booking services" ON booking_services FOR ALL USING (auth.uid() IS NOT NULL);

-- Payments & Invoices:
-- Only authenticated Staff and Admin can access
CREATE POLICY "Staff manage payments" ON payments FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff manage invoices" ON invoices FOR ALL USING (auth.uid() IS NOT NULL);

-- Expenses:
-- Only authenticated Staff can view, Admin can manage
CREATE POLICY "Staff view expenses" ON expenses FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admin manage expenses" ON expenses FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Booking Status History:
CREATE POLICY "Staff view booking history" ON booking_status_history FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Staff insert booking history" ON booking_status_history FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Audit logs:
CREATE POLICY "Staff insert audit log" ON audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin view audit logs" ON audit_logs FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
