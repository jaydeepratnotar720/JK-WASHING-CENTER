import {
  BusinessSettings,
  Customer,
  Vehicle,
  Package,
  Service,
  Booking,
  Payment,
  Expense,
  StaffProfile,
  DashboardStats,
  BookingStatus,
  BookingStatusHistory,
  Invoice,
} from "@/types";
import {
  initialBusinessSettings,
  initialCustomers,
  initialVehicles,
  initialPackages,
  initialServices,
  initialBookings,
  initialPayments,
  initialExpenses,
  initialStaffProfiles,
} from "./seed-data";
import { generateBookingNumber, generateInvoiceNumber } from "../utils";

// LocalStorage Keys for client-side persistence and offline reliability
const STORAGE_KEYS = {
  SETTINGS: "jk_settings",
  STAFF: "jk_staff",
  CUSTOMERS: "jk_customers",
  VEHICLES: "jk_vehicles",
  PACKAGES: "jk_packages",
  SERVICES: "jk_services",
  BOOKINGS: "jk_bookings",
  PAYMENTS: "jk_payments",
  EXPENSES: "jk_expenses",
  STATUS_HISTORY: "jk_status_history",
  INVOICES: "jk_invoices",
  CURRENT_USER: "jk_current_user",
};

// In-memory runtime cache for server-side or non-window environments
let runtimeSettings: BusinessSettings = { ...initialBusinessSettings };
let runtimeStaff: StaffProfile[] = [...initialStaffProfiles];
let runtimeCustomers: Customer[] = [...initialCustomers];
let runtimeVehicles: Vehicle[] = [...initialVehicles];
let runtimePackages: Package[] = [...initialPackages];
let runtimeServices: Service[] = [...initialServices];
let runtimeBookings: Booking[] = [...initialBookings];
let runtimePayments: Payment[] = [...initialPayments];
let runtimeExpenses: Expense[] = [...initialExpenses];
let runtimeStatusHistory: BookingStatusHistory[] = [];
let runtimeInvoices: Invoice[] = [];

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Storage write error", err);
  }
}

// ==================== AUTH / CURRENT USER ====================
export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "staff";
}

export function getCurrentUser(): AuthUser | null {
  if (!isBrowser()) {
    // Return admin for initial SSR hydration
    return {
      id: "staff-admin-01",
      email: "admin@jkwashingcenter.com",
      full_name: "Jagdish Kumar (Owner)",
      role: "admin",
    };
  }
  const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!saved) {
    const defaultUser: AuthUser = {
      id: "staff-admin-01",
      email: "admin@jkwashingcenter.com",
      full_name: "Jagdish Kumar (Owner)",
      role: "admin",
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
    return defaultUser;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: AuthUser | null): void {
  if (!isBrowser()) return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
}

// ==================== BUSINESS SETTINGS ====================
export function getBusinessSettings(): BusinessSettings {
  if (isBrowser()) {
    return getItem(STORAGE_KEYS.SETTINGS, initialBusinessSettings);
  }
  return runtimeSettings;
}

export function updateBusinessSettings(data: Partial<BusinessSettings>): BusinessSettings {
  const current = getBusinessSettings();
  const updated = { ...current, ...data, updated_at: new Date().toISOString() };
  if (isBrowser()) {
    setItem(STORAGE_KEYS.SETTINGS, updated);
  } else {
    runtimeSettings = updated;
  }
  return updated;
}

// ==================== CUSTOMERS ====================
export function getCustomers(searchQuery?: string, includeArchived = false): Customer[] {
  let list = isBrowser()
    ? getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, initialCustomers)
    : runtimeCustomers;

  if (!includeArchived) {
    list = list.filter((c) => !c.is_archived);
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.customer_code && c.customer_code.toLowerCase().includes(q))
    );
  }

  // Populate vehicles and calculate metrics
  const allVehicles = getVehicles();
  const allBookings = getBookings();
  const allPayments = getPayments();

  return list.map((customer) => {
    const custVehicles = allVehicles.filter((v) => v.customer_id === customer.id);
    const custBookings = allBookings.filter((b) => b.customer_id === customer.id);
    const totalSpent = allPayments
      .filter((p) => p.customer_id === customer.id)
      .reduce((sum, p) => sum + p.amount, 0);

    const totalBilled = custBookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + b.final_amount, 0);

    const outstanding = Math.max(0, totalBilled - totalSpent);

    return {
      ...customer,
      vehicles: custVehicles,
      total_spent: totalSpent,
      visits_count: custBookings.filter((b) => b.status === "completed").length,
      outstanding_balance: outstanding,
    };
  });
}

