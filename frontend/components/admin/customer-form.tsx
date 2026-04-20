"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import type { Customer, CustomerFormData, CustomerType } from "@/lib/types"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"

interface CustomerFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer
  onSubmit: (data: CustomerFormData) => Promise<void>
}

export function CustomerForm({
  open,
  onOpenChange,
  customer,
  onSubmit,
}: CustomerFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CustomerFormData>({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
    type: customer?.type || "pribadi",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
      onOpenChange(false)
      setFormData({ name: "", email: "", phone: "", address: "", type: "pribadi" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{customer ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}</DialogTitle>
          <DialogDescription>
            {customer
              ? "Ubah data pelanggan di bawah ini"
              : "Isi data pelanggan baru di bawah ini"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama lengkap"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Nomor Telepon</FieldLabel>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08123456789"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="address">Alamat</FieldLabel>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Alamat lengkap"
                rows={3}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Tipe Pelanggan</FieldLabel>
              <RadioGroup
                value={formData.type}
                onValueChange={(value: CustomerType) =>
                  setFormData({ ...formData, type: value })
                }
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="pribadi" id="pribadi" />
                  <Label htmlFor="pribadi" className="cursor-pointer">Pribadi</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="korporat" id="korporat" />
                  <Label htmlFor="korporat" className="cursor-pointer">Korporat</Label>
                </div>
              </RadioGroup>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Spinner className="mr-2" />}
              {customer ? "Simpan Perubahan" : "Tambah Pelanggan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
