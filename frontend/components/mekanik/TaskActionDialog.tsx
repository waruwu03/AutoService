'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { MekanikTask } from './types'

interface TaskActionDialogProps {
  task: MekanikTask | null
  actionType: 'start' | 'pause' | 'complete' | null
  notes: string
  isSubmitting: boolean
  onNotesChange: (notes: string) => void
  onConfirm: () => void
  onClose: () => void
}

export function TaskActionDialog({
  task,
  actionType,
  notes,
  isSubmitting,
  onNotesChange,
  onConfirm,
  onClose,
}: TaskActionDialogProps) {
  return (
    <Dialog open={!!task && !!actionType} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === 'start' && 'Mulai Pekerjaan'}
            {actionType === 'pause' && 'Jeda Pekerjaan'}
            {actionType === 'complete' && 'Selesaikan Pekerjaan'}
          </DialogTitle>
          <DialogDescription>
            SPK: {task?.nomor_spk}
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel>Catatan (Opsional)</FieldLabel>
            <Textarea
              placeholder="Tambahkan catatan..."
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={3}
            />
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Konfirmasi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
