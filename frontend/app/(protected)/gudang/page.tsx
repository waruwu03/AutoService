'use client'

import useSWR from 'swr'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { GudangStats } from '@/components/gudang/GudangStats'
import { StockAlertList } from '@/components/gudang/StockAlertList'
import { RecentMovementList } from '@/components/gudang/RecentMovementList'
import { fetcher } from '@/lib/api-client'
import { useAuth } from '@/hooks/useAuth'

interface GudangDashboardStats {
  total_items: number
  total_value: number
  low_stock_count: number
  out_of_stock_count: number
  incoming_today: number
  outgoing_today: number
}

interface StockAlert {
  id: number
  code: string
  name: string
  stock: number
  min_stock: number
  unit: string
}

interface RecentMovement {
  id: number
  type: 'in' | 'out'
  item_name: string
  quantity: number
  date: string
  reference: string
}

export default function GudangDashboardPage() {
  const { user } = useAuth()

  const { data: stats, isLoading: statsLoading } = useSWR<GudangDashboardStats>(
    '/gudang/stats',
    fetcher
  )

  const { data: alerts } = useSWR<StockAlert[]>(
    '/gudang/alerts',
    fetcher
  )

  const { data: movements } = useSWR<RecentMovement[]>(
    '/gudang/recent-movements',
    fetcher
  )

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Gudang</h1>
        <p className="text-muted-foreground">
          Selamat datang, {user?.nama} - {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}
        </p>
      </div>

      {/* Stats */}
      <GudangStats
        totalItems={stats?.total_items || 0}
        totalValue={stats?.total_value || 0}
        incomingToday={stats?.incoming_today || 0}
        outgoingToday={stats?.outgoing_today || 0}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stock Alerts */}
        <StockAlertList
          alerts={alerts || []}
          lowStockCount={stats?.low_stock_count || 0}
          outOfStockCount={stats?.out_of_stock_count || 0}
        />

        {/* Recent Movements */}
        <RecentMovementList movements={movements || []} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/gudang/masuk/create">
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Tambah Barang Masuk
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/gudang/keluar/create">
                <ArrowUpFromLine className="mr-2 h-4 w-4" />
                Catat Barang Keluar
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/gudang/stok">
                <Boxes className="mr-2 h-4 w-4" />
                Lihat Semua Stok
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
