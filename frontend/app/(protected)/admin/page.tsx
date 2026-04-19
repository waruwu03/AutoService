'use client'

import { useApiGet } from '@/hooks/useApi'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { RecentSPKTable } from '@/components/admin/RecentSPKTable'
import { ActivityLog } from '@/components/admin/ActivityLog'
import type { DashboardStats as DashboardStatsType, SPK, ActivityLog as ActivityLogType } from '@/types'

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useApiGet<DashboardStatsType>('/dashboard/stats')
  const { data: recentSPK, isLoading: spkLoading } = useApiGet<SPK[]>('/spk?limit=5&sort=-created_at')
  const { data: activities, isLoading: activitiesLoading } = useApiGet<ActivityLogType[]>('/activities?limit=10')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Selamat datang di panel admin AutoServis
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} isLoading={statsLoading} />

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentSPKTable data={recentSPK || []} isLoading={spkLoading} />
        </div>
        <div>
          <ActivityLog data={activities || []} isLoading={activitiesLoading} />
        </div>
      </div>
    </div>
  )
}
