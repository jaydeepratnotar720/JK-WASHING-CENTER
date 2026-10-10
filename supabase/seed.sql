-- JK WASHING CENTER: SEED DATA
-- Default Business Profile, Packages, Add-ons, Customers, Vehicles, Bookings, Payments, Expenses

-- 1. Insert default business settings
INSERT INTO business_settings (
    business_name, tagline, phone, alt_phone, email, address, gstin, currency_symbol, tax_percentage, slot_capacity_per_hour
) VALUES (
    'JK WASHING CENTER',
    'Your Car. Your Bike. Our Shine.',
    '+91 98765 43210',
    '+91 98765 43211',
    'contact@jkwashingcenter.com',
    'Plot 42, Service Road, Near Highway Junction, Mumbai, Maharashtra 400001',
    '27AAAAA0000A1Z5',
    '₹',
    18.00,
    4
) ON CONFLICT DO NOTHING;

-- 2. Insert Standard Packages
INSERT INTO packages (name, vehicle_type, description, price, estimated_duration_mins, included_services, is_popular, is_active) VALUES
('Basic Bike Wash', 'bike', 'High-pressure foam wash, wheel cleaning, air blower dry, and chain lubrication.', 99.00, 30, ARRAY['High Pressure Foam Wash', 'Wheel Cleaning', 'Blower Dry', 'Chain Clean & Lube'], false, true),
('Premium Bike Wash', 'bike', 'Complete foam wash, chain degrease & lube, matte/gloss paint polish, and tyre dressing.', 199.00, 45, ARRAY['High Pressure Foam Wash', 'Deep Wheel & Rim Scrub', 'Chain Degrease & Lube', 'Teflon Polish', 'Tyre & Trim Dressing'], true, true),
('Basic Car Wash', 'car', 'Exterior high-pressure foam wash, rim cleaning, glass streak-free cleaning, and vacuuming.', 299.00, 45, ARRAY['Exterior Pressure Wash', 'Active Foam Bath', 'Wheel Rim Cleaning', 'Basic Cabin Vacuum', 'Glass Clean'], false, true),
('Premium Car Wash', 'car', 'Complete exterior snow foam, interior deep vacuuming, dashboard polish, tyre shine & fragrance.', 499.00, 60, ARRAY['Exterior Snow Foam', 'Underbody Wash', 'Interior Vacuuming', 'Dashboard & Trim Polish', 'Tyre Gloss', 'Odor Elimination'], true, true),
('Interior Deep Cleaning', 'car', 'Complete interior fabric/leather shampooing, steam sterilization, AC duct sanitization & stain removal.', 999.00, 90, ARRAY['Upholstery Shampoo', 'Steam Sterilization', 'AC Duct Sanitization', 'Roof & Floor Deep Scrub', 'Leather Care'], false, true),
('Car Polishing & Waxing', 'car', 'Machine buffing, swirl remover compound, high gloss carnauba wax, and paint sealant protection.', 1499.00, 120, ARRAY['Swirl & Scratch Reduction', 'Machine Dual-Action Buffing', 'Carnauba Wax Sealant', 'Chrome & Headlight Brightening'], false, true),
('Ceramic Coating Shield', 'car', '3-year 9H Ceramic coating protection with hydrophobic water beading and mirror reflection gloss.', 4999.00, 240, ARRAY['Multi-Stage Paint Correction', 'Decontamination Clay Bar', '9H Ceramic Shield Layer', 'Hydrophobic Glass Coat'], false, true);

-- 3. Standalone Services & Add-ons
INSERT INTO services (name, vehicle_type, description, price, estimated_duration_mins, is_active) VALUES
('Engine Bay Detail Wash', 'car', 'Safe degreasing and protective dressing of the engine bay.', 249.00, 25, true),
('Underbody Anti-Rust Wash', 'car', 'High-pressure chassis wash removing mud, salt, and grime.', 199.00, 20, true),
('Windshield Rain Repellent Coat', 'car', 'Hydrophobic rain repellent treatment for crystal clear vision.', 149.00, 15, true),
('AC Vent Antibacterial Foam', 'car', 'Deep foam cleansing of AC vents to eliminate bacteria and foul odor.', 299.00, 20, true),
('Bike Chain Deep Degrease & Lube', 'bike', 'Heavy-duty degreasing and synthetic lube application.', 79.00, 15, true),
('Helmet Sanitization & Visor Polish', 'bike', 'UV bactericidal sterilization and anti-fog visor wipe.', 49.00, 10, true);
