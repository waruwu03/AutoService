'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Loader2, Plus, Trash2, Search, CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { useApiGet } from '@/hooks/useApi'
import { cn } from '@/lib/utils'
import type { SPK, SPKFormData, Customer, Vehicle, Service, Sparepart, User } from '@/types'

const spkItemSchema = z.object({
  tipe: z.enum(['jasa', 'sparepart']),
  item_id: z.number().min(1, 'Item wajib dipilih'),
  quantity: z.number().min(1, 'Quantity minimal 1'),
  harga_satuan: z.number().min(0, 'Harga tidak valid'),
  diskon: z.number().min(0).max(100, 'Diskon maksimal 100%'),
  catatan: z.string().optional(),
})

const spkSchema = z.object({
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  customer_id: z.number().min(1, 'Pelanggan wajib dipilih'),
  vehicle_id: z.number().min(1, 'Kendaraan wajib dipilih'),
  mekanik_id: z.number().optional(),
  keluhan: z.string().min(1, 'Keluhan wajib diisi'),
  diagnosa: z.string().optional(),
  estimasi_selesai: z.string().optional(),
  catatan: z.string().optional(),
  items: z.array(spkItemSchema).min(1, 'Minimal 1 item harus ditambahkan'),
})

interface SPKFormProps {
  initialData?: SPK
  onSubmit: (data: SPKFormData) => Promise<void>
  isSubmitting?: boolean
}

