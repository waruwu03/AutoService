import type { SPK } from '@/types'

export interface MekanikTask extends SPK {
  work_status: 'pending' | 'in_progress' | 'completed'
  priority?: 'low' | 'normal' | 'high'
  started_at?: string
  completed_at?: string
}
