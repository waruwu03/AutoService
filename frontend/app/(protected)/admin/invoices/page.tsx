"use client"

import { useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Search, Download, FileText } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import { AdminHeader } from "@/components/admin/admin-header"
import { InvoiceTable } from "@/components/admin/invoice-table"
import { PaymentForm } from "@/components/admin/payment-form"
import { InvoicePrintTemplate } from "@/components/admin/invoice-print-template"
import { SPKDetailModal } from "@/components/admin/spk-detail-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  mockInvoices,
  mockSPKs,
  getCustomerById,
  getSPKById,
  getVehicleById,
  formatCurrency,
  formatDate,
  generateInvoiceNumber,
} from "@/lib/mock-data"
import type { Invoice, PaymentStatus, PaymentFormData, SPK } from "@/lib/types"

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  unpaid: { label: "Belum Bayar", variant: "destructive" },
  partial: { label: "Sebagian", variant: "secondary" },
  paid: { label: "Lunas", variant: "outline" },
}

export default function InvoicesPage() {
  const searchParams = useSearchParams()
  const spkIdParam = searchParams.get("spk")

  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(spkIdParam ? true : false)
  const [selectedSpkForInvoice, setSelectedSpkForInvoice] = useState<string>(spkIdParam || "")

  const printRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  })

  // Get completed SPKs that don't have invoices yet
  const completedSPKsWithoutInvoice = mockSPKs.filter(
    (spk) =>
      spk.status === "completed" &&
      !invoices.find((inv) => inv.spkId === spk.id)
  )

  const filteredInvoices = invoices.filter((invoice) => {
    const customer = getCustomerById(invoice.customerId)
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.paymentStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRevenue = invoices
    .filter((inv) => inv.paymentStatus === "paid")
    .reduce((sum, inv) => sum + inv.total, 0)
  const pendingPayments = invoices
    .filter((inv) => inv.paymentStatus !== "paid")
    .reduce((sum, inv) => sum + (inv.total - inv.paidAmount), 0)

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
    setTimeout(() => {
      handlePrint()
    }, 100)
  }

  const handlePaymentSubmit = async (invoiceId: string, data: PaymentFormData) => {
    setInvoices(
      invoices.map((inv) => {
        if (inv.id === invoiceId) {
          const newPaidAmount = inv.paidAmount + data.amount
          const newDiscount = inv.discount + (data.discount || 0)
          const newTotal = inv.subtotal + inv.tax - newDiscount
          const newStatus: PaymentStatus =
            newPaidAmount >= newTotal ? "paid" : newPaidAmount > 0 ? "partial" : "unpaid"

          return {
            ...inv,
            paidAmount: Math.min(newPaidAmount, newTotal),
            discount: newDiscount,
            total: newTotal,
            paymentStatus: newStatus,
            paymentMethod: data.method,
            paymentDate: new Date(),
            notes: data.notes || inv.notes,
            updatedAt: new Date(),
          }
        }
        return inv
      })
    )
  }

  const handleCreateInvoice = () => {
    const spk = getSPKById(selectedSpkForInvoice)
    if (!spk) return

    const servicesTotal = spk.services.reduce((sum, s) => sum + s.price * s.quantity, 0)
    const partsTotal = spk.parts.reduce((sum, p) => sum + p.price * p.quantity, 0)
    const subtotal = servicesTotal + partsTotal
    const tax = Math.round(subtotal * 0.1)

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
      spkId: spk.id,
      customerId: spk.customerId,
      subtotal,
      discount: 0,
      tax,
      total: subtotal + tax,
      paymentStatus: "unpaid",
      paidAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setInvoices([newInvoice, ...invoices])
    setCreateDialogOpen(false)
    setSelectedSpkForInvoice("")
  }

  return (
    <>
      <AdminHeader title="Kasir / Invoice" description="Kelola invoice dan pembayaran" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Invoice</p>
                <p className="text-2xl font-bold">{invoices.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Belum Dibayar</p>
                <p className="text-2xl font-bold">
                  {invoices.filter((i) => i.paymentStatus === "unpaid").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Pending Payment</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(pendingPayments)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalRevenue)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Daftar Invoice</CardTitle>
                  <CardDescription>
                    {filteredInvoices.length} invoice ditemukan
                  </CardDescription>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 size-4" />
                  Buat Invoice
                </Button>
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
                  onValueChange={(value: PaymentStatus | "all") => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="unpaid">Belum Bayar</SelectItem>
                    <SelectItem value="partial">Sebagian</SelectItem>
                    <SelectItem value="paid">Lunas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <InvoiceTable
                invoices={filteredInvoices}
                onView={handleViewInvoice}
                onPayment={handlePaymentClick}
                onPrint={handlePrintClick}
              />
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
                    <DialogTitle>{selectedInvoice.invoiceNumber}</DialogTitle>
                    <DialogDescription>
                      Tanggal: {formatDate(selectedInvoice.createdAt)}
                    </DialogDescription>
                  </div>
                  <Badge variant={paymentStatusConfig[selectedInvoice.paymentStatus].variant}>
                    {paymentStatusConfig[selectedInvoice.paymentStatus].label}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="py-4 space-y-4">
                {/* Customer Info */}
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Pelanggan</p>
                  <p className="font-medium">
                    {getCustomerById(selectedInvoice.customerId)?.name}
                  </p>
                </div>

                {/* Payment Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Diskon</span>
                      <span>-{formatCurrency(selectedInvoice.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pajak (10%)</span>
                    <span>{formatCurrency(selectedInvoice.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(selectedInvoice.total)}</span>
                  </div>
                  {selectedInvoice.paidAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Dibayar</span>
                      <span>-{formatCurrency(selectedInvoice.paidAmount)}</span>
                    </div>
                  )}
                  {selectedInvoice.paymentStatus !== "paid" && (
                    <div className="flex justify-between font-medium">
                      <span>Sisa</span>
                      <span className="text-orange-600">
                        {formatCurrency(selectedInvoice.total - selectedInvoice.paidAmount)}
                      </span>
                    </div>
                  )}
                </div>

                {selectedInvoice.paymentMethod && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm">
                      Metode: <span className="font-medium">{selectedInvoice.paymentMethod}</span>
                    </p>
                    {selectedInvoice.paymentDate && (
                      <p className="text-sm text-muted-foreground">
                        Tanggal bayar: {formatDate(selectedInvoice.paymentDate)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                {selectedInvoice.paymentStatus !== "paid" && (
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

      {/* Create Invoice Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Invoice Baru</DialogTitle>
            <DialogDescription>
              Pilih SPK yang sudah selesai untuk dibuatkan invoice
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={selectedSpkForInvoice} onValueChange={setSelectedSpkForInvoice}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih SPK" />
              </SelectTrigger>
              <SelectContent>
                {completedSPKsWithoutInvoice.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Tidak ada SPK yang tersedia
                  </SelectItem>
                ) : (
                  completedSPKsWithoutInvoice.map((spk) => {
                    const customer = getCustomerById(spk.customerId)
                    return (
                      <SelectItem key={spk.id} value={spk.id}>
                        {spk.spkNumber} - {customer?.name} ({formatCurrency(spk.estimatedCost)})
                      </SelectItem>
                    )
                  })
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleCreateInvoice}
              disabled={!selectedSpkForInvoice || selectedSpkForInvoice === "none"}
            >
              Buat Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Form */}
      <PaymentForm
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        invoice={selectedInvoice}
        onSubmit={handlePaymentSubmit}
      />

      {/* Hidden Print Template */}
      <div className="hidden">
        {selectedInvoice && (
          <InvoicePrintTemplate ref={printRef} invoice={selectedInvoice} />
        )}
      </div>
    </>
  )
}
