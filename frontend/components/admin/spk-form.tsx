"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Separator } from "@/components/ui/separator"
import {
  mockCustomers,
  mockMechanics,
  getVehiclesByCustomerId,
  serviceCatalog,
  partsCatalog,
  formatCurrency,
  generateSPKNumber,
} from "@/lib/mock-data"
import type { SPKFormData, ServiceItem, Vehicle } from "@/lib/types"

interface SPKFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: SPKFormData) => Promise<void>
}

export function SPKForm({ open, onOpenChange, onSubmit }: SPKFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [customerVehicles, setCustomerVehicles] = useState<Vehicle[]>([])
  const [formData, setFormData] = useState<SPKFormData>({
    customerId: "",
    vehicleId: "",
    mechanicId: "",
    services: [],
    parts: [],
    notes: "",
  })

  useEffect(() => {
    if (selectedCustomerId) {
      const vehicles = getVehiclesByCustomerId(selectedCustomerId)
      setCustomerVehicles(vehicles)
      setFormData((prev) => ({
        ...prev,
        customerId: selectedCustomerId,
        vehicleId: vehicles.length === 1 ? vehicles[0].id : "",
      }))
    } else {
      setCustomerVehicles([])
    }
  }, [selectedCustomerId])

  const addService = (catalogItem: typeof serviceCatalog[0]) => {
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: catalogItem.name,
      description: catalogItem.description,
      price: catalogItem.price,
      quantity: 1,
    }
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }))
  }

  const addPart = (catalogItem: typeof partsCatalog[0]) => {
    const newPart: ServiceItem = {
      id: `prt-${Date.now()}`,
      name: catalogItem.name,
      price: catalogItem.price,
      quantity: 1,
    }
    setFormData((prev) => ({
      ...prev,
      parts: [...prev.parts, newPart],
    }))
  }

  const updateServiceQuantity = (id: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((s) =>
        s.id === id ? { ...s, quantity: Math.max(1, quantity) } : s
      ),
    }))
  }

  const updatePartQuantity = (id: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      parts: prev.parts.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, quantity) } : p
      ),
    }))
  }

  const removeService = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }))
  }

  const removePart = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      parts: prev.parts.filter((p) => p.id !== id),
    }))
  }

  const calculateTotal = () => {
    const servicesTotal = formData.services.reduce(
      (sum, s) => sum + s.price * s.quantity,
      0
    )
    const partsTotal = formData.parts.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    )
    return servicesTotal + partsTotal
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
      onOpenChange(false)
      resetForm()
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedCustomerId("")
    setFormData({
      customerId: "",
      vehicleId: "",
      mechanicId: "",
      services: [],
      parts: [],
      notes: "",
    })
  }

  const availableMechanics = mockMechanics.filter((m) => m.status === "available")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat SPK Baru</DialogTitle>
          <DialogDescription>
            No. SPK: {generateSPKNumber()} (akan dibuat otomatis)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="py-4">
            {/* Customer & Vehicle Selection */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Pelanggan</FieldLabel>
                <Select
                  value={selectedCustomerId}
                  onValueChange={setSelectedCustomerId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pelanggan" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCustomers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Kendaraan</FieldLabel>
                <Select
                  value={formData.vehicleId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, vehicleId: value }))
                  }
                  disabled={!selectedCustomerId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kendaraan" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.plateNumber} - {vehicle.brand} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>Mekanik (Opsional)</FieldLabel>
              <Select
                value={formData.mechanicId || "unassigned"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    mechanicId: value === "unassigned" ? "" : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih mekanik" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Belum ditugaskan</SelectItem>
                  {availableMechanics.map((mechanic) => (
                    <SelectItem key={mechanic.id} value={mechanic.id}>
                      {mechanic.name} - {mechanic.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Separator className="my-4" />

            {/* Services */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <FieldLabel className="text-base">Layanan Servis</FieldLabel>
                <Select onValueChange={(value) => {
                  const item = serviceCatalog.find((s) => s.name === value)
                  if (item) addService(item)
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tambah layanan" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCatalog.map((service) => (
                      <SelectItem key={service.name} value={service.name}>
                        {service.name} - {formatCurrency(service.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.services.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  Belum ada layanan dipilih
                </p>
              ) : (
                <div className="space-y-2">
                  {formData.services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(service.price)} x {service.quantity}
                        </p>
                      </div>
                      <Input
                        type="number"
                        min={1}
                        value={service.quantity}
                        onChange={(e) =>
                          updateServiceQuantity(service.id, parseInt(e.target.value) || 1)
                        }
                        className="w-20"
                      />
                      <p className="w-28 text-right font-medium">
                        {formatCurrency(service.price * service.quantity)}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeService(service.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="my-4" />

            {/* Parts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <FieldLabel className="text-base">Spare Parts</FieldLabel>
                <Select onValueChange={(value) => {
                  const item = partsCatalog.find((p) => p.name === value)
                  if (item) addPart(item)
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tambah part" />
                  </SelectTrigger>
                  <SelectContent>
                    {partsCatalog.map((part) => (
                      <SelectItem key={part.name} value={part.name}>
                        {part.name} - {formatCurrency(part.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {formData.parts.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  Belum ada part dipilih
                </p>
              ) : (
                <div className="space-y-2">
                  {formData.parts.map((part) => (
                    <div
                      key={part.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{part.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(part.price)} x {part.quantity}
                        </p>
                      </div>
                      <Input
                        type="number"
                        min={1}
                        value={part.quantity}
                        onChange={(e) =>
                          updatePartQuantity(part.id, parseInt(e.target.value) || 1)
                        }
                        className="w-20"
                      />
                      <p className="w-28 text-right font-medium">
                        {formatCurrency(part.price * part.quantity)}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePart(part.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator className="my-4" />

            {/* Notes */}
            <Field>
              <FieldLabel htmlFor="notes">Catatan</FieldLabel>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Catatan tambahan..."
                rows={3}
              />
            </Field>

            {/* Total */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
              <span className="font-medium">Total Estimasi</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(calculateTotal())}
              </span>
            </div>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.customerId ||
                !formData.vehicleId ||
                (formData.services.length === 0 && formData.parts.length === 0)
              }
            >
              {isLoading && <Spinner className="mr-2" />}
              Buat SPK
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
