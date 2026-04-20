// ==========================================
// BASE TYPES
// ==========================================

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface SelectOption {
  value: string | number
  label: string
}

// ==========================================
// USER & AUTH TYPES
// ==========================================

export type UserRole = 'admin' | 'kasir' | 'mekanik' | 'gudang' | 'pimpinan'

export interface User {
  id: string | number
  username?: string
  name: string
  email: string
  role: UserRole
  is_active?: boolean
  created_at?: string
  updated_at?: string
  photoUrl?: string | null
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// ==========================================
// CUSTOMER TYPES
// ==========================================

export interface Customer {
  id: number
  nama: string
  alamat: string
  telepon: string
  email?: string
  nik?: string
  tipe: 'individu' | 'perusahaan'
  nama_perusahaan?: string
  npwp?: string
  created_at: string
  updated_at: string
  vehicles?: Vehicle[]
}

export interface CustomerFormData {
  nama: string
  alamat: string
  telepon: string
  email?: string
  nik?: string
  tipe: 'individu' | 'perusahaan'
  nama_perusahaan?: string
  npwp?: string
}

// ==========================================
// VEHICLE TYPES
// ==========================================

export interface Vehicle {
  id: number
  customer_id: number
  nomor_polisi: string
  merk: string
  model: string
  tahun: number
  warna: string
  nomor_rangka?: string
  nomor_mesin?: string
  transmisi: 'manual' | 'automatic'
  bahan_bakar: 'bensin' | 'diesel' | 'listrik' | 'hybrid'
  created_at: string
  updated_at: string
  customer?: Customer
}

export interface VehicleFormData {
  customer_id: number
  nomor_polisi: string
  merk: string
  model: string
  tahun: number
  warna: string
  nomor_rangka?: string
  nomor_mesin?: string
  transmisi: 'manual' | 'automatic'
  bahan_bakar: 'bensin' | 'diesel' | 'listrik' | 'hybrid'
}

// ==========================================
// SPAREPART TYPES
// ==========================================

export interface Category {
  id: number
  nama: string
  deskripsi?: string
  created_at: string
  updated_at: string
}

export interface Sparepart {
  id: number
  kode: string
  nama: string
  category_id: number
  satuan: string
  harga_beli: number
  harga_jual: number
  stok: number
  stok_minimum: number
  lokasi_rak?: string
  deskripsi?: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface SparepartFormData {
  kode: string
  nama: string
  category_id: number
  satuan: string
  harga_beli: number
  harga_jual: number
  stok: number
  stok_minimum: number
  lokasi_rak?: string
  deskripsi?: string
}

// ==========================================
// SERVICE/JASA TYPES
// ==========================================

export interface Service {
  id: number
  kode: string
  nama: string
  kategori: 'ringan' | 'sedang' | 'berat'
  harga: number
  estimasi_waktu: number // dalam menit
  deskripsi?: string
  created_at: string
  updated_at: string
}

export interface ServiceFormData {
  kode: string
  nama: string
  kategori: 'ringan' | 'sedang' | 'berat'
  harga: number
  estimasi_waktu: number
  deskripsi?: string
}

// ==========================================
// SPK TYPES
// ==========================================

export type SPKStatus = 
  | 'draft'
  | 'pending'
  | 'dikerjakan'
  | 'selesai'
  | 'dibatalkan'
  | 'menunggu_part'

export interface SPKItem {
  id: number
  spk_id: number
  tipe: 'jasa' | 'sparepart'
  item_id: number
  nama_item: string
  quantity: number
  harga_satuan: number
  diskon: number
  subtotal: number
  status: 'pending' | 'dikerjakan' | 'selesai'
  catatan?: string
  service?: Service
  sparepart?: Sparepart
}

export interface SPK {
  id: number
  nomor_spk: string
  tanggal: string
  customer_id: number
  vehicle_id: number
  mekanik_id?: number
  keluhan: string
  diagnosa?: string
  status: SPKStatus
  estimasi_selesai?: string
  tanggal_selesai?: string
  total_jasa: number
  total_sparepart: number
  diskon_total: number
  ppn: number
  grand_total: number
  catatan?: string
  created_by: number
  created_at: string
  updated_at: string
  customer?: Customer
  vehicle?: Vehicle
  mekanik?: User
  items?: SPKItem[]
}

export interface SPKFormData {
  tanggal: string
  customer_id: number
  vehicle_id: number
  mekanik_id?: number
  keluhan: string
  diagnosa?: string
  estimasi_selesai?: string
  catatan?: string
  items: SPKItemFormData[]
}

export interface SPKItemFormData {
  tipe: 'jasa' | 'sparepart'
  item_id: number
  quantity: number
  harga_satuan: number
  diskon: number
  catatan?: string
}

// ==========================================
// INVOICE TYPES
// ==========================================

export type InvoiceStatus = 'draft' | 'unpaid' | 'partial' | 'paid' | 'cancelled'
export type PaymentMethod = 'cash' | 'transfer' | 'debit' | 'credit' | 'qris'

export interface Invoice {
  id: number
  nomor_invoice: string
  spk_id: number
  tanggal: string
  jatuh_tempo?: string
  total_jasa: number
  total_sparepart: number
  diskon: number
  ppn: number
  grand_total: number
  jumlah_dibayar: number
  sisa_bayar: number
  status: InvoiceStatus
  catatan?: string
  created_by: number
  created_at: string
  updated_at: string
  spk?: SPK
  payments?: Payment[]
}

export interface Payment {
  id: number
  invoice_id: number
  tanggal: string
  jumlah: number
  metode: PaymentMethod
  referensi?: string
  catatan?: string
  created_by: number
  created_at: string
}

export interface PaymentFormData {
  invoice_id: number
  tanggal: string
  jumlah: number
  metode: PaymentMethod
  referensi?: string
  catatan?: string
}

// ==========================================
// STOCK MOVEMENT TYPES
// ==========================================

export type StockMovementType = 'masuk' | 'keluar' | 'adjustment' | 'retur'

export interface StockMovement {
  id: number
  sparepart_id: number
  tipe: StockMovementType
  quantity: number
  stok_sebelum: number
  stok_sesudah: number
  referensi_tipe?: string
  referensi_id?: number
  harga_satuan?: number
  catatan?: string
  created_by: number
  created_at: string
  sparepart?: Sparepart
  user?: User
}

export interface StockMovementFormData {
  sparepart_id: number
  tipe: StockMovementType
  quantity: number
  harga_satuan?: number
  catatan?: string
}

// ==========================================
// PURCHASE ORDER TYPES
// ==========================================

export type POStatus = 'draft' | 'pending' | 'approved' | 'received' | 'cancelled'

export interface Supplier {
  id: number
  nama: string
  alamat: string
  telepon: string
  email?: string
  npwp?: string
  contact_person?: string
  created_at: string
  updated_at: string
}

export interface PurchaseOrderItem {
  id: number
  po_id: number
  sparepart_id: number
  quantity_order: number
  quantity_received: number
  harga_satuan: number
  subtotal: number
  sparepart?: Sparepart
}

export interface PurchaseOrder {
  id: number
  nomor_po: string
  supplier_id: number
  tanggal: string
  status: POStatus
  total: number
  catatan?: string
  created_by: number
  approved_by?: number
  approved_at?: string
  created_at: string
  updated_at: string
  supplier?: Supplier
  items?: PurchaseOrderItem[]
}

// ==========================================
// REPORT TYPES
// ==========================================

export interface DashboardStats {
  total_spk_aktif: number
  total_spk_selesai_hari_ini: number
  total_pendapatan_hari_ini: number
  total_pendapatan_bulan_ini: number
  spk_menunggu_part: number
  stok_kritis: number
}

export interface RevenueReport {
  periode: string
  total_jasa: number
  total_sparepart: number
  total_pendapatan: number
  jumlah_transaksi: number
}

export interface MekanikPerformance {
  mekanik_id: number
  nama_mekanik: string
  total_spk: number
  spk_selesai: number
  rata_rata_waktu: number // dalam menit
  total_pendapatan_jasa: number
}

// ==========================================
// ACTIVITY LOG TYPES
// ==========================================

export interface ActivityLog {
  id: number
  user_id: number
  action: string
  model_type: string
  model_id?: number
  old_values?: Record<string, unknown>
  new_values?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  created_at: string
  user?: User
}
