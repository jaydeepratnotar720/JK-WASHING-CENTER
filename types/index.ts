export type UserRole = 'admin' | 'staff';

export type VehicleType = 'car' | 'bike';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'vehicle_received'
  | 'washing_in_progress'
  | 'ready_for_delivery'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'card' | 'other';

export type PaymentType = 'advance' | 'partial' | 'full';

export type ExpenseCategory =
  | 'cleaning_products'
  | 'water_and_electricity'
  | 'staff_salaries'
  | 'equipment_maintenance'
  | 'rent'
  | 'marketing'
  | 'other';

export interface BusinessSettings {
  id: string;
  business_name: string;
  tagline: string;
  phone: string;
  alt_phone?: string;
  email: string;
  address: string;
  gstin?: string;
  currency_symbol: string;
  tax_percentage: number;
  slot_capacity_per_hour: number;
  opening_time: string;
  closing_time: string;
  slot_interval_minutes: number;
  created_at?: string;
  updated_at?: string;
}

export interface StaffProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  is_active: boolean;
  created_at?: string;
}

export interface Customer {
  id: string;
  customer_code?: string;
  full_name: string;
  phone: string;
  alt_phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  is_archived?: boolean;
  created_at: string;
  updated_at?: string;
  vehicles?: Vehicle[];
  total_spent?: number;
  visits_count?: number;
  outstanding_balance?: number;
}

export interface Vehicle {
  id: string;
  customer_id: string;
  vehicle_type: VehicleType;
  reg_number: string;
  brand: string;
  model: string;
  color?: string;
  category?: string;
  special_instructions?: string;
  created_at: string;
  customer?: Customer;
}

export interface Service {
  id: string;
  name: string;
  vehicle_type: VehicleType | 'both';
  description?: string;
  price: number;
  estimated_duration_mins: number;
  is_active: boolean;
  created_at?: string;
}

export interface Package {
  id: string;
  name: string;
  vehicle_type: VehicleType;
  description: string;
  price: number;
  estimated_duration_mins: number;
  included_services: string[];
  image_url?: string;
  is_popular?: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface BookingServiceItem {
  id: string;
  booking_id: string;
  service_id?: string;
  service_name: string;
  price_at_booking: number;
}

export interface Booking {
  id: string;
  booking_number: string;
  customer_id: string;
  vehicle_id: string;
  package_id?: string;
  booking_date: string; // YYYY-MM-DD
  time_slot: string; // e.g. "09:00 AM - 10:00 AM"
  assigned_staff_id?: string;
  status: BookingStatus;
  estimated_duration_mins: number;
  package_price: number;
  services_total: number;
  discount: number;
  tax_amount: number;
  final_amount: number;
  advance_payment: number;
  notes?: string;
  created_at: string;
  updated_at?: string;

  // Joined fields
  customer?: Customer;
  vehicle?: Vehicle;
  package?: Package;
  assigned_staff?: StaffProfile;
  booking_services?: BookingServiceItem[];
  payments?: Payment[];
  amount_paid?: number;
  remaining_balance?: number;
}

export interface Payment {
  id: string;
  booking_id: string;
  customer_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_type: PaymentType;
  transaction_reference?: string;
  gateway_order_id?: string;
  gateway_payment_id?: string;
  is_gateway_verified: boolean;
  received_by_id?: string;
  notes?: string;
  created_at: string;

  // Joined
  booking?: Booking;
  customer?: Customer;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  booking_id: string;
  customer_id: string;
  subtotal: number;
  discount: number;
  tax_rate: number;
  tax_amount: number;
  grand_total: number;
  amount_paid: number;
  balance_due: number;
  status: 'unpaid' | 'partially_paid' | 'paid';
  issued_at: string;
  created_at: string;

  booking?: Booking;
  customer?: Customer;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  expense_date: string; // YYYY-MM-DD
  description: string;
  receipt_url?: string;
  created_by_id?: string;
  created_at: string;
}

export interface BookingStatusHistory {
  id: string;
  booking_id: string;
  from_status?: BookingStatus;
  to_status: BookingStatus;
  notes?: string;
  changed_by_id?: string;
  created_at: string;
}

export interface DashboardStats {
  today_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  washing_in_progress: number;
  completed_services: number;
  today_collection: number;
  monthly_collection: number;
  outstanding_balance: number;
  total_customers: number;
  total_expenses: number;
  estimated_profit: number;
}
