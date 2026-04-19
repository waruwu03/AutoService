'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { 
  Eye, 
  MoreHorizontal,
  Printer,
  CreditCard,
  Receipt,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import type { Invoice, InvoiceStatus } from '@/types'

interface InvoiceTableProps {
  data: Invoice[]
  isLoading: boolean
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

export function InvoiceTable({ data, isLoading }: InvoiceTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No. Invoice</TableHead>
            <TableHead>No. SPK</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Pelanggan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Pembayaran</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                Belum ada data invoice
              </TableCell>
            </TableRow>
          ) : (
            data.map((invoice) => {
              const status = statusConfig[invoice.status]
              const paymentProgress = invoice.grand_total > 0 
                ? (invoice.jumlah_dibayar / invoice.grand_total) * 100 
                : 0

              return (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono font-medium">{invoice.nomor_invoice}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {invoice.spk ? (
                      <Link 
                        href={`/admin/spk/${invoice.spk_id}`}
                        className="font-mono text-primary hover:underline"
                      >
                        {invoice.spk.nomor_spk}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.tanggal), 'dd MMM yyyy', { locale: id })}
                  </TableCell>
                  <TableCell>
                    {invoice.spk?.customer?.nama || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant} className={status.className}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(invoice.grand_total)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Progress value={paymentProgress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatCurrency(invoice.jumlah_dibayar)}</span>
                        <span>{Math.round(paymentProgress)}%</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Aksi</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/invoices/${invoice.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </Link>
                        </DropdownMenuItem>
                        {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/invoices/${invoice.id}/pay`}>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Terima Pembayaran
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Printer className="mr-2 h-4 w-4" />
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
    </div>
  )
}
