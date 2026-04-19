'use client'

import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import { 
  FileText, 
  UserPlus, 
  Car, 
  Receipt, 
  Package,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import type { ActivityLog as ActivityLogType } from '@/types'

interface ActivityLogProps {
  data: ActivityLogType[]
  isLoading: boolean
}

const actionIcons: Record<string, React.ElementType> = {
  'spk.created': FileText,
  'spk.updated': Edit,
  'spk.deleted': Trash2,
  'customer.created': UserPlus,
  'customer.updated': Edit,
  'vehicle.created': Car,
  'vehicle.updated': Edit,
  'invoice.created': Receipt,
  'invoice.paid': Receipt,
  'sparepart.created': Package,
  'sparepart.updated': Edit,
  'stock.adjusted': Package,
}

const actionLabels: Record<string, string> = {
  'spk.created': 'membuat SPK baru',
  'spk.updated': 'mengubah SPK',
  'spk.deleted': 'menghapus SPK',
  'customer.created': 'menambah pelanggan baru',
  'customer.updated': 'mengubah data pelanggan',
  'vehicle.created': 'menambah kendaraan baru',
  'vehicle.updated': 'mengubah data kendaraan',
  'invoice.created': 'membuat invoice baru',
  'invoice.paid': 'menerima pembayaran invoice',
  'sparepart.created': 'menambah sparepart baru',
  'sparepart.updated': 'mengubah data sparepart',
  'stock.adjusted': 'melakukan penyesuaian stok',
}

export function ActivityLog({ data, isLoading }: ActivityLogProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>Log aktivitas sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>Log aktivitas sistem</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {data.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Belum ada aktivitas
            </p>
          ) : (
            <div className="space-y-4">
              {data.map((activity) => {
                const Icon = actionIcons[activity.action] || Plus
                const label = actionLabels[activity.action] || activity.action
                
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user?.nama || 'System'}</span>
                        {' '}
                        <span className="text-muted-foreground">{label}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
