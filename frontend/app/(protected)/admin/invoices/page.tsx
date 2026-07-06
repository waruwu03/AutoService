"use client"

import { useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Search, FileText } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { InvoiceTable } from "@/components/admin/InvoiceTable"
import { PaymentForm } from "@/components/admin/PaymentForm"
import { InvoicePrintTemplate } from "@/components/admin/invoice-print-template"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PremiumStatCard } from "@/components/ui/premium-stat-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/api-client"
import { format } from "date-fns"
import { id } from "date-fns/locale"

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return format(new Date(dateStr), 'dd MMMM yyyy', { locale: id })
}
import type { Invoice, InvoiceStatus, PaymentFormData } from "@/types"
import useSWR from "swr"
import { fetcher, api } from "@/lib/api-client"
import { Loader2 } from "lucide-react"

const paymentStatusConfig: Record<
  InvoiceStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  DRAFT: { label: "Draft", variant: "outline" },
  SENT: { label: "Dikirim", variant: "secondary" },
  PAID: { label: "Lunas", variant: "default" },
  PARTIAL: { label: "Sebagian", variant: "secondary" },
  OVERDUE: { label: "Terlambat", variant: "destructive" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
  REFUNDED: { label: "Dikembalikan", variant: "outline" },
}

export default function InvoicesPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  const printRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  })

  const spkId = searchParams.get('spk')
  
  const fetchUrl = spkId 
    ? `/invoices?workOrderId=${spkId}&limit=100`
    : `/invoices?limit=100&sortBy=createdAt&sortOrder=desc`

  const { data: invoiceData, isLoading, mutate } = useSWR(
    fetchUrl,
    fetcher
  )
  const invoices: Invoice[] = Array.isArray(invoiceData?.data)
    ? invoiceData.data
    : Array.isArray(invoiceData)
    ? invoiceData
    : []

  // Tambahkan fetching data SPK jika ada spkId untuk verifikasi
  const { data: spkData, isLoading: isLoadingSPK } = useSWR(
    spkId ? `/work-orders/${spkId}` : null,
    fetcher
  )
  const spk = spkData?.data

  const filteredInvoices = invoices.filter((invoice: any) => {
    const nomor = invoice.invoiceNumber ?? invoice.nomor_invoice ?? ""
    const customerName = invoice.customer?.name ?? invoice.customer?.nama ?? invoice.workOrder?.customer?.name ?? ""
    const matchesSearch =
      nomor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRevenue = invoices
    .filter((inv: any) => inv.status === "PAID")
    .reduce((sum: number, inv: any) => sum + Number(inv.grandTotal ?? inv.grand_total ?? 0), 0)

  const pendingPayments = invoices
    .filter((inv: any) => inv.status !== "PAID" && inv.status !== "CANCELLED")
    .reduce((sum: number, inv: any) => {
      const total = Number(inv.grandTotal ?? inv.grand_total ?? 0)
      const paid = Number(inv.amountPaid ?? inv.jumlah_dibayar ?? 0)
      return sum + Math.max(0, total - paid)
    }, 0)

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setDetailDialogOpen(true)
  }

  const handlePaymentClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setPaymentDialogOpen(true)
  }

  const handlePrintClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    // Berikan waktu lebih lama untuk render template sebelum print (terutama di Next.js 15+)
    setTimeout(() => {
      if (handlePrint) {
        handlePrint()
      }
    }, 300)
  }

  const handleGenerateInvoice = async () => {
    if (!spkId) return
    try {
      await api.post("/invoices", { workOrderId: spkId, dueDays: 30 })
      await mutate()
    } catch (error: any) {
      console.error("Gagal membuat invoice:", error)
      alert(error.response?.data?.message || "Gagal membuat invoice")
    }
  }

  const handlePaymentSubmit = async (data: any) => {
    try {
      await api.post("/invoices/payments", data)
      await mutate()
      setPaymentDialogOpen(false)
    } catch (error) {
      console.error("Gagal memproses pembayaran:", error)
    }
  }

  const inv = selectedInvoice as any

  return (
    <>
      <AdminHeader 
        title="Kasir / Invoice" 
        description={spkId ? `Menampilkan invoice untuk SPK #${spkId.substring(0,8)}...` : "Kelola invoice dan pembayaran"} 
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PremiumStatCard
              title="Total Invoice"
              value={isLoading ? "..." : invoices.length}
              icon={FileText}
              colorTheme="blue"
            />
            <PremiumStatCard
              title="Belum Dibayar"
              value={isLoading ? "..." : invoices.filter((i: any) => i.status === "SENT" || i.status === "DRAFT").length}
              icon={FileText}
              colorTheme="amber"
            />
            <PremiumStatCard
              title="Pending Payment"
              value={formatCurrency(pendingPayments)}
              icon={FileText}
              colorTheme="red"
            />
            <PremiumStatCard
              title="Total Pendapatan"
              value={formatCurrency(totalRevenue)}
              icon={FileText}
              colorTheme="emerald"
            />
          </div>

          {/* Invoice Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Daftar Invoice</CardTitle>
                  <CardDescription>
                    {filteredInvoices.length} invoice ditemukan
                    {spkId && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 ml-2" 
                        onClick={() => window.location.href = '/admin/invoices'}
                      >
                        Reset Filter SPK
                      </Button>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari no. invoice atau pelanggan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value: InvoiceStatus | "all") => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="SENT">Belum Bayar</SelectItem>
                    <SelectItem value="PARTIAL">Sebagian</SelectItem>
                    <SelectItem value="PAID">Lunas</SelectItem>
                    <SelectItem value="OVERDUE">Terlambat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <InvoiceTable
                invoices={filteredInvoices}
                isLoading={isLoading}
                onView={handleViewInvoice}
                onPayment={handlePaymentClick}
                onPrint={handlePrintClick}
              />

              {!isLoading && spkId && filteredInvoices.length === 0 && (
                <div className="mt-8 text-center p-8 border-2 border-dashed rounded-xl bg-muted/20">
                  <FileText className="mx-auto size-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Invoice Belum Dibuat</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    SPK <span className="font-mono font-bold text-foreground">#{spk?.orderNumber}</span> ({spk?.customer?.name}) telah selesai namun belum memiliki invoice.
                  </p>
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={handleGenerateInvoice}
                  >
                    <Plus className="mr-2 size-4" />
                    Buat Invoice Sekarang
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle>{inv.nomor_invoice ?? inv.invoiceNumber}</DialogTitle>
                    <DialogDescription>
                      Tanggal: {formatDate(inv.tanggal ?? inv.invoiceDate)}
                    </DialogDescription>
                  </div>
                  <Badge variant={paymentStatusConfig[inv.status as InvoiceStatus]?.variant ?? "outline"}>
                    {paymentStatusConfig[inv.status as InvoiceStatus]?.label ?? inv.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="py-4 space-y-4">
                {/* Customer Info */}
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Pelanggan</p>
                  <p className="font-medium">
                    {inv.customer?.name ?? inv.customer?.nama ?? inv.workOrder?.customer?.name ?? "-"}
                  </p>
                </div>

                {/* Payment Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal Jasa</span>
                    <span>{formatCurrency(Number(inv.total_jasa ?? inv.totalServiceCost ?? 0))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal Sparepart</span>
                    <span>{formatCurrency(Number(inv.total_sparepart ?? inv.totalPartsCost ?? 0))}</span>
                  </div>
                  {Number(inv.diskon ?? inv.discountAmount ?? 0) > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Diskon</span>
                      <span>-{formatCurrency(Number(inv.diskon ?? inv.discountAmount ?? 0))}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">PPN</span>
                    <span>{formatCurrency(Number(inv.ppn ?? inv.taxAmount ?? 0))}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(Number(inv.grand_total ?? inv.grandTotal ?? 0))}</span>
                  </div>
                  {Number(inv.jumlah_dibayar ?? inv.amountPaid ?? 0) > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Dibayar</span>
                      <span>-{formatCurrency(Number(inv.jumlah_dibayar ?? inv.amountPaid ?? 0))}</span>
                    </div>
                  )}
                  {inv.status !== "PAID" && (
                    <div className="flex justify-between font-medium">
                      <span>Sisa</span>
                      <span className="text-orange-600">
                        {formatCurrency(Number(inv.sisa_bayar ?? inv.amountDue ?? 0))}
                      </span>
                    </div>
                  )}
                </div>

                {/* Payments history */}
                {Array.isArray(inv.payments) && inv.payments.length > 0 && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm font-medium mb-2">Riwayat Pembayaran</p>
                    {inv.payments.map((p: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{p.metode ?? p.paymentMethod}</span>
                        <span className="font-medium">{formatCurrency(Number(p.jumlah ?? p.amount ?? 0))}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                {inv.status !== "PAID" && inv.status !== "CANCELLED" && (
                  <Button onClick={() => {
                    setDetailDialogOpen(false)
                    handlePaymentClick(selectedInvoice)
                  }}>
                    Input Pembayaran
                  </Button>
                )}
                <Button variant="outline" onClick={() => handlePrintClick(selectedInvoice)}>
                  <FileText className="mr-2 size-4" />
                  Cetak
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Input Pembayaran</DialogTitle>
            <DialogDescription>
              {selectedInvoice
                ? `Invoice #${(selectedInvoice as any).nomor_invoice ?? (selectedInvoice as any).invoiceNumber}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <PaymentForm
              invoice={selectedInvoice as any}
              onSubmit={handlePaymentSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Hidden Print Template */}
      <div className="absolute opacity-0 pointer-events-none -z-50 overflow-hidden h-0 w-0">
        <InvoicePrintTemplate 
          ref={printRef} 
          invoice={selectedInvoice || ({} as any)} 
        />
      </div>
    </>
  )
}