export function getCustomerById(id: string): Customer | undefined {
  const list = getCustomers("", true);
  return list.find((c) => c.id === id);
}

export function createCustomer(data: Omit<Customer, "id" | "created_at">): Customer {
  const list = isBrowser()
    ? getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, initialCustomers)
    : runtimeCustomers;

  const count = list.length + 1001;
  const newCustomer: Customer = {
    ...data,
    id: `cust-${Date.now()}`,
    customer_code: `JK-CUST-${count}`,
    created_at: new Date().toISOString(),
    is_archived: false,
  };

  const updated = [newCustomer, ...list];
  if (isBrowser()) {
    setItem(STORAGE_KEYS.CUSTOMERS, updated);
  } else {
    runtimeCustomers = updated;
  }
  return newCustomer;
}

export function updateCustomer(id: string, data: Partial<Customer>): Customer | undefined {
  const list = isBrowser()
    ? getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, initialCustomers)
    : runtimeCustomers;

  const index = list.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  const updatedCustomer = {
    ...list[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  list[index] = updatedCustomer;
  if (isBrowser()) {
    setItem(STORAGE_KEYS.CUSTOMERS, list);
  } else {
    runtimeCustomers = list;
  }
  return updatedCustomer;
}

// ==================== VEHICLES ====================
export function getVehicles(customerId?: string): Vehicle[] {
  let list = isBrowser()
    ? getItem<Vehicle[]>(STORAGE_KEYS.VEHICLES, initialVehicles)
    : runtimeVehicles;

  if (customerId) {
    list = list.filter((v) => v.customer_id === customerId);
  }
  return list;
}

export function getVehicleById(id: string): Vehicle | undefined {
  const list = getVehicles();
  return list.find((v) => v.id === id);
}

export function createVehicle(data: Omit<Vehicle, "id" | "created_at">): Vehicle {
  const list = isBrowser()
    ? getItem<Vehicle[]>(STORAGE_KEYS.VEHICLES, initialVehicles)
    : runtimeVehicles;

  const newVehicle: Vehicle = {
    ...data,
    id: `veh-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  const updated = [newVehicle, ...list];
  if (isBrowser()) {
    setItem(STORAGE_KEYS.VEHICLES, updated);
  } else {
    runtimeVehicles = updated;
  }
  return newVehicle;
}

export function updateVehicle(id: string, data: Partial<Vehicle>): Vehicle | undefined {
  const list = isBrowser()
    ? getItem<Vehicle[]>(STORAGE_KEYS.VEHICLES, initialVehicles)
    : runtimeVehicles;

  const index = list.findIndex((v) => v.id === id);
  if (index === -1) return undefined;

  const updatedVehicle = {
    ...list[index],
    ...data,
  };

  list[index] = updatedVehicle;
  if (isBrowser()) {
    setItem(STORAGE_KEYS.VEHICLES, list);
  } else {
    runtimeVehicles = list;
  }
  return updatedVehicle;
}

// ==================== PACKAGES & SERVICES ====================
export function getPackages(vehicleType?: "car" | "bike", activeOnly = false): Package[] {
  let list = isBrowser()
    ? getItem<Package[]>(STORAGE_KEYS.PACKAGES, initialPackages)
    : runtimePackages;

  if (vehicleType) {
    list = list.filter((p) => p.vehicle_type === vehicleType);
  }
  if (activeOnly) {
    list = list.filter((p) => p.is_active);
  }
  return list;
}

export function getPackageById(id: string): Package | undefined {
  const list = getPackages();
  return list.find((p) => p.id === id);
}

export function createPackage(data: Omit<Package, "id">): Package {
  const list = isBrowser()
    ? getItem<Package[]>(STORAGE_KEYS.PACKAGES, initialPackages)
    : runtimePackages;

  const newPackage: Package = {
    ...data,
    id: `pkg-${Date.now()}`,
  };

  const updated = [...list, newPackage];
  if (isBrowser()) {
    setItem(STORAGE_KEYS.PACKAGES, updated);
  } else {
    runtimePackages = updated;
  }
  return newPackage;
}

export function updatePackage(id: string, data: Partial<Package>): Package | undefined {
  const list = isBrowser()
    ? getItem<Package[]>(STORAGE_KEYS.PACKAGES, initialPackages)
    : runtimePackages;

  const index = list.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  const updatedPkg = { ...list[index], ...data };
  list[index] = updatedPkg;
  if (isBrowser()) {
    setItem(STORAGE_KEYS.PACKAGES, list);
  } else {
    runtimePackages = list;
  }
  return updatedPkg;
}

export function deletePackage(id: string): boolean {
  let list = isBrowser()
    ? getItem<Package[]>(STORAGE_KEYS.PACKAGES, initialPackages)
    : runtimePackages;

  list = list.filter((p) => p.id !== id);
  if (isBrowser()) {
    setItem(STORAGE_KEYS.PACKAGES, list);
  } else {
    runtimePackages = list;
  }
  return true;
}

export function getServices(vehicleType?: "car" | "bike" | "both", activeOnly = false): Service[] {
  let list = isBrowser()
    ? getItem<Service[]>(STORAGE_KEYS.SERVICES, initialServices)
    : runtimeServices;

  if (vehicleType && vehicleType !== "both") {
    list = list.filter((s) => s.vehicle_type === vehicleType || s.vehicle_type === "both");
  }
  if (activeOnly) {
    list = list.filter((s) => s.is_active);
  }
  return list;
}

export function createService(data: Omit<Service, "id">): Service {
  const list = isBrowser()
    ? getItem<Service[]>(STORAGE_KEYS.SERVICES, initialServices)
    : runtimeServices;

  const newService: Service = {
    ...data,
    id: `srv-${Date.now()}`,
  };

  const updated = [...list, newService];
  if (isBrowser()) {
    setItem(STORAGE_KEYS.SERVICES, updated);
  } else {
    runtimeServices = updated;
  }
  return newService;
}

export function updateService(id: string, data: Partial<Service>): Service | undefined {
  const list = isBrowser()
    ? getItem<Service[]>(STORAGE_KEYS.SERVICES, initialServices)
    : runtimeServices;

  const index = list.findIndex((s) => s.id === id);
  if (index === -1) return undefined;

  const updatedService = { ...list[index], ...data };
  list[index] = updatedService;
  if (isBrowser()) {
    setItem(STORAGE_KEYS.SERVICES, list);
  } else {
    runtimeServices = list;
  }
  return updatedService;
}

// ==================== BOOKINGS ====================
export interface BookingFilter {
  date?: string;
  status?: BookingStatus;
  vehicleType?: "car" | "bike";
  search?: string;
}

export function getBookings(filter?: BookingFilter): Booking[] {
  let list = isBrowser()
    ? getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings)
    : runtimeBookings;

  if (filter?.date) {
    list = list.filter((b) => b.booking_date === filter.date);
  }
  if (filter?.status) {
    list = list.filter((b) => b.status === filter.status);
  }

  const allCustomers = isBrowser()
    ? getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, initialCustomers)
    : runtimeCustomers;
  const allVehicles = isBrowser()
    ? getItem<Vehicle[]>(STORAGE_KEYS.VEHICLES, initialVehicles)
    : runtimeVehicles;
  const allPackages = getPackages();
  const allPayments = getPayments();

  // Attach joins
  list = list.map((b) => {
    const cust = allCustomers.find((c) => c.id === b.customer_id);
    const veh = allVehicles.find((v) => v.id === b.vehicle_id);
    const pkg = allPackages.find((p) => p.id === b.package_id);
    const payments = allPayments.filter((p) => p.booking_id === b.id);
    const paidSum = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      ...b,
      customer: cust,
      vehicle: veh,
      package: pkg,
      payments,
      amount_paid: paidSum,
      remaining_balance: Math.max(0, b.final_amount - paidSum),
    };
  });

  if (filter?.vehicleType) {
    list = list.filter((b) => b.vehicle?.vehicle_type === filter.vehicleType);
  }

  if (filter?.search && filter.search.trim()) {
    const q = filter.search.toLowerCase().trim();
    list = list.filter(
      (b) =>
        b.booking_number.toLowerCase().includes(q) ||
        b.customer?.full_name.toLowerCase().includes(q) ||
        b.customer?.phone.includes(q) ||
        b.vehicle?.reg_number.toLowerCase().includes(q)
    );
  }

  return list;
}

export function getBookingById(id: string): Booking | undefined {
  const list = getBookings();
  return list.find((b) => b.id === id || b.booking_number === id);
}

export function createBooking(data: {
  customer: {
    full_name: string;
    phone: string;
    alt_phone?: string;
    email?: string;
    address?: string;
  };
  vehicle: {
    vehicle_type: "car" | "bike";
    reg_number: string;
    brand: string;
    model: string;
    color?: string;
    category?: string;
    special_instructions?: string;
  };
  package_id?: string;
  additional_services?: string[];
  booking_date: string;
  time_slot: string;
  notes?: string;
  assigned_staff_id?: string;
}): Booking {
  // 1. Find or create customer
  const customers = getCustomers("", true);
  let customer = customers.find(
    (c) => c.phone.replace(/\D/g, "") === data.customer.phone.replace(/\D/g, "")
  );

  if (!customer) {
    customer = createCustomer({
      full_name: data.customer.full_name,
      phone: data.customer.phone,
      alt_phone: data.customer.alt_phone,
      email: data.customer.email,
      address: data.customer.address,
    });
  }

  // 2. Find or create vehicle
  const vehicles = getVehicles(customer.id);
  const cleanReg = data.vehicle.reg_number.toUpperCase().replace(/\s+/g, " ").trim();
  let vehicle = vehicles.find(
    (v) => v.reg_number.replace(/\s+/g, "").toUpperCase() === cleanReg.replace(/\s+/g, "")
  );

  if (!vehicle) {
    vehicle = createVehicle({
      customer_id: customer.id,
      vehicle_type: data.vehicle.vehicle_type,
      reg_number: cleanReg,
      brand: data.vehicle.brand,
      model: data.vehicle.model,
      color: data.vehicle.color || "",
      category: data.vehicle.category || (data.vehicle.vehicle_type === "car" ? "Sedan" : "Standard"),
      special_instructions: data.vehicle.special_instructions,
    });
  }

  // 3. Calculate Pricing
  const pkg = data.package_id ? getPackageById(data.package_id) : undefined;
  const packagePrice = pkg ? pkg.price : 0;
  let servicesTotal = 0;

  if (data.additional_services && data.additional_services.length > 0) {
    const allSrv = getServices();
    data.additional_services.forEach((sId) => {
      const match = allSrv.find((s) => s.id === sId);
      if (match) servicesTotal += match.price;
    });
  }

  const subtotal = packagePrice + servicesTotal;
  const settings = getBusinessSettings();
  const taxAmount = (subtotal * settings.tax_percentage) / 100;
  const finalAmount = Math.round((subtotal + taxAmount) * 100) / 100;

  const newBooking: Booking = {
    id: `book-${Date.now()}`,
    booking_number: generateBookingNumber(),
    customer_id: customer.id,
    vehicle_id: vehicle.id,
    package_id: data.package_id,
    booking_date: data.booking_date,
    time_slot: data.time_slot,
    assigned_staff_id: data.assigned_staff_id,
    status: "pending",
    estimated_duration_mins: pkg ? pkg.estimated_duration_mins : 45,
    package_price: packagePrice,
    services_total: servicesTotal,
    discount: 0,
    tax_amount: taxAmount,
    final_amount: finalAmount,
    advance_payment: 0,
    notes: data.notes || "",
    created_at: new Date().toISOString(),
  };

  const list = isBrowser()
    ? getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings)
    : runtimeBookings;

  const updated = [newBooking, ...list];
  if (isBrowser()) {
    setItem(STORAGE_KEYS.BOOKINGS, updated);
  } else {
    runtimeBookings = updated;
  }

  // Record audit history
  addBookingStatusHistory(newBooking.id, undefined, "pending", "Initial booking received");

  return getBookingById(newBooking.id) || newBooking;
}

export function updateBookingStatus(
  bookingId: string,
  newStatus: BookingStatus,
  notes?: string
): Booking | undefined {
  const list = isBrowser()
    ? getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings)
    : runtimeBookings;

  const index = list.findIndex((b) => b.id === bookingId);
  if (index === -1) return undefined;

  const prevStatus = list[index].status;
  list[index].status = newStatus;
  list[index].updated_at = new Date().toISOString();

  if (isBrowser()) {
    setItem(STORAGE_KEYS.BOOKINGS, list);
  } else {
    runtimeBookings = list;
  }

  addBookingStatusHistory(bookingId, prevStatus, newStatus, notes);
  return getBookingById(bookingId);
}

export function updateBooking(bookingId: string, updates: Partial<Booking>): Booking | undefined {
  const list = isBrowser()
    ? getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings)
    : runtimeBookings;

  const index = list.findIndex((b) => b.id === bookingId);
  if (index === -1) return undefined;

  const updatedBooking = {
    ...list[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  list[index] = updatedBooking;
  if (isBrowser()) {
    setItem(STORAGE_KEYS.BOOKINGS, list);
  } else {
    runtimeBookings = list;
  }

  return getBookingById(bookingId);
}

// ==================== BOOKING STATUS AUDIT TRAIL ====================
export function getBookingStatusHistory(bookingId: string): BookingStatusHistory[] {
  const list = isBrowser()
    ? getItem<BookingStatusHistory[]>(STORAGE_KEYS.STATUS_HISTORY, [])
    : runtimeStatusHistory;

  return list.filter((h) => h.booking_id === bookingId);
}

export function addBookingStatusHistory(
  bookingId: string,
  fromStatus: BookingStatus | undefined,
  toStatus: BookingStatus,
  notes?: string
): void {
  const list = isBrowser()
    ? getItem<BookingStatusHistory[]>(STORAGE_KEYS.STATUS_HISTORY, [])
    : runtimeStatusHistory;

  const newEntry: BookingStatusHistory = {
    id: `hist-${Date.now()}`,
    booking_id: bookingId,
    from_status: fromStatus,
    to_status: toStatus,
    notes: notes || `Status changed to ${toStatus}`,
    changed_by_id: getCurrentUser()?.id,
    created_at: new Date().toISOString(),
  };

  const updated = [newEntry, ...list];
  if (isBrowser()) {
    setItem(STORAGE_KEYS.STATUS_HISTORY, updated);
  } else {
    runtimeStatusHistory = updated;
  }
}

// ==================== PAYMENTS ====================
export function getPayments(bookingId?: string): Payment[] {
  let list = isBrowser()
    ? getItem<Payment[]>(STORAGE_KEYS.PAYMENTS, initialPayments)
    : runtimePayments;

  if (bookingId) {
    list = list.filter((p) => p.booking_id === bookingId);
  }
  return list;
}

export function recordPayment(data: {
  booking_id: string;
  customer_id: string;
  amount: number;
  payment_method: Payment["payment_method"];
  payment_type: Payment["payment_type"];
  transaction_reference?: string;
  is_gateway_verified?: boolean;
  notes?: string;
}): Payment {
  const list = isBrowser()
    ? getItem<Payment[]>(STORAGE_KEYS.PAYMENTS, initialPayments)
    : runtimePayments;

  const newPayment: Payment = {
    id: `pay-${Date.now()}`,
    booking_id: data.booking_id,
    customer_id: data.customer_id,
    amount: data.amount,
    payment_method: data.payment_method,
    payment_type: data.payment_type,
    transaction_reference: data.transaction_reference || `REC-${Math.floor(100000 + Math.random() * 900000)}`,
    is_gateway_verified: Boolean(data.is_gateway_verified),
    received_by_id: getCurrentUser()?.id,
    notes: data.notes || "",
    created_at: new Date().toISOString(),
  };

  const updated = [newPayment, ...list];
  if (isBrowser()) {
    setItem(STORAGE_KEYS.PAYMENTS, updated);
  } else {
    runtimePayments = updated;
  }

  // Check if booking is fully paid and update invoice
  generateOrGetInvoice(data.booking_id);

  return newPayment;
}

// ==================== INVOICES ====================
export function getInvoices(): Invoice[] {
  const list = isBrowser()
    ? getItem<Invoice[]>(STORAGE_KEYS.INVOICES, [])
    : runtimeInvoices;

  return list;
}

export function generateOrGetInvoice(bookingId: string): Invoice | undefined {
  const booking = getBookingById(bookingId);
  if (!booking) return undefined;

  let invoices = isBrowser()
    ? getItem<Invoice[]>(STORAGE_KEYS.INVOICES, [])
    : runtimeInvoices;

  const existing = invoices.find((inv) => inv.booking_id === bookingId);
  const paidSum = (booking.payments || []).reduce((s, p) => s + p.amount, 0);
  const balance = Math.max(0, booking.final_amount - paidSum);
  const status: "unpaid" | "partially_paid" | "paid" =
    paidSum >= booking.final_amount
      ? "paid"
      : paidSum > 0
      ? "partially_paid"
      : "unpaid";

  if (existing) {
    existing.amount_paid = paidSum;
    existing.balance_due = balance;
    existing.status = status;
    if (isBrowser()) {
      setItem(STORAGE_KEYS.INVOICES, invoices);
    }
    return existing;
  }

  const settings = getBusinessSettings();
  const subtotal = booking.package_price + booking.services_total;

  const newInvoice: Invoice = {
    id: `inv-${Date.now()}`,
    invoice_number: generateInvoiceNumber(),
    booking_id: booking.id,
    customer_id: booking.customer_id,
    subtotal: subtotal,
    discount: booking.discount,
    tax_rate: settings.tax_percentage,
    tax_amount: booking.tax_amount,
    grand_total: booking.final_amount,
    amount_paid: paidSum,
    balance_due: balance,
    status: status,
    issued_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  invoices = [newInvoice, ...invoices];
  if (isBrowser()) {
    setItem(STORAGE_KEYS.INVOICES, invoices);
  } else {
    runtimeInvoices = invoices;
  }

  return newInvoice;
}

// ==================== EXPENSES ====================
export function getExpenses(category?: string, startDate?: string, endDate?: string): Expense[] {
  let list = isBrowser()
    ? getItem<Expense[]>(STORAGE_KEYS.EXPENSES, initialExpenses)
    : runtimeExpenses;

  if (category && category !== "all") {
    list = list.filter((e) => e.category === category);
  }
  if (startDate) {
    list = list.filter((e) => e.expense_date >= startDate);
  }
  if (endDate) {
    list = list.filter((e) => e.expense_date <= endDate);
  }

  return list;
}

export function createExpense(data: Omit<Expense, "id" | "created_at">): Expense {
  const list = isBrowser()
    ? getItem<Expense[]>(STORAGE_KEYS.EXPENSES, initialExpenses)
    : runtimeExpenses;

  const newExpense: Expense = {
    ...data,
    id: `exp-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  const updated = [newExpense, ...list];
  if (isBrowser()) {
    setItem(STORAGE_KEYS.EXPENSES, updated);
  } else {
    runtimeExpenses = updated;
  }
  return newExpense;
}

export function deleteExpense(id: string): boolean {
  let list = isBrowser()
    ? getItem<Expense[]>(STORAGE_KEYS.EXPENSES, initialExpenses)
    : runtimeExpenses;

  list = list.filter((e) => e.id !== id);
  if (isBrowser()) {
    setItem(STORAGE_KEYS.EXPENSES, list);
  } else {
    runtimeExpenses = list;
  }
  return true;
}

// ==================== DASHBOARD & ANALYTICS ====================
export function getDashboardStats(): DashboardStats {
  const todayStr = new Date().toISOString().split("T")[0];
  const thisMonthStr = todayStr.substring(0, 7); // "YYYY-MM"

  const allBookings = getBookings();
  const allPayments = getPayments();
  const allExpenses = getExpenses();
  const allCustomers = getCustomers();

  const todayBookings = allBookings.filter((b) => b.booking_date === todayStr);
  const pendingCount = allBookings.filter((b) => b.status === "pending").length;
  const confirmedCount = allBookings.filter((b) => b.status === "confirmed").length;
  const washingCount = allBookings.filter((b) => b.status === "washing_in_progress").length;
  const completedCount = allBookings.filter((b) => b.status === "completed").length;

  // Real collection from actual recorded payments (never from unpaid bookings!)
  const todayPayments = allPayments.filter((p) => p.created_at.startsWith(todayStr));
  const todayCollection = todayPayments.reduce((sum, p) => sum + p.amount, 0);

  const monthlyPayments = allPayments.filter((p) => p.created_at.startsWith(thisMonthStr));
  const monthlyCollection = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

  // Outstanding balances across all non-cancelled bookings
  const outstandingBalance = allBookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + (b.remaining_balance || 0), 0);

  // Real expenses
  const monthlyExpenses = allExpenses
    .filter((e) => e.expense_date.startsWith(thisMonthStr))
    .reduce((sum, e) => sum + e.amount, 0);

  const estimatedProfit = monthlyCollection - monthlyExpenses;

  return {
    today_bookings: todayBookings.length,
    pending_bookings: pendingCount,
    confirmed_bookings: confirmedCount,
    washing_in_progress: washingCount,
    completed_services: completedCount,
    today_collection: Math.round(todayCollection * 100) / 100,
    monthly_collection: Math.round(monthlyCollection * 100) / 100,
    outstanding_balance: Math.round(outstandingBalance * 100) / 100,
    total_customers: allCustomers.length,
    total_expenses: Math.round(monthlyExpenses * 100) / 100,
    estimated_profit: Math.round(estimatedProfit * 100) / 100,
  };
}

export function getRevenueChartData(): { date: string; revenue: number; bookings: number }[] {
  const allPayments = getPayments();
  const allBookings = getBookings();
  const days: { [date: string]: { revenue: number; bookings: number } } = {};

  // Last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().split("T")[0];
    const displayLabel = d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
    days[key] = { revenue: 0, bookings: 0 };

    allPayments.forEach((p) => {
      if (p.created_at.startsWith(key)) {
        days[key].revenue += p.amount;
      }
    });

    allBookings.forEach((b) => {
      if (b.booking_date === key) {
        days[key].bookings += 1;
      }
    });
  }

  return Object.keys(days).map((k) => {
    const d = new Date(k);
    return {
      date: d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
      revenue: Math.round(days[k].revenue),
      bookings: days[k].bookings,
    };
  });
}

export function getStatusChartData(): { name: string; count: number; color: string }[] {
  const allBookings = getBookings();
  const counts: Record<string, number> = {
    pending: 0,
    confirmed: 0,
    vehicle_received: 0,
    washing_in_progress: 0,
    ready_for_delivery: 0,
    completed: 0,
    cancelled: 0,
  };

  allBookings.forEach((b) => {
    if (counts[b.status] !== undefined) {
      counts[b.status]++;
    }
  });

  return [
    { name: "Pending", count: counts.pending, color: "#f59e0b" },
    { name: "Confirmed", count: counts.confirmed, color: "#3b82f6" },
    { name: "In Progress", count: counts.washing_in_progress, color: "#06b6d4" },
    { name: "Ready", count: counts.ready_for_delivery, color: "#10b981" },
    { name: "Completed", count: counts.completed, color: "#22c55e" },
    { name: "Cancelled", count: counts.cancelled, color: "#ef4444" },
  ].filter((item) => item.count > 0);
}
