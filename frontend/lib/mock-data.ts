import type {
  Customer,
  Vehicle,
  SPK,
  Invoice,
  Mechanic,
  ServiceItem,
} from "./types"

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: "cust-001",
    name: "Ahmad Wijaya",
    email: "ahmad.wijaya@email.com",
    phone: "081234567890",
    address: "Jl. Sudirman No. 123, Jakarta Selatan",
    type: "pribadi",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "cust-002",
    name: "PT. Maju Bersama",
    email: "fleet@majubersama.co.id",
    phone: "021-5551234",
    address: "Jl. Gatot Subroto Kav. 45, Jakarta",
    type: "korporat",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "cust-003",
    name: "Siti Rahayu",
    email: "siti.rahayu@gmail.com",
    phone: "087712345678",
    address: "Jl. Kebon Jeruk No. 56, Jakarta Barat",
    type: "pribadi",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "cust-004",
    name: "Budi Santoso",
    email: "budi.santoso@yahoo.com",
    phone: "085678901234",
    address: "Jl. Pemuda No. 78, Bekasi",
    type: "pribadi",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "cust-005",
    name: "CV. Auto Prima",
    email: "service@autoprima.id",
    phone: "021-7891234",
    address: "Jl. Raya Bogor Km 30, Depok",
    type: "korporat",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
]

// Mock Vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: "veh-001",
    customerId: "cust-001",
    plateNumber: "B 1234 ABC",
    brand: "Toyota",
    model: "Avanza",
    year: 2021,
    chassisNumber: "MHFM1BA3J1K123456",
    engineNumber: "1NR-FE1234567",
    color: "Silver",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "veh-002",
    customerId: "cust-001",
    plateNumber: "B 5678 DEF",
    brand: "Honda",
    model: "Jazz",
    year: 2020,
    chassisNumber: "MHRGE8760LJ012345",
    engineNumber: "L15Z11234567",
    color: "Merah",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "veh-003",
    customerId: "cust-002",
    plateNumber: "B 9012 GHI",
    brand: "Mitsubishi",
    model: "Pajero Sport",
    year: 2022,
    chassisNumber: "MMBGFKL70MF123456",
    engineNumber: "4N15U1234567",
    color: "Hitam",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "veh-004",
    customerId: "cust-003",
    plateNumber: "B 3456 JKL",
    brand: "Suzuki",
    model: "Ertiga",
    year: 2019,
    chassisNumber: "MHYESL415KJ123456",
    engineNumber: "K15B1234567",
    color: "Putih",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "veh-005",
    customerId: "cust-004",
    plateNumber: "B 7890 MNO",
    brand: "Daihatsu",
    model: "Xenia",
    year: 2020,
    chassisNumber: "MHKV1BA2JLK123456",
    engineNumber: "1NR-VE1234567",
    color: "Abu-abu",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
]

// Mock Mechanics
export const mockMechanics: Mechanic[] = [
  {
    id: "mech-001",
    name: "Joko Susilo",
    phone: "081111222333",
    specialization: "Mesin",
    status: "available",
  },
  {
    id: "mech-002",
    name: "Andi Pratama",
    phone: "082222333444",
    specialization: "Kelistrikan",
    status: "busy",
  },
  {
    id: "mech-003",
    name: "Rudi Hermawan",
    phone: "083333444555",
    specialization: "AC & Sistem Pendingin",
    status: "available",
  },
  {
    id: "mech-004",
    name: "Dedi Kurniawan",
    phone: "084444555666",
    specialization: "Body & Cat",
    status: "off",
  },
]

// Service catalog
export const serviceCatalog: Omit<ServiceItem, "id" | "quantity">[] = [
  { name: "Ganti Oli Mesin", price: 150000, description: "Termasuk oli 4 liter" },
  { name: "Tune Up", price: 350000, description: "Service lengkap mesin" },
  { name: "Servis AC", price: 250000, description: "Pembersihan dan isi freon" },
  { name: "Ganti Kampas Rem", price: 200000, description: "Per set depan/belakang" },
  { name: "Spooring & Balancing", price: 300000, description: "4 roda" },
  { name: "Ganti Aki", price: 100000, description: "Jasa pasang" },
  { name: "Ganti Filter Udara", price: 50000, description: "Jasa pasang" },
  { name: "Ganti Busi", price: 75000, description: "Per busi" },
]

// Parts catalog
export const partsCatalog: Omit<ServiceItem, "id" | "quantity">[] = [
  { name: "Oli Mesin Shell Helix HX7 5W-40", price: 380000 },
  { name: "Oli Mesin Castrol GTX 10W-40", price: 320000 },
  { name: "Filter Oli Original", price: 85000 },
  { name: "Filter Udara Original", price: 150000 },
  { name: "Kampas Rem Depan", price: 450000 },
  { name: "Kampas Rem Belakang", price: 350000 },
  { name: "Aki GS Astra 45Ah", price: 850000 },
  { name: "Busi NGK Iridium", price: 125000 },
  { name: "Freon R134a 1kg", price: 180000 },
  { name: "V-Belt", price: 250000 },
]

