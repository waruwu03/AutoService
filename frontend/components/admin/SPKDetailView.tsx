'use client'

import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { 
  Car, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  Wrench,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import type { SPK, SPKStatus } from '@/types'

interface SPKDetailViewProps {
  spk: SPK
}

const statusConfig: Record<SPKStatus, { 
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  icon: React.ElementType
  className?: string
}> = {
  draft: { label: 'Draft', variant: 'outline', icon: FileText },
  pending: { label: 'Pending', variant: 'secondary', icon: Clock },
  dikerjakan: { label: 'Dikerjakan', variant: 'default', icon: Wrench, className: 'bg-blue-500' },
  selesai: { label: 'Selesai', variant: 'default', icon: CheckCircle, className: 'bg-green-500' },
  dibatalkan: { label: 'Dibatalkan', variant: 'destructive', icon: AlertTriangle },
  menunggu_part: { label: 'Menunggu Part', variant: 'secondary', icon: Clock, className: 'bg-orange-500 text-white' },
}

export function SPKDetailView({ spk }: SPKDetailViewProps) {
  const status = statusConfig[spk.status]
  const StatusIcon = status.icon

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{spk.nomor_spk}</h2>
            <Badge variant={status.variant} className={status.className}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {status.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Dibuat pada {format(new Date(spk.created_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Pelanggan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {spk.customer && (
              <>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">{spk.customer.nama}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {spk.customer.tipe}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div>{spk.customer.telepon}</div>
                    {spk.customer.email && (
                      <div className="text-sm text-muted-foreground">{spk.customer.email}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm">{spk.customer.alamat}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Kendaraan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {spk.vehicle && (
              <>
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-mono font-bold text-lg">{spk.vehicle.nomor_polisi}</div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Merk</div>
                  <div className="font-medium">{spk.vehicle.merk}</div>
                  <div className="text-muted-foreground">Model</div>
                  <div className="font-medium">{spk.vehicle.model}</div>
                  <div className="text-muted-foreground">Tahun</div>
                  <div className="font-medium">{spk.vehicle.tahun}</div>
                  <div className="text-muted-foreground">Warna</div>
                  <div className="font-medium">{spk.vehicle.warna}</div>
                  <div className="text-muted-foreground">Transmisi</div>
                  <div className="font-medium capitalize">{spk.vehicle.transmisi}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* SPK Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detail SPK</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Tanggal SPK</div>
                <div className="font-medium">
                  {format(new Date(spk.tanggal), 'dd MMMM yyyy', { locale: id })}
                </div>
              </div>
            </div>
            {spk.estimasi_selesai && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Estimasi Selesai</div>
                  <div className="font-medium">
                    {format(new Date(spk.estimasi_selesai), 'dd MMMM yyyy', { locale: id })}
                  </div>
                </div>
              </div>
            )}
            {spk.mekanik && (
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Mekanik</div>
                  <div className="font-medium">{spk.mekanik.nama}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Keluhan & Diagnosa */}
      <Card>
        <CardHeader>
          <CardTitle>Keluhan & Diagnosa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Keluhan Pelanggan</h4>
            <p className="text-sm bg-muted p-3 rounded-md">{spk.keluhan}</p>
          </div>
          {spk.diagnosa && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Diagnosa</h4>
              <p className="text-sm bg-muted p-3 rounded-md">{spk.diagnosa}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Rincian Pekerjaan</CardTitle>
          <CardDescription>Daftar jasa dan sparepart</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-center">Diskon</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {spk.items?.map((item, index) => {
                  const subtotal = item.quantity * item.harga_satuan
                  const discount = (subtotal * item.diskon) / 100
                  const finalSubtotal = subtotal - discount

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Badge variant={item.tipe === 'jasa' ? 'default' : 'secondary'}>
                          {item.tipe === 'jasa' ? 'Jasa' : 'Sparepart'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item.nama_item}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.harga_satuan)}</TableCell>
                      <TableCell className="text-center">{item.diskon}%</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(finalSubtotal)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={6} className="text-right">Total Jasa</TableCell>
                  <TableCell className="text-right">{formatCurrency(spk.total_jasa)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6} className="text-right">Total Sparepart</TableCell>
                  <TableCell className="text-right">{formatCurrency(spk.total_sparepart)}</TableCell>
                </TableRow>
                {spk.diskon_total > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-right">Diskon</TableCell>
                    <TableCell className="text-right text-destructive">-{formatCurrency(spk.diskon_total)}</TableCell>
                  </TableRow>
                )}
                {spk.ppn > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-right">PPN (11%)</TableCell>
                    <TableCell className="text-right">{formatCurrency(spk.ppn)}</TableCell>
                  </TableRow>
                )}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={6} className="text-right font-bold text-lg">Grand Total</TableCell>
                  <TableCell className="text-right font-bold text-lg">{formatCurrency(spk.grand_total)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
