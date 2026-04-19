'use client'

import useSWR from 'swr'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'
import { ExecDashboardStats } from '@/components/pimpinan/ExecDashboardStats'
import { RevenueChart } from '@/components/pimpinan/RevenueChart'
import { ServiceDistributionChart } from '@/components/pimpinan/ServiceDistributionChart'
import { SummaryCards } from '@/components/pimpinan/SummaryCards'
import { fetcher } from '@/lib/api-client'
import { useAuth } from '@/hooks/useAuth'

interface DashboardStats {
  revenue: {
    current_month: number
    last_month: number
    growth_percent: number
  }
  spk: {
    total: number
    completed: number
    in_progress: number
  }
  customers: {
    total: number
    new_this_month: number
  }
  invoices: {
    paid: number
    unpaid: number
    total_unpaid_amount: number
  }
}

interface RevenueData {
  date: string
  revenue: number
  expenses: number
}

interface ServiceDistribution {
  name: string
  value: number
  color: string
}

export default function PimpinanDashboardPage() {
  const { user } = useAuth()

  const { data: stats, isLoading: statsLoading } = useSWR<DashboardStats>(
    '/pimpinan/stats',
    fetcher
  )

  const { data: revenueData } = useSWR<RevenueData[]>(
    '/pimpinan/revenue-chart',
    fetcher
  )

  const { data: serviceData } = useSWR<ServiceDistribution[]>(
    '/pimpinan/service-distribution',
    fetcher
  )

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const defaultStats = {
    revenue: { current_month: 0, last_month: 0, growth_percent: 0 },
    spk: { total: 0, completed: 0, in_progress: 0 },
    customers: { total: 0, new_this_month: 0 },
    invoices: { paid: 0, unpaid: 0, total_unpaid_amount: 0 },
  }

  const s = stats || defaultStats

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Eksekutif</h1>
        <p className="text-muted-foreground">
          Selamat datang, {user?.nama} - {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}
        </p>
      </div>

      {/* Key Metrics */}
      <ExecDashboardStats
        revenue={s.revenue}
        spk={s.spk}
        customers={s.customers}
        invoices={s.invoices}
      />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueChart data={revenueData || []} />
        <ServiceDistributionChart data={serviceData || []} />
      </div>

      {/* Quick Summary */}
      <SummaryCards
        spk={s.spk}
        invoices={s.invoices}
        revenue={s.revenue}
      />
    </div>
  )
}
