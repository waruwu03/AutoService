"use client"

import { Eye, Printer, MoreHorizontal, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getCustomerById,
  getSPKById,
  getVehicleById,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data"
import type { Invoice, PaymentStatus } from "@/lib/types"

interface InvoiceTableProps {
  invoices: Invoice[]
  onView: (invoice: Invoice) => void
  onPayment: (invoice: Invoice) => void
  onPrint: (invoice: Invoice) => void
}

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  unpaid: { label: "Belum Bayar", variant: "destructive" },
  partial: { label: "Sebagian", variant: "secondary" },
  paid: { label: "Lunas", variant: "outline" },
}

export function InvoiceTable({
  invoices,
  onView,
  onPayment,
  onPrint,
}: InvoiceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No. Invoice</TableHead>
          <TableHead>No. SPK</TableHead>
          <TableHead>Pelanggan</TableHead>
          <TableHead>Kendaraan</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
              Tidak ada invoice ditemukan
            </TableCell>
          </TableRow>
        ) : (
          invoices.map((invoice) => {
            const spk = getSPKById(invoice.spkId)
            const customer = getCustomerById(invoice.customerId)
            const vehicle = spk ? getVehicleById(spk.vehicleId) : null
            const status = paymentStatusConfig[invoice.paymentStatus]

            return (
              <TableRow key={invoice.id}>
                <TableCell>
                  <button
                    onClick={() => onView(invoice)}
                    className="font-medium text-primary hover:underline"
                  >
                    {invoice.invoiceNumber}
                  </button>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {spk?.spkNumber || "-"}
                </TableCell>
                <TableCell>{customer?.name || "-"}</TableCell>
                <TableCell>
                  {vehicle ? (
                    <div>
                      <p className="font-mono text-sm">{vehicle.plateNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {vehicle.brand} {vehicle.model}
                      </p>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(invoice.total)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    {invoice.paymentStatus === "partial" && (
                      <span className="text-xs text-muted-foreground">
                        Dibayar: {formatCurrency(invoice.paidAmount)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(invoice.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(invoice)}>
                        <Eye className="mr-2 size-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                      {invoice.paymentStatus !== "paid" && (
                        <DropdownMenuItem onClick={() => onPayment(invoice)}>
                          <CreditCard className="mr-2 size-4" />
                          Input Pembayaran
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onPrint(invoice)}>
                        <Printer className="mr-2 size-4" />
                        Cetak Invoice
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
