'use client'

import { 
  FileText, 
  CheckCircle, 
  DollarSign, 
  TrendingUp,
  Clock,
  AlertTriangle 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardStats as DashboardStatsType } from '@/types'

interface DashboardStatsProps {
  stats: DashboardStatsType | undefined
  isLoading: boolean
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const statCards = [
    {
      title: 'SPK Aktif',
      value: stats?.total_spk_aktif || 0,
      icon: FileText,
      description: 'Sedang dikerjakan',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Selesai Hari Ini',
      value: stats?.total_spk_selesai_hari_ini || 0,
      icon: CheckCircle,
      description: 'SPK selesai',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pendapatan Hari Ini',
      value: formatCurrency(stats?.total_pendapatan_hari_ini || 0),
      icon: DollarSign,
      description: 'Total transaksi',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      isPrice: true,
    },
    {
      title: 'Pendapatan Bulan Ini',
      value: formatCurrency(stats?.total_pendapatan_bulan_ini || 0),
      icon: TrendingUp,
      description: 'Akumulasi bulan berjalan',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      isPrice: true,
    },
    {
      title: 'Menunggu Part',
      value: stats?.spk_menunggu_part || 0,
      icon: Clock,
      description: 'SPK pending sparepart',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Stok Kritis',
      value: stats?.stok_kritis || 0,
      icon: AlertTriangle,
      description: 'Perlu restok',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`rounded-full p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.isPrice ? 'text-lg' : ''}`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
