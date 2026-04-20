"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Spinner } from "@/components/ui/spinner"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/mock-data"
import type { Invoice, PaymentFormData } from "@/lib/types"

interface PaymentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  onSubmit: (invoiceId: string, data: PaymentFormData) => Promise<void>
}

const paymentMethods = [
  "Tunai",
  "Transfer Bank",
  "Kartu Debit",
  "Kartu Kredit",
  "QRIS",
  "E-Wallet",
]

export function PaymentForm({
  open,
  onOpenChange,
  invoice,
  onSubmit,
}: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: 0,
    method: "",
    discount: 0,
    notes: "",
  })

  if (!invoice) return null

  const remainingAmount = invoice.total - invoice.paidAmount - (formData.discount || 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(invoice.id, formData)
      onOpenChange(false)
      setFormData({ amount: 0, method: "", discount: 0, notes: "" })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayFull = () => {
    setFormData((prev) => ({ ...prev, amount: remainingAmount }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Input Pembayaran</DialogTitle>
          <DialogDescription>
            Invoice: {invoice.invoiceNumber}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="py-4">
            {/* Invoice Summary */}
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pajak (10%)</span>
                <span>{formatCurrency(invoice.tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Diskon Sebelumnya</span>
                <span>-{formatCurrency(invoice.discount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sudah Dibayar</span>
                <span className="text-green-600">-{formatCurrency(invoice.paidAmount)}</span>
              </div>
            </div>

            <Separator />

            <Field>
              <FieldLabel htmlFor="discount">Diskon Tambahan (Opsional)</FieldLabel>
              <Input
                id="discount"
                type="number"
                min={0}
                max={remainingAmount}
                value={formData.discount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </Field>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="font-medium">Sisa yang Harus Dibayar</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(Math.max(0, remainingAmount))}
                </span>
              </div>
            </div>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="amount">Jumlah Pembayaran</FieldLabel>
                <Button type="button" variant="link" size="sm" onClick={handlePayFull}>
                  Bayar Penuh
                </Button>
              </div>
              <Input
                id="amount"
                type="number"
                min={0}
                value={formData.amount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
                placeholder="Masukkan jumlah"
                required
              />
            </Field>

            <Field>
              <FieldLabel>Metode Pembayaran</FieldLabel>
              <Select
                value={formData.method}
                onValueChange={(value) => setFormData({ ...formData, method: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih metode pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Catatan (Opsional)</FieldLabel>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Catatan pembayaran..."
                rows={2}
              />
            </Field>

            {/* Change calculation */}
            {formData.amount > remainingAmount && (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex justify-between text-sm">
                  <span>Kembalian</span>
                  <span className="font-medium">
                    {formatCurrency(formData.amount - remainingAmount)}
                  </span>
                </div>
              </div>
            )}
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || formData.amount <= 0 || !formData.method}
            >
              {isLoading && <Spinner className="mr-2" />}
              Proses Pembayaran
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
