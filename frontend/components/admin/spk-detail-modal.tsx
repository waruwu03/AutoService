"use client"

import { User, Car, Wrench, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  getCustomerById,
  getVehicleById,
  getMechanicById,
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/lib/mock-data"
import type { SPK, SPKStatus } from "@/lib/types"

interface SPKDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  spk: SPK | null
  onUpdateStatus?: (spkId: string, status: SPKStatus) => void
}

const statusConfig: Record<SPKStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "Draft", variant: "secondary" },
  in_progress: { label: "Dikerjakan", variant: "default" },
  completed: { label: "Selesai", variant: "outline" },
  cancelled: { label: "Dibatalkan", variant: "destructive" },
}

export function SPKDetailModal({
  open,
  onOpenChange,
  spk,
  onUpdateStatus,
}: SPKDetailModalProps) {
  if (!spk) return null

  const customer = getCustomerById(spk.customerId)
  const vehicle = getVehicleById(spk.vehicleId)
  const mechanic = spk.mechanicId ? getMechanicById(spk.mechanicId) : null
  const status = statusConfig[spk.status]

  const servicesTotal = spk.services.reduce((sum, s) => sum + s.price * s.quantity, 0)
  const partsTotal = spk.parts.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const total = servicesTotal + partsTotal

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{spk.spkNumber}</DialogTitle>
              <DialogDescription>
                Dibuat: {formatDateTime(spk.createdAt)}
              </DialogDescription>
            </div>
            <Badge variant={status.variant} className="text-sm">
              {status.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer & Vehicle Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <User className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Pelanggan</span>
              </div>
              {customer && (
                <>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                </>
              )}
            </div>

            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Car className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Kendaraan</span>
              </div>
              {vehicle && (
                <>
                  <p className="font-medium font-mono">{vehicle.plateNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.brand} {vehicle.model} ({vehicle.year})
                  </p>
                  <p className="text-sm text-muted-foreground">{vehicle.color}</p>
                </>
              )}
            </div>
          </div>

          {/* Mechanic & Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Mekanik</span>
              </div>
              {mechanic ? (
                <>
                  <p className="font-medium">{mechanic.name}</p>
                  <p className="text-sm text-muted-foreground">{mechanic.specialization}</p>
                </>
              ) : (
                <p className="text-muted-foreground">Belum ditugaskan</p>
              )}
            </div>

            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Tanggal</span>
              </div>
              <p className="text-sm">
                <span className="text-muted-foreground">Mulai:</span> {formatDate(spk.startDate)}
              </p>
              {spk.estimatedEndDate && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Est. Selesai:</span>{" "}
                  {formatDate(spk.estimatedEndDate)}
                </p>
              )}
              {spk.completedDate && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Selesai:</span>{" "}
                  {formatDate(spk.completedDate)}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Services */}
          <div>
            <h4 className="font-medium mb-3">Layanan Servis</h4>
            {spk.services.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada layanan</p>
            ) : (
              <div className="space-y-2">
                {spk.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(service.price)} x {service.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(service.price * service.quantity)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Subtotal Layanan</span>
                  <span className="font-medium">{formatCurrency(servicesTotal)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Parts */}
          <div>
            <h4 className="font-medium mb-3">Spare Parts</h4>
            {spk.parts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada spare parts</p>
            ) : (
              <div className="space-y-2">
                {spk.parts.map((part) => (
                  <div
                    key={part.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{part.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(part.price)} x {part.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(part.price * part.quantity)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Subtotal Parts</span>
                  <span className="font-medium">{formatCurrency(partsTotal)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {spk.notes && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <span className="font-medium">Catatan</span>
                </div>
                <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/30">
                  {spk.notes}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
            <span className="font-medium text-lg">Total</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(spk.actualCost || total)}
            </span>
          </div>
        </div>

        <DialogFooter className="flex-wrap gap-2">
          {spk.status === "draft" && onUpdateStatus && (
            <Button
              onClick={() => onUpdateStatus(spk.id, "in_progress")}
              variant="default"
            >
              Mulai Kerjakan
            </Button>
          )}
          {spk.status === "in_progress" && onUpdateStatus && (
            <Button
              onClick={() => onUpdateStatus(spk.id, "completed")}
              variant="default"
            >
              Tandai Selesai
            </Button>
          )}
          {spk.status === "completed" && (
            <Button variant="default" asChild>
              <a href={`/admin/invoices?spk=${spk.id}`}>Buat Invoice</a>
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
