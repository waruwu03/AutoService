'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  Clock,
  Play,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MekanikStats } from '@/components/mekanik/MekanikStats'
import { ActiveTaskCard, PendingTaskCard } from '@/components/mekanik/TaskCard'
import { TaskActionDialog } from '@/components/mekanik/TaskActionDialog'
import type { MekanikTask } from '@/components/mekanik/types'
import { fetcher, apiClient } from '@/lib/api-client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export default function MekanikDashboardPage() {
  const { user } = useAuth()
  const [selectedTask, setSelectedTask] = useState<MekanikTask | null>(null)
  const [actionType, setActionType] = useState<'start' | 'pause' | 'complete' | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: tasks, isLoading, mutate } = useSWR<MekanikTask[]>(
    `/mekanik/tasks`,
    fetcher
  )

  const activeTasks = tasks?.filter(t => t.work_status === 'in_progress') || []
  const pendingTasks = tasks?.filter(t => t.work_status === 'pending') || []
  const completedToday = tasks?.filter(t => 
    t.work_status === 'completed' && 
    t.completed_at && 
    new Date(t.completed_at).toDateString() === new Date().toDateString()
  ) || []

  const handleAction = async () => {
    if (!selectedTask || !actionType) return

    setIsSubmitting(true)
    try {
      await apiClient.post(`/mekanik/tasks/${selectedTask.id}/${actionType}`, { notes })
      toast.success(
        actionType === 'start' ? 'Pekerjaan dimulai' :
        actionType === 'pause' ? 'Pekerjaan dijeda' :
        'Pekerjaan selesai'
      )
      mutate()
      setSelectedTask(null)
      setActionType(null)
      setNotes('')
    } catch (error) {
      toast.error('Gagal memproses aksi')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTaskAction = (task: MekanikTask, action: 'start' | 'pause' | 'complete') => {
    setSelectedTask(task)
    setActionType(action)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Selamat Datang, {user?.nama}</h1>
        <p className="text-muted-foreground">Dashboard Mekanik - {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}</p>
      </div>

      {/* Stats */}
      <MekanikStats
        activeCount={activeTasks.length}
        pendingCount={pendingTasks.length}
        completedTodayCount={completedToday.length}
        totalCount={tasks?.length || 0}
      />

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Play className="h-5 w-5" />
              Sedang Dikerjakan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeTasks.map((task) => (
              <ActiveTaskCard key={task.id} task={task} onAction={handleTaskAction} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tugas Menunggu
          </CardTitle>
          <CardDescription>Tugas yang ditugaskan kepada Anda</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada tugas menunggu
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <PendingTaskCard key={task.id} task={task} onAction={handleTaskAction} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <TaskActionDialog
        task={selectedTask}
        actionType={actionType}
        notes={notes}
        isSubmitting={isSubmitting}
        onNotesChange={setNotes}
        onConfirm={handleAction}
        onClose={() => {
          setSelectedTask(null)
          setActionType(null)
          setNotes('')
        }}
      />
    </div>
  )
}
