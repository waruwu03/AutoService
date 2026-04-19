'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Loader2, CalendarIcon, CreditCard, Banknote, Smartphone, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Invoice, PaymentFormData, PaymentMethod } from '@/types'

const paymentSchema = z.object({
  invoice_id: z.number(),
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  jumlah: z.number().min(1, 'Jumlah pembayaran wajib diisi'),
  metode: z.enum(['cash', 'transfer', 'debit', 'credit', 'qris']),
  referensi: z.string().optional(),
  catatan: z.string().optional(),
})

interface PaymentFormProps {
  invoice: Invoice
  onSubmit: (data: PaymentFormData) => Promise<void>
  isSubmitting?: boolean
}

const paymentMethods: { value: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { value: 'cash', label: 'Tunai', icon: Banknote },
  { value: 'transfer', label: 'Transfer Bank', icon: Building },
  { value: 'debit', label: 'Kartu Debit', icon: CreditCard },
  { value: 'credit', label: 'Kartu Kredit', icon: CreditCard },
  { value: 'qris', label: 'QRIS', icon: Smartphone },
]

export function PaymentForm({ invoice, onSubmit, isSubmitting }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoice_id: invoice.id,
      tanggal: format(new Date(), 'yyyy-MM-dd'),
      jumlah: invoice.sisa_bayar,
      metode: 'cash',
      referensi: '',
      catatan: '',
    },
  })

  const tanggal = watch('tanggal')
  const metode = watch('metode')
  const jumlah = watch('jumlah')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Invoice Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Invoice</CardTitle>
            <CardDescription>Invoice #{invoice.nomor_invoice}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Total Invoice</span>
                <span className="font-medium">{formatCurrency(invoice.grand_total)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Sudah Dibayar</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(invoice.jumlah_dibayar)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Sisa Bayar</span>
                <span className="font-bold text-lg text-destructive">
                  {formatCurrency(invoice.sisa_bayar)}
                </span>
              </div>
              {jumlah > 0 && (
                <div className="flex justify-between py-2 bg-muted rounded-md px-3">
                  <span className="text-muted-foreground">Setelah Pembayaran Ini</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(Math.max(0, invoice.sisa_bayar - jumlah))}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Pembayaran</CardTitle>
            <CardDescription>Masukkan informasi pembayaran</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Tanggal Pembayaran</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tanggal ? format(new Date(tanggal), 'dd MMMM yyyy') : 'Pilih tanggal'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={tanggal ? new Date(tanggal) : undefined}
                      onSelect={(date) => {
                        if (date) setValue('tanggal', format(date, 'yyyy-MM-dd'))
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.tanggal && <FieldError>{errors.tanggal.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Jumlah Pembayaran</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  max={invoice.sisa_bayar}
                  {...register('jumlah', { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Maksimal: {formatCurrency(invoice.sisa_bayar)}
                </p>
                {errors.jumlah && <FieldError>{errors.jumlah.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Metode Pembayaran</FieldLabel>
                <Select
                  value={metode}
                  onValueChange={(value: PaymentMethod) => setValue('metode', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih metode pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center gap-2">
                          <method.icon className="h-4 w-4" />
                          {method.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.metode && <FieldError>{errors.metode.message}</FieldError>}
              </Field>

              {metode !== 'cash' && (
                <Field>
                  <FieldLabel>Nomor Referensi</FieldLabel>
                  <Input
                    placeholder="No. transaksi/approval code"
                    {...register('referensi')}
                  />
                  {errors.referensi && <FieldError>{errors.referensi.message}</FieldError>}
                </Field>
              )}

              <Field>
                <FieldLabel>Catatan (opsional)</FieldLabel>
                <Textarea
                  placeholder="Catatan tambahan..."
                  rows={2}
                  {...register('catatan')}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            'Terima Pembayaran'
          )}
        </Button>
      </div>
    </form>
  )
}
