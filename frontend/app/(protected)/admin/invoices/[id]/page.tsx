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
  draft: { label: 'Draft', variant: 'outline' },
  unpaid: { label: 'Belum Bayar', variant: 'destructive' },
  partial: { label: 'Sebagian', variant: 'secondary', className: 'bg-orange-500 text-white' },
  paid: { label: 'Lunas', variant: 'default', className: 'bg-green-500' },
  cancelled: { label: 'Dibatalkan', variant: 'destructive' },
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

  const status = statusConfig[invoice.status]
  const paymentProgress = invoice.grand_total > 0 
    ? (invoice.jumlah_dibayar / invoice.grand_total) * 100 
    : 0

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
          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
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
                  {format(new Date(invoice.tanggal), 'dd MMMM yyyy', { locale: idLocale })}
                </div>
              </div>
            </div>
            {invoice.jatuh_tempo && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Jatuh Tempo</div>
                  <div className="font-medium">
                    {format(new Date(invoice.jatuh_tempo), 'dd MMMM yyyy', { locale: idLocale })}
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
                <span className="font-medium">{formatCurrency(invoice.grand_total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dibayar</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(invoice.jumlah_dibayar)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sisa</span>
                <span className="font-bold text-lg">
                  {formatCurrency(invoice.sisa_bayar)}
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
                        <div className="font-medium">{item.nama_item}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.tipe === 'jasa' ? 'Jasa' : 'Sparepart'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.harga_satuan)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className="text-right">Subtotal Jasa</TableCell>
                  <TableCell className="text-right">{formatCurrency(invoice.total_jasa)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} className="text-right">Subtotal Sparepart</TableCell>
                  <TableCell className="text-right">{formatCurrency(invoice.total_sparepart)}</TableCell>
                </TableRow>
                {invoice.diskon > 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-right">Diskon</TableCell>
                    <TableCell className="text-right text-destructive">
                      -{formatCurrency(invoice.diskon)}
                    </TableCell>
                  </TableRow>
                )}
                {invoice.ppn > 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-right">PPN (11%)</TableCell>
                    <TableCell className="text-right">{formatCurrency(invoice.ppn)}</TableCell>
                  </TableRow>
                )}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={4} className="text-right font-bold text-lg">Grand Total</TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    {formatCurrency(invoice.grand_total)}
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
                        {format(new Date(payment.tanggal), 'dd MMM yyyy HH:mm', { locale: idLocale })}
                      </TableCell>
                      <TableCell className="capitalize">{payment.metode}</TableCell>
                      <TableCell>{payment.referensi || '-'}</TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {formatCurrency(payment.jumlah)}
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
