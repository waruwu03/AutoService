'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { 
  ArrowLeft, 
  Printer, 
  CreditCard, 
  Receipt, 
  User, 
  Car,
  Calendar,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { useApiGet } from '@/hooks/useApi'
import type { Invoice, InvoiceStatus } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

const statusConfig: Record<InvoiceStatus, { 
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}> = {
  DRAFT: { label: 'Draft', variant: 'outline' },
  SENT: { label: 'Dikirim', variant: 'outline' },
  PARTIAL: { label: 'Sebagian', variant: 'secondary', className: 'bg-orange-500 text-white' },
  PAID: { label: 'Lunas', variant: 'default', className: 'bg-green-500' },
  CANCELLED: { label: 'Dibatalkan', variant: 'destructive' },
  OVERDUE: { label: 'Jatuh Tempo', variant: 'destructive' },
  REFUNDED: { label: 'Dikembalikan', variant: 'outline' },
}

export default function InvoiceDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: invoice, isLoading, error } = useApiGet<Invoice>(`/invoices/${id}`)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Invoice tidak ditemukan</p>
        <Button asChild variant="outline">
          <Link href="/admin/invoices">Kembali ke Daftar Invoice</Link>
        </Button>
      </div>
    )
  }

  const status = statusConfig[invoice.status] || { label: 'Unknown', variant: 'outline' }
  const gt = Number((invoice as any).grand_total ?? (invoice as any).grandTotal ?? 0);
  const paid = Number((invoice as any).jumlah_dibayar ?? (invoice as any).amountPaid ?? 0);
  const paymentProgress = gt > 0 ? (paid / gt) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{invoice.nomor_invoice}</h2>
              <Badge variant={status.variant} className={status.className}>
                {status.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {invoice.status !== ('PAID' as any) && invoice.status !== ('CANCELLED' as any) && (
            <Button asChild>
              <Link href={`/admin/invoices/${id}/pay`}>
                <CreditCard className="mr-2 h-4 w-4" />
                Terima Pembayaran
              </Link>
            </Button>
          )}
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Cetak
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer & Vehicle */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pelanggan & Kendaraan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoice.spk?.customer && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">{invoice.spk.customer.nama}</div>
                  <div className="text-sm text-muted-foreground">{invoice.spk.customer.telepon}</div>
                </div>
              </div>
            )}
            {invoice.spk?.vehicle && (
              <div className="flex items-start gap-3">
                <Car className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-mono font-bold">{invoice.spk.vehicle.nomor_polisi}</div>
                  <div className="text-sm text-muted-foreground">
                    {invoice.spk.vehicle.merk} {invoice.spk.vehicle.model}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Invoice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Receipt className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">No. SPK</div>
                <Link 
                  href={`/admin/spk/${invoice.spk_id}`}
                  className="font-mono text-primary hover:underline"
                >
                  {invoice.spk?.nomor_spk}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Tanggal Invoice</div>
                <div className="font-medium">
                  {format(new Date((invoice as any).tanggal || (invoice as any).createdAt || new Date()), 'dd MMMM yyyy', { locale: idLocale })}
                </div>
              </div>
            </div>
            {invoice.jatuh_tempo && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Jatuh Tempo</div>
                  <div className="font-medium">
                    {format(new Date((invoice as any).jatuh_tempo || (invoice as any).dueDate || new Date()), 'dd MMMM yyyy', { locale: idLocale })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{Math.round(paymentProgress)}%</span>
              </div>
              <Progress value={paymentProgress} className="h-3" />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">{formatCurrency(Number((invoice as any).grand_total ?? (invoice as any).grandTotal ?? 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dibayar</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(Number((invoice as any).jumlah_dibayar ?? (invoice as any).amountPaid ?? 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sisa</span>
                <span className="font-bold text-lg">
                  {formatCurrency(Number((invoice as any).sisa_bayar ?? (invoice as any).amountDue ?? 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Rincian Tagihan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.spk?.items?.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{(item as any).nama_item ?? (item as any).service?.name ?? (item as any).sparepart?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(item as any).tipe === 'jasa' || (item as any).service ? 'Jasa' : 'Sparepart'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(Number((item as any).harga_satuan ?? (item as any).price ?? 0))}</TableCell>
                    <TableCell className="text-right">{formatCurrency(Number((item as any).subtotal ?? (item as any).totalPrice ?? 0))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="text-right">Subtotal Jasa</TableCell>
                  <TableCell className="text-right">{formatCurrency(Number((invoice as any).total_jasa ?? 0))}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} className="text-right">Subtotal Sparepart</TableCell>
                  <TableCell className="text-right">{formatCurrency(Number((invoice as any).total_sparepart ?? 0))}</TableCell>
                </TableRow>
                {((invoice as any).diskon || (invoice as any).discountAmount) > 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-right">Diskon</TableCell>
                    <TableCell className="text-right text-destructive">
                      -{formatCurrency(Number((invoice as any).diskon ?? (invoice as any).discountAmount ?? 0))}
                    </TableCell>
                  </TableRow>
                )}
                {((invoice as any).ppn || (invoice as any).taxAmount) > 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-right">PPN (11%)</TableCell>
                    <TableCell className="text-right">{formatCurrency(Number((invoice as any).ppn ?? (invoice as any).taxAmount ?? 0))}</TableCell>
                  </TableRow>
                )}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={4} className="text-right font-bold text-lg">Grand Total</TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    {formatCurrency(Number((invoice as any).grand_total ?? (invoice as any).grandTotal ?? 0))}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      {invoice.payments && invoice.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Metode</TableHead>
                    <TableHead>Referensi</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {format(new Date((payment as any).tanggal || (payment as any).paymentDate || new Date()), 'dd MMM yyyy HH:mm', { locale: idLocale })}
                      </TableCell>
                      <TableCell className="capitalize">{(payment as any).metode || (payment as any).paymentMethod}</TableCell>
                      <TableCell>{(payment as any).referensi || (payment as any).referenceNumber || '-'}</TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {formatCurrency(Number((payment as any).jumlah ?? (payment as any).amount ?? 0))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
