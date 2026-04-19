'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { Sparepart } from '@/types'

interface StokEditDialogProps {
  item: Sparepart | null
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export function StokEditDialog({ item, isSubmitting, onSubmit, onClose }: StokEditDialogProps) {
  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Stok - {item?.nama}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Stok Saat Ini</FieldLabel>
                <Input
                  name="stock"
                  type="number"
                  defaultValue={item?.stok}
                  min={0}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Stok Minimum</FieldLabel>
                <Input
                  name="min_stock"
                  type="number"
                  defaultValue={item?.stok_minimum}
                  min={0}
                  required
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Harga Beli</FieldLabel>
                <Input
                  name="buy_price"
                  type="number"
                  defaultValue={item?.harga_beli}
                  min={0}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Harga Jual</FieldLabel>
                <Input
                  name="sell_price"
                  type="number"
                  defaultValue={item?.harga_jual}
                  min={0}
                  required
                />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
