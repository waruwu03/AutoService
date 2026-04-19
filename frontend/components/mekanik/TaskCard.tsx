'use client'

import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Car,
  Play,
  Pause,
  Check,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { MekanikTask } from './types'

interface TaskCardProps {
  task: MekanikTask
  onAction: (task: MekanikTask, action: 'start' | 'pause' | 'complete') => void
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'in_progress':
      return <Badge className="bg-blue-100 text-blue-800"><Play className="mr-1 h-3 w-3" />Dikerjakan</Badge>
    case 'completed':
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3" />Selesai</Badge>
    default:
      return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Menunggu</Badge>
  }
}

export function ActiveTaskCard({ task, onAction }: TaskCardProps) {
  return (
    <Card className="bg-background">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold">{task.nomor_spk}</span>
              {getStatusBadge(task.work_status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Car className="h-4 w-4" />
                {task.vehicle?.nomor_polisi} - {task.vehicle?.merk} {task.vehicle?.model}
              </span>
            </div>
            <p className="text-sm">{task.keluhan}</p>
            {task.started_at && (
              <p className="text-xs text-muted-foreground">
                Dimulai: {format(new Date(task.started_at), 'HH:mm, dd MMM yyyy', { locale: id })}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction(task, 'pause')}
            >
              <Pause className="mr-1 h-4 w-4" />
              Jeda
            </Button>
            <Button
              size="sm"
              onClick={() => onAction(task, 'complete')}
            >
              <Check className="mr-1 h-4 w-4" />
              Selesai
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress Pekerjaan</span>
            <span>75%</span>
          </div>
          <Progress value={75} />
        </div>
      </CardContent>
    </Card>
  )
}

export function PendingTaskCard({ task, onAction }: TaskCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold">{task.nomor_spk}</span>
              {getStatusBadge(task.work_status)}
              {task.priority === 'high' && (
                <Badge variant="destructive">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Prioritas Tinggi
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Car className="h-4 w-4" />
                {task.vehicle?.nomor_polisi} - {task.vehicle?.merk} {task.vehicle?.model}
              </span>
            </div>
            <p className="text-sm">{task.keluhan}</p>
            <p className="text-xs text-muted-foreground">
              Diterima: {format(new Date(task.created_at), 'HH:mm, dd MMM yyyy', { locale: id })}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => onAction(task, 'start')}
          >
            <Play className="mr-1 h-4 w-4" />
            Mulai Kerjakan
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
