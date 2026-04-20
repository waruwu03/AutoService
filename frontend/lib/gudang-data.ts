// Mock data for Gudang/Warehouse Management System

export type StockStatus = 'ok' | 'minimum' | 'critical'

export interface InventoryItem {
  id: string
  partCode: string
  name: string
  description: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unitPrice: number
  sellPrice: number
  supplier: {
    id: string
    name: string
    contact: string
    leadTime: number
  }
  location: {
    rack: string
    row: string
    column: string
  }
  lastUpdated: string
  status: StockStatus
}

export interface StockMovement {
  id: string
  partCode: string
  partName: string
  type: 'in' | 'out'
  quantity: number
  date: string
  reference: string
  performedBy: string
  notes: string
}

export interface ApprovalNote {
  id: string
  noteNumber: string
  type: 'pengeluaran' | 'penerimaan' | 'transfer'
  requestedBy: string
  requestDate: string
  items: {
    partCode: string
    partName: string
    quantity: number
  }[]
  status: 'pending' | 'approved' | 'rejected'
  totalItems: number
  priority: 'normal' | 'urgent'
}

export interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  address: string
  leadTime: number
  totalProducts: number
  status: 'active' | 'inactive'
}

// Mock Inventory Data
export const inventoryItems: InventoryItem[] = [
  {
    id: '1',
    partCode: 'BRK-001',
    name: 'Brake Pad Set - Front',
    description: 'High-performance ceramic brake pads for front wheels',
    category: 'Brake System',
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    unitPrice: 350000,
    sellPrice: 450000,
    supplier: { id: 's1', name: 'PT Auto Parts Indonesia', contact: 'Budi Santoso', leadTime: 3 },
    location: { rack: 'A', row: '1', column: '3' },
    lastUpdated: '2026-04-18T10:30:00',
    status: 'ok'
  },
  {
    id: '2',
    partCode: 'OIL-002',
    name: 'Engine Oil 5W-30',
    description: 'Synthetic engine oil 4L',
    category: 'Fluids',
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    unitPrice: 280000,
    sellPrice: 350000,
    supplier: { id: 's2', name: 'Shell Indonesia', contact: 'Ahmad Wijaya', leadTime: 2 },
    location: { rack: 'B', row: '2', column: '1' },
    lastUpdated: '2026-04-17T14:20:00',
    status: 'critical'
  },
  {
    id: '3',
    partCode: 'FLT-003',
    name: 'Air Filter Universal',
    description: 'Universal air filter for most sedan vehicles',
    category: 'Filters',
    currentStock: 12,
    minStock: 10,
    maxStock: 40,
    unitPrice: 85000,
    sellPrice: 120000,
    supplier: { id: 's3', name: 'Denso Indonesia', contact: 'Siti Rahayu', leadTime: 5 },
    location: { rack: 'C', row: '1', column: '2' },
    lastUpdated: '2026-04-16T09:15:00',
    status: 'minimum'
  },
  {
    id: '4',
    partCode: 'SPK-004',
    name: 'Spark Plug NGK Iridium',
    description: 'Iridium spark plug set of 4',
    category: 'Ignition',
    currentStock: 32,
    minStock: 15,
    maxStock: 60,
    unitPrice: 180000,
    sellPrice: 240000,
    supplier: { id: 's4', name: 'NGK Indonesia', contact: 'Rudi Hartono', leadTime: 4 },
    location: { rack: 'D', row: '3', column: '4' },
    lastUpdated: '2026-04-18T08:45:00',
    status: 'ok'
  },
  {
    id: '5',
    partCode: 'BAT-005',
    name: 'Car Battery 12V 60Ah',
    description: 'Maintenance-free car battery',
    category: 'Electrical',
    currentStock: 5,
    minStock: 8,
    maxStock: 25,
    unitPrice: 950000,
    sellPrice: 1200000,
    supplier: { id: 's5', name: 'GS Astra', contact: 'Dewi Lestari', leadTime: 3 },
    location: { rack: 'E', row: '1', column: '1' },
    lastUpdated: '2026-04-15T11:00:00',
    status: 'critical'
  },
  {
    id: '6',
    partCode: 'TRE-006',
    name: 'Tie Rod End',
    description: 'Premium tie rod end for steering system',
    category: 'Suspension',
    currentStock: 28,
    minStock: 12,
    maxStock: 50,
    unitPrice: 220000,
    sellPrice: 300000,
    supplier: { id: 's1', name: 'PT Auto Parts Indonesia', contact: 'Budi Santoso', leadTime: 3 },
    location: { rack: 'A', row: '2', column: '5' },
    lastUpdated: '2026-04-17T16:30:00',
    status: 'ok'
  },
  {
    id: '7',
    partCode: 'BLT-007',
    name: 'Timing Belt Kit',
    description: 'Complete timing belt kit with tensioner',
    category: 'Engine',
    currentStock: 6,
    minStock: 5,
    maxStock: 20,
    unitPrice: 650000,
    sellPrice: 850000,
    supplier: { id: 's3', name: 'Denso Indonesia', contact: 'Siti Rahayu', leadTime: 5 },
    location: { rack: 'F', row: '1', column: '2' },
    lastUpdated: '2026-04-18T07:00:00',
    status: 'minimum'
  },
  {
    id: '8',
    partCode: 'RAD-008',
    name: 'Radiator Coolant 5L',
    description: 'Premium radiator coolant green',
    category: 'Fluids',
    currentStock: 22,
    minStock: 10,
    maxStock: 40,
    unitPrice: 120000,
    sellPrice: 165000,
    supplier: { id: 's2', name: 'Shell Indonesia', contact: 'Ahmad Wijaya', leadTime: 2 },
    location: { rack: 'B', row: '2', column: '3' },
    lastUpdated: '2026-04-16T13:45:00',
    status: 'ok'
  },
  {
    id: '9',
    partCode: 'WIP-009',
    name: 'Wiper Blade 20 inch',
    description: 'Universal frameless wiper blade',
    category: 'Accessories',
    currentStock: 3,
    minStock: 10,
    maxStock: 30,
    unitPrice: 75000,
    sellPrice: 110000,
    supplier: { id: 's6', name: 'Bosch Indonesia', contact: 'Eko Prasetyo', leadTime: 4 },
    location: { rack: 'G', row: '2', column: '1' },
    lastUpdated: '2026-04-14T10:20:00',
    status: 'critical'
  },
  {
    id: '10',
    partCode: 'SHK-010',
    name: 'Shock Absorber Front',
    description: 'Gas-filled front shock absorber',
    category: 'Suspension',
    currentStock: 18,
    minStock: 8,
    maxStock: 30,
    unitPrice: 480000,
    sellPrice: 620000,
    supplier: { id: 's1', name: 'PT Auto Parts Indonesia', contact: 'Budi Santoso', leadTime: 3 },
    location: { rack: 'A', row: '3', column: '2' },
    lastUpdated: '2026-04-18T09:30:00',
    status: 'ok'
  }
]