export function SPKForm({ initialData, onSubmit, isSubmitting }: SPKFormProps) {
  const [customerOpen, setCustomerOpen] = useState(false)
  const [vehicleOpen, setVehicleOpen] = useState(false)
  const [serviceOpen, setServiceOpen] = useState(false)
  const [sparepartOpen, setSparepartOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)

  const { data: customers } = useApiGet<Customer[]>('/customers?per_page=100')
  const { data: services } = useApiGet<Service[]>('/services?per_page=100')
  const { data: spareparts } = useApiGet<Sparepart[]>('/spareparts?per_page=100')
  const { data: mekaniks } = useApiGet<User[]>('/users?role=mekanik')

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SPKFormData>({
    resolver: zodResolver(spkSchema),
    defaultValues: {
      tanggal: initialData?.tanggal || format(new Date(), 'yyyy-MM-dd'),
      customer_id: initialData?.customer_id || 0,
      vehicle_id: initialData?.vehicle_id || 0,
      mekanik_id: initialData?.mekanik_id || undefined,
      keluhan: initialData?.keluhan || '',
      diagnosa: initialData?.diagnosa || '',
      estimasi_selesai: initialData?.estimasi_selesai || '',
      catatan: initialData?.catatan || '',
      items: initialData?.items?.map(item => ({
        tipe: item.tipe,
        item_id: item.item_id,
        quantity: item.quantity,
        harga_satuan: item.harga_satuan,
        diskon: item.diskon,
        catatan: item.catatan,
      })) || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const selectedCustomerId = watch('customer_id')
  const selectedVehicleId = watch('vehicle_id')
  const items = watch('items')
  const tanggal = watch('tanggal')

  const selectedCustomer = customers?.find(c => c.id === selectedCustomerId)
  const customerVehicles = selectedCustomer?.vehicles || []

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const calculateSubtotal = (item: typeof items[0]) => {
    const subtotal = item.quantity * item.harga_satuan
    const discount = (subtotal * item.diskon) / 100
    return subtotal - discount
  }

  const totalJasa = items
    .filter(item => item.tipe === 'jasa')
    .reduce((sum, item) => sum + calculateSubtotal(item), 0)

  const totalSparepart = items
    .filter(item => item.tipe === 'sparepart')
    .reduce((sum, item) => sum + calculateSubtotal(item), 0)

  const grandTotal = totalJasa + totalSparepart

  const addService = (service: Service) => {
    append({
      tipe: 'jasa',
      item_id: service.id,
      quantity: 1,
      harga_satuan: service.harga,
      diskon: 0,
      catatan: '',
    })
    setServiceOpen(false)
  }

  const addSparepart = (part: Sparepart) => {
    append({
      tipe: 'sparepart',
      item_id: part.id,
      quantity: 1,
      harga_satuan: part.harga_jual,
      diskon: 0,
      catatan: '',
    })
    setSparepartOpen(false)
  }

  const getItemName = (item: typeof items[0]) => {
    if (item.tipe === 'jasa') {
      return services?.find(s => s.id === item.item_id)?.nama || '-'
    }
    return spareparts?.find(s => s.id === item.item_id)?.nama || '-'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* Customer & Vehicle Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pelanggan & Kendaraan</CardTitle>
            <CardDescription>Pilih pelanggan dan kendaraan yang akan diservis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Pelanggan</FieldLabel>
                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedCustomer?.nama || 'Pilih pelanggan...'}
                      <Search className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Cari pelanggan..." />
                      <CommandList>
                        <CommandEmpty>Tidak ditemukan</CommandEmpty>
                        <CommandGroup>
                          {customers?.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              onSelect={() => {
                                setValue('customer_id', customer.id)
                                setValue('vehicle_id', 0)
                                setCustomerOpen(false)
                              }}
                            >
                              <div>
                                <div className="font-medium">{customer.nama}</div>
                                <div className="text-xs text-muted-foreground">{customer.telepon}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.customer_id && <FieldError>{errors.customer_id.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Kendaraan</FieldLabel>
                <Select
                  value={selectedVehicleId ? String(selectedVehicleId) : ''}
                  onValueChange={(value) => setValue('vehicle_id', Number(value))}
                  disabled={!selectedCustomerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedCustomerId ? 'Pilih kendaraan' : 'Pilih pelanggan dulu'} />
                  </SelectTrigger>
                  <SelectContent>
                    {customerVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                        {vehicle.nomor_polisi} - {vehicle.merk} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicle_id && <FieldError>{errors.vehicle_id.message}</FieldError>}
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* SPK Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detail SPK</CardTitle>
            <CardDescription>Informasi keluhan dan estimasi pengerjaan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Tanggal SPK</FieldLabel>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tanggal ? format(new Date(tanggal), 'dd MMMM yyyy') : 'Pilih tanggal'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={tanggal ? new Date(tanggal) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setValue('tanggal', format(date, 'yyyy-MM-dd'))
                          setDateOpen(false)
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>

              <Field>
                <FieldLabel>Mekanik</FieldLabel>
                <Select
                  value={watch('mekanik_id') ? String(watch('mekanik_id')) : ''}
                  onValueChange={(value) => setValue('mekanik_id', Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mekanik (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {mekaniks?.map((mekanik) => (
                      <SelectItem key={mekanik.id} value={String(mekanik.id)}>
                        {mekanik.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel>Keluhan</FieldLabel>
                <Textarea
                  placeholder="Deskripsikan keluhan pelanggan..."
                  rows={3}
                  {...register('keluhan')}
                />
                {errors.keluhan && <FieldError>{errors.keluhan.message}</FieldError>}
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel>Diagnosa (opsional)</FieldLabel>
                <Textarea
                  placeholder="Hasil diagnosa mekanik..."
                  rows={2}
                  {...register('diagnosa')}
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle>Item Pekerjaan</CardTitle>
            <CardDescription>Tambahkan jasa servis dan sparepart</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <Popover open={serviceOpen} onOpenChange={setServiceOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Jasa
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput placeholder="Cari jasa..." />
                    <CommandList>
                      <CommandEmpty>Tidak ditemukan</CommandEmpty>
                      <CommandGroup>
                        {services?.map((service) => (
                          <CommandItem key={service.id} onSelect={() => addService(service)}>
                            <div className="flex-1">
                              <div>{service.nama}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatCurrency(service.harga)}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Popover open={sparepartOpen} onOpenChange={setSparepartOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Sparepart
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput placeholder="Cari sparepart..." />
                    <CommandList>
                      <CommandEmpty>Tidak ditemukan</CommandEmpty>
                      <CommandGroup>
                        {spareparts?.map((part) => (
                          <CommandItem key={part.id} onSelect={() => addSparepart(part)}>
                            <div className="flex-1">
                              <div>{part.nama}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatCurrency(part.harga_jual)} - Stok: {part.stok}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {errors.items && <p className="mb-2 text-sm text-destructive">{errors.items.message}</p>}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="w-24">Qty</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                    <TableHead className="w-20">Diskon %</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Belum ada item ditambahkan
                      </TableCell>
                    </TableRow>
                  ) : (
                    fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            items[index].tipe === 'jasa' 
                              ? "bg-blue-100 text-blue-700" 
                              : "bg-green-100 text-green-700"
                          )}>
                            {items[index].tipe === 'jasa' ? 'Jasa' : 'Part'}
                          </span>
                        </TableCell>
                        <TableCell>{getItemName(items[index])}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            className="w-20"
                            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(items[index].harga_satuan)}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            className="w-16"
                            {...register(`items.${index}.diskon`, { valueAsNumber: true })}
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(calculateSubtotal(items[index]))}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                {fields.length > 0 && (
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={5} className="text-right">Total Jasa</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(totalJasa)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} className="text-right">Total Sparepart</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(totalSparepart)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} className="text-right font-bold">Grand Total</TableCell>
                      <TableCell className="text-right font-bold text-lg">{formatCurrency(grandTotal)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan SPK'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
