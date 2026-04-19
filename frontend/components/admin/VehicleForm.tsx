'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useApiGet } from '@/hooks/useApi'
import type { Vehicle, VehicleFormData, Customer } from '@/types'

const vehicleSchema = z.object({
  customer_id: z.number().min(1, 'Pelanggan wajib dipilih'),
  nomor_polisi: z.string().min(1, 'Nomor polisi wajib diisi').max(15, 'Nomor polisi maksimal 15 karakter'),
  merk: z.string().min(1, 'Merk wajib diisi').max(50, 'Merk maksimal 50 karakter'),
  model: z.string().min(1, 'Model wajib diisi').max(50, 'Model maksimal 50 karakter'),
  tahun: z.number().min(1900, 'Tahun tidak valid').max(new Date().getFullYear() + 1, 'Tahun tidak valid'),
  warna: z.string().min(1, 'Warna wajib diisi').max(30, 'Warna maksimal 30 karakter'),
  nomor_rangka: z.string().optional(),
  nomor_mesin: z.string().optional(),
  transmisi: z.enum(['manual', 'automatic']),
  bahan_bakar: z.enum(['bensin', 'diesel', 'listrik', 'hybrid']),
})

interface VehicleFormProps {
  initialData?: Vehicle
  onSubmit: (data: VehicleFormData) => Promise<void>
  isSubmitting?: boolean
}

const carBrands = [
  'Toyota', 'Honda', 'Suzuki', 'Daihatsu', 'Mitsubishi', 'Nissan', 
  'Mazda', 'Hyundai', 'KIA', 'Wuling', 'BMW', 'Mercedes-Benz', 
  'Audi', 'Volkswagen', 'Ford', 'Chevrolet', 'Isuzu', 'Hino'
]

export function VehicleForm({ initialData, onSubmit, isSubmitting }: VehicleFormProps) {
  const [customerOpen, setCustomerOpen] = useState(false)
  const [customerSearch, setCustomerSearch] = useState('')
  
  const { data: customers } = useApiGet<Customer[]>('/customers?per_page=100')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      customer_id: initialData?.customer_id || 0,
      nomor_polisi: initialData?.nomor_polisi || '',
      merk: initialData?.merk || '',
      model: initialData?.model || '',
      tahun: initialData?.tahun || new Date().getFullYear(),
      warna: initialData?.warna || '',
      nomor_rangka: initialData?.nomor_rangka || '',
      nomor_mesin: initialData?.nomor_mesin || '',
      transmisi: initialData?.transmisi || 'manual',
      bahan_bakar: initialData?.bahan_bakar || 'bensin',
    },
  })

  const selectedCustomerId = watch('customer_id')
  const selectedCustomer = customers?.find(c => c.id === selectedCustomerId)

  const filteredCustomers = customers?.filter(c => 
    c.nama.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.telepon.includes(customerSearch)
  ) || []

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pemilik */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pemilik Kendaraan</CardTitle>
            <CardDescription>Pilih pelanggan pemilik kendaraan</CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel>Pelanggan</FieldLabel>
              <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedCustomer ? selectedCustomer.nama : 'Pilih pelanggan...'}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Cari pelanggan..." 
                      value={customerSearch}
                      onValueChange={setCustomerSearch}
                    />
                    <CommandList>
                      <CommandEmpty>Pelanggan tidak ditemukan</CommandEmpty>
                      <CommandGroup>
                        {filteredCustomers.map((customer) => (
                          <CommandItem
                            key={customer.id}
                            value={customer.nama}
                            onSelect={() => {
                              setValue('customer_id', customer.id)
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
          </CardContent>
        </Card>

        {/* Informasi Kendaraan */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kendaraan</CardTitle>
            <CardDescription>Data identitas kendaraan</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="nomor_polisi">Nomor Polisi</FieldLabel>
                <Input
                  id="nomor_polisi"
                  placeholder="B 1234 ABC"
                  className="uppercase"
                  {...register('nomor_polisi')}
                />
                {errors.nomor_polisi && <FieldError>{errors.nomor_polisi.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="merk">Merk</FieldLabel>
                <Select
                  value={watch('merk')}
                  onValueChange={(value) => setValue('merk', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih merk kendaraan" />
                  </SelectTrigger>
                  <SelectContent>
                    {carBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.merk && <FieldError>{errors.merk.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="model">Model</FieldLabel>
                <Input
                  id="model"
                  placeholder="Contoh: Avanza, Jazz, Xenia"
                  {...register('model')}
                />
                {errors.model && <FieldError>{errors.model.message}</FieldError>}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="tahun">Tahun</FieldLabel>
                  <Input
                    id="tahun"
                    type="number"
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    {...register('tahun', { valueAsNumber: true })}
                  />
                  {errors.tahun && <FieldError>{errors.tahun.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="warna">Warna</FieldLabel>
                  <Input
                    id="warna"
                    placeholder="Putih, Hitam, dll"
                    {...register('warna')}
                  />
                  {errors.warna && <FieldError>{errors.warna.message}</FieldError>}
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Spesifikasi */}
        <Card>
          <CardHeader>
            <CardTitle>Spesifikasi Teknis</CardTitle>
            <CardDescription>Detail teknis kendaraan</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="transmisi">Transmisi</FieldLabel>
                <Select
                  value={watch('transmisi')}
                  onValueChange={(value: 'manual' | 'automatic') => setValue('transmisi', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih transmisi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                  </SelectContent>
                </Select>
                {errors.transmisi && <FieldError>{errors.transmisi.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="bahan_bakar">Bahan Bakar</FieldLabel>
                <Select
                  value={watch('bahan_bakar')}
                  onValueChange={(value: 'bensin' | 'diesel' | 'listrik' | 'hybrid') => 
                    setValue('bahan_bakar', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bahan bakar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bensin">Bensin</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="listrik">Listrik</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bahan_bakar && <FieldError>{errors.bahan_bakar.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="nomor_rangka">Nomor Rangka (opsional)</FieldLabel>
                <Input
                  id="nomor_rangka"
                  placeholder="Nomor rangka kendaraan"
                  {...register('nomor_rangka')}
                />
                {errors.nomor_rangka && <FieldError>{errors.nomor_rangka.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="nomor_mesin">Nomor Mesin (opsional)</FieldLabel>
                <Input
                  id="nomor_mesin"
                  placeholder="Nomor mesin kendaraan"
                  {...register('nomor_mesin')}
                />
                {errors.nomor_mesin && <FieldError>{errors.nomor_mesin.message}</FieldError>}
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end gap-3">
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
            'Simpan'
          )}
        </Button>
      </div>
    </form>
  )
}
