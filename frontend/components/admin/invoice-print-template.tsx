"use client"

import { forwardRef } from "react"
import { Separator } from "@/components/ui/separator"
import {
  getCustomerById,
  getSPKById,
  getVehicleById,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data"
import type { Invoice } from "@/lib/types"

interface InvoicePrintTemplateProps {
  invoice: Invoice
}

export const InvoicePrintTemplate = forwardRef<HTMLDivElement, InvoicePrintTemplateProps>(
  function InvoicePrintTemplate({ invoice }, ref) {
    const spk = getSPKById(invoice.spkId)
    const customer = getCustomerById(invoice.customerId)
    const vehicle = spk ? getVehicleById(spk.vehicleId) : null

    return (
      <div ref={ref} className="p-8 bg-white text-black min-h-[297mm] w-[210mm] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">AutoServis</h1>
          <p className="text-sm text-gray-600">Bengkel Otomotif Terpercaya</p>
          <p className="text-sm text-gray-600">
            Jl. Raya Utama No. 123, Jakarta Selatan
          </p>
          <p className="text-sm text-gray-600">
            Telp: 021-5551234 | Email: info@autoservis.id
          </p>
        </div>

        <Separator className="mb-6" />

        {/* Invoice Info */}
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold mb-2">INVOICE</h2>
            <p className="text-sm">
              <span className="text-gray-600">No. Invoice:</span> {invoice.invoiceNumber}
            </p>
            <p className="text-sm">
              <span className="text-gray-600">No. SPK:</span> {spk?.spkNumber || "-"}
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Tanggal:</span> {formatDate(invoice.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium mb-1">Kepada:</p>
            <p className="font-bold">{customer?.name}</p>
            <p className="text-sm text-gray-600">{customer?.phone}</p>
            <p className="text-sm text-gray-600 max-w-[200px]">{customer?.address}</p>
          </div>
        </div>

        {/* Vehicle Info */}
        {vehicle && (
          <div className="mb-6 p-3 bg-gray-50 rounded">
            <p className="text-sm font-medium mb-1">Kendaraan:</p>
            <p className="font-mono">{vehicle.plateNumber}</p>
            <p className="text-sm text-gray-600">
              {vehicle.brand} {vehicle.model} ({vehicle.year}) - {vehicle.color}
            </p>
          </div>
        )}

        {/* Services Table */}
        {spk && spk.services.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-2">Layanan Servis</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2">Deskripsi</th>
                  <th className="text-center py-2 w-20">Qty</th>
                  <th className="text-right py-2 w-32">Harga</th>
                  <th className="text-right py-2 w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {spk.services.map((service) => (
                  <tr key={service.id} className="border-b border-gray-200">
                    <td className="py-2">{service.name}</td>
                    <td className="py-2 text-center">{service.quantity}</td>
                    <td className="py-2 text-right">{formatCurrency(service.price)}</td>
                    <td className="py-2 text-right">
                      {formatCurrency(service.price * service.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Parts Table */}
        {spk && spk.parts.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-2">Spare Parts</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2">Deskripsi</th>
                  <th className="text-center py-2 w-20">Qty</th>
                  <th className="text-right py-2 w-32">Harga</th>
                  <th className="text-right py-2 w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {spk.parts.map((part) => (
                  <tr key={part.id} className="border-b border-gray-200">
                    <td className="py-2">{part.name}</td>
                    <td className="py-2 text-center">{part.quantity}</td>
                    <td className="py-2 text-right">{formatCurrency(part.price)}</td>
                    <td className="py-2 text-right">
                      {formatCurrency(part.price * part.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-1 text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between py-1 text-sm text-red-600">
                <span>Diskon</span>
                <span>-{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <div className="flex justify-between py-1 text-sm">
              <span>Pajak (10%)</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between py-1 font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
            {invoice.paidAmount > 0 && (
              <>
                <div className="flex justify-between py-1 text-sm text-green-600">
                  <span>Dibayar</span>
                  <span>-{formatCurrency(invoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between py-1 font-bold">
                  <span>Sisa</span>
                  <span>{formatCurrency(invoice.total - invoice.paidAmount)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Info */}
        {invoice.paymentStatus === "paid" && (
          <div className="mb-6 p-4 border-2 border-green-500 rounded text-center">
            <p className="text-green-600 font-bold text-lg">LUNAS</p>
            <p className="text-sm text-gray-600">
              {invoice.paymentMethod} - {invoice.paymentDate && formatDate(invoice.paymentDate)}
            </p>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-1">Catatan:</p>
            <p className="text-sm text-gray-600">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-8 border-t border-gray-200">
          <div className="flex justify-between">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-16">Pelanggan</p>
              <Separator className="w-32 mx-auto" />
              <p className="text-sm mt-1">({customer?.name})</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-16">Kasir</p>
              <Separator className="w-32 mx-auto" />
              <p className="text-sm mt-1">(Admin)</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Terima kasih atas kepercayaan Anda</p>
          <p>Dokumen ini dicetak secara otomatis oleh sistem AutoServis</p>
        </div>
      </div>
    )
  }
)
