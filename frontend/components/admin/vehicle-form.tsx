"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import type { Vehicle, VehicleFormData, Customer } from "@/lib/types"

interface VehicleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle?: Vehicle
  customers: Customer[]
  defaultCustomerId?: string
  onSubmit: (data: VehicleFormData) => Promise<void>
}

const carBrands = [
  "Toyota",
  "Honda",
  "Suzuki",
  "Mitsubishi",
  "Daihatsu",
  "Nissan",
  "Mazda",
  "Hyundai",
  "Kia",
  "BMW",
  "Mercedes-Benz",
  "Volkswagen",
  "Wuling",
  "Lainnya",
]

export function VehicleForm({
  open,
  onOpenChange,
  vehicle,
  customers,
  defaultCustomerId,
  onSubmit,
}: VehicleFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<VehicleFormData>({
    customerId: vehicle?.customerId || defaultCustomerId || "",
    plateNumber: vehicle?.plateNumber || "",
    brand: vehicle?.brand || "",
    model: vehicle?.model || "",
    year: vehicle?.year || new Date().getFullYear(),
    chassisNumber: vehicle?.chassisNumber || "",
    engineNumber: vehicle?.engineNumber || "",
    color: vehicle?.color || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
      onOpenChange(false)
      setFormData({
        customerId: defaultCustomerId || "",
        plateNumber: "",
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        chassisNumber: "",
        engineNumber: "",
        color: "",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{vehicle ? "Edit Kendaraan" : "Tambah Kendaraan Baru"}</DialogTitle>
          <DialogDescription>
            {vehicle
              ? "Ubah data kendaraan di bawah ini"
              : "Isi data kendaraan baru di bawah ini"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel>Pemilik</FieldLabel>
              <Select
                value={formData.customerId}
                onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pemilik kendaraan" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="plateNumber">No. Plat</FieldLabel>
                <Input
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                  placeholder="B 1234 ABC"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="color">Warna</FieldLabel>
                <Input
                  id="color"
                  value={formData.color || ""}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Hitam, Putih, dll"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Merk</FieldLabel>
                <Select
                  value={formData.brand}
                  onValueChange={(value) => setFormData({ ...formData, brand: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih merk" />
                  </SelectTrigger>
                  <SelectContent>
                    {carBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="model">Tipe/Model</FieldLabel>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Avanza, Jazz, dll"
                  required
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="year">Tahun</FieldLabel>
              <Input
                id="year"
                type="number"
                min={1990}
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="chassisNumber">No. Rangka</FieldLabel>
                <Input
                  id="chassisNumber"
                  value={formData.chassisNumber}
                  onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value.toUpperCase() })}
                  placeholder="MHFM1BA3J1K123456"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="engineNumber">No. Mesin</FieldLabel>
                <Input
                  id="engineNumber"
                  value={formData.engineNumber}
                  onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value.toUpperCase() })}
                  placeholder="1NR-FE1234567"
                  required
                />
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Spinner className="mr-2" />}
              {vehicle ? "Simpan Perubahan" : "Tambah Kendaraan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
