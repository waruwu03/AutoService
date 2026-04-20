"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Search, Edit, Trash2, MoreHorizontal, User } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { VehicleForm } from "@/components/admin/vehicle-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { mockVehicles, mockCustomers, getCustomerById, formatDate } from "@/lib/mock-data"
import type { Vehicle, VehicleFormData } from "@/lib/types"
import Link from "next/link"

export default function VehiclesPage() {
  const searchParams = useSearchParams()
  const customerIdParam = searchParams.get("customer")

  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [searchQuery, setSearchQuery] = useState("")
  const [customerFilter, setCustomerFilter] = useState<string>(customerIdParam || "all")
  const [brandFilter, setBrandFilter] = useState<string>("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null)

  const uniqueBrands = [...new Set(vehicles.map((v) => v.brand))].sort()

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCustomer = customerFilter === "all" || vehicle.customerId === customerFilter
    const matchesBrand = brandFilter === "all" || vehicle.brand === brandFilter
    return matchesSearch && matchesCustomer && matchesBrand
  })

  const handleAddVehicle = async (data: VehicleFormData) => {
    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setVehicles([...vehicles, newVehicle])
  }

  const handleEditVehicle = async (data: VehicleFormData) => {
    if (!editingVehicle) return
    setVehicles(
      vehicles.map((v) =>
        v.id === editingVehicle.id
          ? { ...v, ...data, updatedAt: new Date() }
          : v
      )
    )
    setEditingVehicle(undefined)
  }

  const handleDeleteVehicle = () => {
    if (!vehicleToDelete) return
    setVehicles(vehicles.filter((v) => v.id !== vehicleToDelete.id))
    setVehicleToDelete(null)
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <AdminHeader title="Kelola Kendaraan" description="Daftar dan manajemen kendaraan" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Daftar Kendaraan</CardTitle>
                  <CardDescription>
                    Total {filteredVehicles.length} kendaraan terdaftar
                  </CardDescription>
                </div>
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="mr-2 size-4" />
                  Tambah Kendaraan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari no. plat, merk, atau model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={customerFilter}
                  onValueChange={setCustomerFilter}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Pemilik" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Pemilik</SelectItem>
                    {mockCustomers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={brandFilter}
                  onValueChange={setBrandFilter}
                >
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Merk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Merk</SelectItem>
                    {uniqueBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Plat</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Pemilik</TableHead>
                    <TableHead>No. Rangka</TableHead>
                    <TableHead>No. Mesin</TableHead>
                    <TableHead>Terdaftar</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Tidak ada kendaraan ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVehicles.map((vehicle) => {
                      const owner = getCustomerById(vehicle.customerId)
                      return (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium font-mono">
                            {vehicle.plateNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {vehicle.brand} {vehicle.model}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {vehicle.year} {vehicle.color && `- ${vehicle.color}`}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {owner ? (
                              <Link
                                href={`/admin/customers`}
                                className="flex items-center gap-1 hover:underline text-primary"
                              >
                                <User className="size-3" />
                                {owner.name}
                              </Link>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="text-sm font-mono text-muted-foreground">
                            {vehicle.chassisNumber}
                          </TableCell>
                          <TableCell className="text-sm font-mono text-muted-foreground">
                            {vehicle.engineNumber}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(vehicle.createdAt)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="size-4" />
                                  <span className="sr-only">Menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingVehicle(vehicle)
                                    setFormOpen(true)
                                  }}
                                >
                                  <Edit className="mr-2 size-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setVehicleToDelete(vehicle)
                                    setDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="mr-2 size-4" />
                                  Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vehicle Form Dialog */}
      <VehicleForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingVehicle(undefined)
        }}
        vehicle={editingVehicle}
        customers={mockCustomers}
        defaultCustomerId={customerIdParam || undefined}
        onSubmit={editingVehicle ? handleEditVehicle : handleAddVehicle}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kendaraan?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus kendaraan &quot;{vehicleToDelete?.plateNumber}&quot;? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVehicle}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