// Mock SPK
export const mockSPKs: SPK[] = [
  {
    id: "spk-001",
    spkNumber: "SPK/2024/03/001",
    customerId: "cust-001",
    vehicleId: "veh-001",
    mechanicId: "mech-001",
    status: "completed",
    services: [
      { id: "srv-001", name: "Ganti Oli Mesin", price: 150000, quantity: 1 },
      { id: "srv-002", name: "Tune Up", price: 350000, quantity: 1 },
    ],
    parts: [
      { id: "prt-001", name: "Oli Mesin Shell Helix HX7 5W-40", price: 380000, quantity: 1 },
      { id: "prt-002", name: "Filter Oli Original", price: 85000, quantity: 1 },
    ],
    notes: "Pelanggan minta cek juga sistem AC",
    estimatedCost: 965000,
    actualCost: 965000,
    startDate: new Date("2024-03-10"),
    estimatedEndDate: new Date("2024-03-10"),
    completedDate: new Date("2024-03-10"),
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "spk-002",
    spkNumber: "SPK/2024/03/002",
    customerId: "cust-002",
    vehicleId: "veh-003",
    mechanicId: "mech-002",
    status: "in_progress",
    services: [
      { id: "srv-003", name: "Servis AC", price: 250000, quantity: 1 },
    ],
    parts: [
      { id: "prt-003", name: "Freon R134a 1kg", price: 180000, quantity: 2 },
    ],
    notes: "AC tidak dingin",
    estimatedCost: 610000,
    startDate: new Date("2024-03-12"),
    estimatedEndDate: new Date("2024-03-13"),
    createdAt: new Date("2024-03-12"),
    updatedAt: new Date("2024-03-12"),
  },
  {
    id: "spk-003",
    spkNumber: "SPK/2024/03/003",
    customerId: "cust-003",
    vehicleId: "veh-004",
    status: "draft",
    services: [
      { id: "srv-004", name: "Ganti Kampas Rem", price: 200000, quantity: 2 },
      { id: "srv-005", name: "Spooring & Balancing", price: 300000, quantity: 1 },
    ],
    parts: [
      { id: "prt-004", name: "Kampas Rem Depan", price: 450000, quantity: 1 },
      { id: "prt-005", name: "Kampas Rem Belakang", price: 350000, quantity: 1 },
    ],
    estimatedCost: 1500000,
    startDate: new Date("2024-03-14"),
    createdAt: new Date("2024-03-13"),
    updatedAt: new Date("2024-03-13"),
  },
  {
    id: "spk-004",
    spkNumber: "SPK/2024/03/004",
    customerId: "cust-004",
    vehicleId: "veh-005",
    mechanicId: "mech-003",
    status: "completed",
    services: [
      { id: "srv-006", name: "Ganti Aki", price: 100000, quantity: 1 },
    ],
    parts: [
      { id: "prt-006", name: "Aki GS Astra 45Ah", price: 850000, quantity: 1 },
    ],
    estimatedCost: 950000,
    actualCost: 950000,
    startDate: new Date("2024-03-11"),
    completedDate: new Date("2024-03-11"),
    createdAt: new Date("2024-03-11"),
    updatedAt: new Date("2024-03-11"),
  },
]

// Mock Invoices
export const mockInvoices: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV/2024/03/001",
    spkId: "spk-001",
    customerId: "cust-001",
    subtotal: 965000,
    discount: 50000,
    tax: 91500,
    total: 1006500,
    paymentStatus: "paid",
    paidAmount: 1006500,
    paymentMethod: "Transfer Bank",
    paymentDate: new Date("2024-03-10"),
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "inv-002",
    invoiceNumber: "INV/2024/03/002",
    spkId: "spk-004",
    customerId: "cust-004",
    subtotal: 950000,
    discount: 0,
    tax: 95000,
    total: 1045000,
    paymentStatus: "partial",
    paidAmount: 500000,
    paymentMethod: "Tunai",
    createdAt: new Date("2024-03-11"),
    updatedAt: new Date("2024-03-11"),
  },
]

// Helper functions
export function getCustomerById(id: string): Customer | undefined {
  return mockCustomers.find((c) => c.id === id)
}

export function getVehicleById(id: string): Vehicle | undefined {
  return mockVehicles.find((v) => v.id === id)
}

export function getVehiclesByCustomerId(customerId: string): Vehicle[] {
  return mockVehicles.filter((v) => v.customerId === customerId)
}

export function getMechanicById(id: string): Mechanic | undefined {
  return mockMechanics.find((m) => m.id === id)
}

export function getSPKById(id: string): SPK | undefined {
  return mockSPKs.find((s) => s.id === id)
}

export function getInvoiceBySpkId(spkId: string): Invoice | undefined {
  return mockInvoices.find((i) => i.spkId === spkId)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function generateSPKNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0")
  return `SPK/${year}/${month}/${random}`
}

export function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0")
  return `INV/${year}/${month}/${random}`
}
