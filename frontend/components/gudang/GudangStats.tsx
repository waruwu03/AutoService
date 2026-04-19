'use client'

import {
  Package,
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/api-client'

interface GudangStatsProps {
  totalItems: number
  totalValue: number
  incomingToday: number
  outgoingToday: number
}

export function GudangStats({
  totalItems,
  totalValue,
  incomingToday,
  outgoingToday,
}: GudangStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Item</CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
          <p className="text-xs text-muted-foreground">Jenis sparepart</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Nilai Stok</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground">Total nilai inventori</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Masuk Hari Ini</CardTitle>
          <ArrowDownToLine className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{incomingToday}</div>
          <p className="text-xs text-muted-foreground">Transaksi masuk</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Keluar Hari Ini</CardTitle>
          <ArrowUpFromLine className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{outgoingToday}</div>
          <p className="text-xs text-muted-foreground">Transaksi keluar</p>
        </CardContent>
      </Card>
    </div>
  )
}