// Mock Stock Movements
export const stockMovements: StockMovement[] = [
  { id: 'm1', partCode: 'BRK-001', partName: 'Brake Pad Set - Front', type: 'out', quantity: 4, date: '2026-04-18T14:30:00', reference: 'WO-2024-0456', performedBy: 'Agus Teknisi', notes: 'Service berkala' },
  { id: 'm2', partCode: 'OIL-002', partName: 'Engine Oil 5W-30', type: 'out', quantity: 2, date: '2026-04-18T13:15:00', reference: 'WO-2024-0455', performedBy: 'Budi Teknisi', notes: 'Ganti oli' },
  { id: 'm3', partCode: 'SPK-004', partName: 'Spark Plug NGK Iridium', type: 'in', quantity: 20, date: '2026-04-18T10:00:00', reference: 'PO-2024-0089', performedBy: 'Staf Gudang', notes: 'Restock dari supplier' },
  { id: 'm4', partCode: 'BAT-005', partName: 'Car Battery 12V 60Ah', type: 'out', quantity: 1, date: '2026-04-18T09:45:00', reference: 'WO-2024-0454', performedBy: 'Agus Teknisi', notes: 'Penggantian baterai' },
  { id: 'm5', partCode: 'FLT-003', partName: 'Air Filter Universal', type: 'out', quantity: 3, date: '2026-04-17T16:20:00', reference: 'WO-2024-0453', performedBy: 'Candra Teknisi', notes: 'Service AC' },
  { id: 'm6', partCode: 'RAD-008', partName: 'Radiator Coolant 5L', type: 'in', quantity: 15, date: '2026-04-17T11:30:00', reference: 'PO-2024-0088', performedBy: 'Staf Gudang', notes: 'Restock bulanan' },
  { id: 'm7', partCode: 'TRE-006', partName: 'Tie Rod End', type: 'out', quantity: 2, date: '2026-04-17T10:15:00', reference: 'WO-2024-0452', performedBy: 'Budi Teknisi', notes: 'Perbaikan steering' },
  { id: 'm8', partCode: 'SHK-010', partName: 'Shock Absorber Front', type: 'out', quantity: 2, date: '2026-04-16T15:00:00', reference: 'WO-2024-0451', performedBy: 'Agus Teknisi', notes: 'Penggantian shock' },
]

