"use client"

import { useState } from "react"
import useSWR from "swr"
import { fetcher, api, formatCurrency } from "@/lib/api-client"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PremiumStatCard } from "@/components/ui/premium-stat-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Search,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Wallet,
  RefreshCw,
  DollarSign,
} from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { toast } from "sonner"

// ─── Types ─────────────────────────────────────────────────────────────────
type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "PARTIAL" | "OVERDUE" | "CANCELLED" | "REFUNDED"
type PaymentMethod = "CASH" | "TRANSFER" | "DEBIT" | "CREDIT" | "QRIS"

interface Invoice {
  id: string
  invoiceNumber: string
  status: InvoiceStatus
  subtotal: number
  discountAmount: number
  taxAmount: number
  grandTotal: number
  amountPaid: number
  amountDue: number
  dueDate: string | null
  paidDate: string | null
  createdAt: string
  customer: { id: string; name: string; phone: string | null } | null
  workOrder: { id: string; orderNumber: string } | null
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const statusConfig: Record<InvoiceStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  DRAFT:     { label: "Draft",       variant: "outline",     icon: <Clock className="size-3" /> },
  SENT:      { label: "Belum Bayar", variant: "secondary",   icon: <Clock className="size-3" /> },
  PAID:      { label: "Lunas",       variant: "default",     icon: <CheckCircle2 className="size-3" /> },
  PARTIAL:   { label: "Sebagian",    variant: "secondary",   icon: <AlertCircle className="size-3" /> },
  OVERDUE:   { label: "Terlambat",   variant: "destructive", icon: <AlertCircle className="size-3" /> },
  CANCELLED: { label: "Batal",       variant: "destructive", icon: <AlertCircle className="size-3" /> },
  REFUNDED:  { label: "Dikembalikan",variant: "outline",     icon: <RefreshCw className="size-3" /> },
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH:     "Tunai",
  TRANSFER: "Transfer Bank",
  DEBIT:    "Kartu Debit",
  CREDIT:   "Kartu Kredit",
  QRIS:     "QRIS",
}

const fmtDate = (d: string | null) =>
  d ? format(new Date(d), "dd MMM yyyy", { locale: id }) : "-"