// Mock Approval Notes
export const approvalNotes: ApprovalNote[] = [
  {
    id: 'ap1',
    noteNumber: 'NP-2024-0123',
    type: 'pengeluaran',
    requestedBy: 'Agus Teknisi',
    requestDate: '2026-04-18T14:00:00',
    items: [
      { partCode: 'BRK-001', partName: 'Brake Pad Set - Front', quantity: 2 },
      { partCode: 'OIL-002', partName: 'Engine Oil 5W-30', quantity: 4 }
    ],
    status: 'pending',
    totalItems: 2,
    priority: 'urgent'
  },
  {
    id: 'ap2',
    noteNumber: 'NP-2024-0122',
    type: 'pengeluaran',
    requestedBy: 'Budi Teknisi',
    requestDate: '2026-04-18T11:30:00',
    items: [
      { partCode: 'SPK-004', partName: 'Spark Plug NGK Iridium', quantity: 4 }
    ],
    status: 'pending',
    totalItems: 1,
    priority: 'normal'
  },
  {
    id: 'ap3',
    noteNumber: 'NP-2024-0121',
    type: 'transfer',
    requestedBy: 'Candra Teknisi',
    requestDate: '2026-04-17T16:00:00',
    items: [
      { partCode: 'FLT-003', partName: 'Air Filter Universal', quantity: 5 },
      { partCode: 'WIP-009', partName: 'Wiper Blade 20 inch', quantity: 3 }
    ],
    status: 'pending',
    totalItems: 2,
    priority: 'normal'
  },
  {
    id: 'ap4',
    noteNumber: 'NP-2024-0120',
    type: 'pengeluaran',
    requestedBy: 'Agus Teknisi',
    requestDate: '2026-04-17T10:00:00',
    items: [
      { partCode: 'BAT-005', partName: 'Car Battery 12V 60Ah', quantity: 1 }
    ],
    status: 'approved',
    totalItems: 1,
    priority: 'urgent'
  },
  {
    id: 'ap5',
    noteNumber: 'NP-2024-0119',
    type: 'penerimaan',
    requestedBy: 'Staf Gudang',
    requestDate: '2026-04-16T14:00:00',
    items: [
      { partCode: 'SPK-004', partName: 'Spark Plug NGK Iridium', quantity: 20 },
      { partCode: 'RAD-008', partName: 'Radiator Coolant 5L', quantity: 15 }
    ],
    status: 'approved',
    totalItems: 2,
    priority: 'normal'
  }
]

// Mock Suppliers
export const suppliers: Supplier[] = [
  { id: 's1', name: 'PT Auto Parts Indonesia', contact: 'Budi Santoso', email: 'budi@autoparts.co.id', phone: '021-5551234', address: 'Jl. Industri No. 45, Jakarta', leadTime: 3, totalProducts: 156, status: 'active' },
  { id: 's2', name: 'Shell Indonesia', contact: 'Ahmad Wijaya', email: 'ahmad@shell.co.id', phone: '021-5552345', address: 'Jl. Sudirman No. 100, Jakarta', leadTime: 2, totalProducts: 23, status: 'active' },
  { id: 's3', name: 'Denso Indonesia', contact: 'Siti Rahayu', email: 'siti@denso.co.id', phone: '021-5553456', address: 'Jl. MM2100 Blok A1, Bekasi', leadTime: 5, totalProducts: 89, status: 'active' },
  { id: 's4', name: 'NGK Indonesia', contact: 'Rudi Hartono', email: 'rudi@ngk.co.id', phone: '021-5554567', address: 'Jl. EJIP Plot 5C, Cikarang', leadTime: 4, totalProducts: 34, status: 'active' },
  { id: 's5', name: 'GS Astra', contact: 'Dewi Lestari', email: 'dewi@gsastra.co.id', phone: '021-5555678', address: 'Jl. Gaya Motor, Jakarta', leadTime: 3, totalProducts: 12, status: 'active' },
  { id: 's6', name: 'Bosch Indonesia', contact: 'Eko Prasetyo', email: 'eko@bosch.co.id', phone: '021-5556789', address: 'Jl. Jababeka XVII, Cikarang', leadTime: 4, totalProducts: 78, status: 'active' },
  { id: 's7', name: 'Astra Otoparts', contact: 'Rina Susanti', email: 'rina@astraoto.co.id', phone: '021-5557890', address: 'Jl. Raya Pegangsaan, Jakarta', leadTime: 2, totalProducts: 203, status: 'inactive' }
]

// Dashboard stats
export const dashboardStats = {
  totalParts: 1247,
  criticalStock: 3,
  minimumStock: 5,
  pendingApprovals: 3,
  todayInbound: 35,
  todayOutbound: 12,
  upcomingPO: 8
}

// Categories for filtering
export const categories = [
  'Brake System',
  'Fluids',
  'Filters',
  'Ignition',
  'Electrical',
  'Suspension',
  'Engine',
  'Accessories'
]

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Format date
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

// Get status color class
export function getStockStatusColor(status: StockStatus): string {
  switch (status) {
    case 'ok':
      return 'bg-success text-success-foreground'
    case 'minimum':
      return 'bg-warning text-warning-foreground'
    case 'critical':
      return 'bg-critical text-critical-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function getStockStatusLabel(status: StockStatus): string {
  switch (status) {
    case 'ok':
      return 'OK'
    case 'minimum':
      return 'Minimum'
    case 'critical':
      return 'Kritis'
    default:
      return status
  }
}