// ─── Payment Form ────────────────────────────────────────────────────────────
function PaymentForm({
  invoice,
  onSuccess,
  onClose,
}: {
  invoice: Invoice
  onSuccess: () => void
  onClose: () => void
}) {
  const [amount, setAmount] = useState(invoice.amountDue.toString())
  const [method, setMethod] = useState<PaymentMethod>("CASH")
  const [reference, setReference] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = parseFloat(amount)
    if (!amountNum || amountNum <= 0) {
      toast.error("Jumlah pembayaran tidak valid")
      return
    }
    if (amountNum > invoice.amountDue) {
      toast.error("Jumlah melebihi sisa tagihan")
      return
    }
    setLoading(true)
    try {
      await api.post("/invoices/payments", {
        invoiceId: invoice.id,
        amount: amountNum,
        paymentMethod: method,
        referenceNumber: reference || null,
      })
      toast.success("Pembayaran berhasil dicatat")
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal memproses pembayaran")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Invoice Summary */}
      <div className="rounded-xl bg-muted/40 p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Invoice</span>
          <span className="font-mono font-semibold">{invoice.invoiceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pelanggan</span>
          <span className="font-medium">{invoice.customer?.name ?? "-"}</span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Tagihan</span>
          <span className="font-medium">{formatCurrency(invoice.grandTotal)}</span>
        </div>
        {invoice.amountPaid > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Sudah Dibayar</span>
            <span>- {formatCurrency(invoice.amountPaid)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base">
          <span>Sisa Tagihan</span>
          <span className="text-orange-600">{formatCurrency(invoice.amountDue)}</span>
        </div>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Jumlah Pembayaran (Rp)</label>
        <Input
          type="number"
          min={1}
          max={invoice.amountDue}
          step={1000}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          required
        />
        <div className="flex gap-2 flex-wrap">
          {[invoice.amountDue, Math.ceil(invoice.amountDue / 2)].map((v, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setAmount(v.toString())}
              className="text-xs px-2 py-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            >
              {i === 0 ? "Bayar Penuh" : "Bayar Setengah"} ({formatCurrency(v)})
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Metode Pembayaran</label>
        <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(paymentMethodLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reference Number (optional for non-cash) */}
      {method !== "CASH" && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Nomor Referensi <span className="text-muted-foreground">(opsional)</span></label>
          <Input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Nomor transfer / kode transaksi"
          />
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? (
            <><Loader2 className="mr-2 size-4 animate-spin" />Memproses...</>
          ) : (
            <><CreditCard className="mr-2 size-4" />Konfirmasi Bayar</>
          )}
        </Button>
      </div>
    </form>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function PaymentsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data, isLoading, mutate } = useSWR(
    "/invoices?limit=200&sortBy=createdAt&sortOrder=desc",
    fetcher
  )

  const invoices: Invoice[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : []

  // Filtered list
  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.workOrder?.orderNumber?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  // Stats
  const totalPaid = invoices
    .filter((i) => i.status === "PAID")
    .reduce((s, i) => s + Number(i.grandTotal), 0)

  const totalPending = invoices
    .filter((i) => ["SENT", "PARTIAL", "OVERDUE"].includes(i.status))
    .reduce((s, i) => s + Number(i.amountDue), 0)

  const totalPartial = invoices.filter((i) => i.status === "PARTIAL").length
  const totalOverdue = invoices.filter((i) => i.status === "OVERDUE").length

  const handlePayClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setDialogOpen(true)
  }

  return (
    <>
      <AdminHeader
        title="Manajemen Pembayaran"
        description="Catat dan kelola pembayaran invoice"
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* ── Stats ── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PremiumStatCard
              title="Total Terlunasi"
              value={formatCurrency(totalPaid)}
              icon={TrendingUp}
              colorTheme="emerald"
            />
            <PremiumStatCard
              title="Sisa Tagihan"
              value={formatCurrency(totalPending)}
              icon={Wallet}
              colorTheme="orange"
            />
            <PremiumStatCard
              title="Bayar Sebagian"
              value={`${totalPartial} invoice`}
              icon={DollarSign}
              colorTheme="blue"
            />
            <PremiumStatCard
              title="Terlambat"
              value={`${totalOverdue} invoice`}
              icon={AlertCircle}
              colorTheme="red"
              criticalAlert={totalOverdue > 0}
            />
          </div>

          {/* ── Table ── */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Daftar Invoice</CardTitle>
                  <CardDescription>{filtered.length} invoice ditemukan</CardDescription>
                </div>
              </div>
              {/* Filters */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="payment-search"
                    placeholder="Cari no. invoice, pelanggan, atau no. SPK..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(v) => setStatusFilter(v as InvoiceStatus | "all")}
                >
                  <SelectTrigger className="w-full sm:w-44" id="payment-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="SENT">Belum Bayar</SelectItem>
                    <SelectItem value="PARTIAL">Sebagian</SelectItem>
                    <SelectItem value="PAID">Lunas</SelectItem>
                    <SelectItem value="OVERDUE">Terlambat</SelectItem>
                    <SelectItem value="CANCELLED">Batal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                  <CreditCard className="size-12 text-muted-foreground/40" />
                  <p className="text-muted-foreground">Tidak ada data pembayaran</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No. Invoice</TableHead>
                        <TableHead>Pelanggan</TableHead>
                        <TableHead>No. SPK</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Jatuh Tempo</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Dibayar</TableHead>
                        <TableHead className="text-right">Sisa</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((inv) => {
                        const cfg = statusConfig[inv.status] ?? statusConfig.DRAFT
                        const canPay = ["SENT", "PARTIAL", "OVERDUE"].includes(inv.status)
                        return (
                          <TableRow key={inv.id} className="group">
                            <TableCell className="font-mono text-sm font-semibold">
                              {inv.invoiceNumber}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{inv.customer?.name ?? "-"}</p>
                                {inv.customer?.phone && (
                                  <p className="text-xs text-muted-foreground">{inv.customer.phone}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {inv.workOrder?.orderNumber ?? "-"}
                            </TableCell>
                            <TableCell className="text-sm">{fmtDate(inv.createdAt)}</TableCell>
                            <TableCell className="text-sm">{fmtDate(inv.dueDate)}</TableCell>
                            <TableCell className="text-right font-medium text-sm">
                              {formatCurrency(Number(inv.grandTotal))}
                            </TableCell>
                            <TableCell className="text-right text-sm text-green-600">
                              {Number(inv.amountPaid) > 0 ? formatCurrency(Number(inv.amountPaid)) : "-"}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {Number(inv.amountDue) > 0 ? (
                                <span className="font-semibold text-orange-600">
                                  {formatCurrency(Number(inv.amountDue))}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={cfg.variant} className="gap-1 text-xs">
                                {cfg.icon}
                                {cfg.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {canPay ? (
                                <Button
                                  id={`pay-btn-${inv.id}`}
                                  size="sm"
                                  onClick={() => handlePayClick(inv)}
                                  className="gap-1"
                                >
                                  <CreditCard className="size-3" />
                                  Bayar
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Payment Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="size-5" />
              Input Pembayaran
            </DialogTitle>
            <DialogDescription>
              Catat pembayaran untuk invoice{" "}
              <span className="font-mono font-semibold">{selectedInvoice?.invoiceNumber}</span>
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <PaymentForm
              invoice={selectedInvoice}
              onSuccess={() => mutate()}
              onClose={() => setDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
