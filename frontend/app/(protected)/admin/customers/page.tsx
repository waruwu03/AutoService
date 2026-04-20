"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Car, MoreHorizontal } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { CustomerForm } from "@/components/admin/customer-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { mockCustomers, mockVehicles, formatDate } from "@/lib/mock-data"
import type { Customer, CustomerFormData, CustomerType } from "@/lib/types"
import Link from "next/link"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<CustomerType | "all">("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    const matchesType = typeFilter === "all" || customer.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleAddCustomer = async (data: CustomerFormData) => {
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setCustomers([...customers, newCustomer])
  }

  const handleEditCustomer = async (data: CustomerFormData) => {
    if (!editingCustomer) return
    setCustomers(
      customers.map((c) =>
        c.id === editingCustomer.id
          ? { ...c, ...data, updatedAt: new Date() }
          : c
      )
    )
    setEditingCustomer(undefined)
  }

  const handleDeleteCustomer = () => {
    if (!customerToDelete) return
    setCustomers(customers.filter((c) => c.id !== customerToDelete.id))
    setCustomerToDelete(null)
    setDeleteDialogOpen(false)
  }

  const getVehicleCount = (customerId: string) => {
    return mockVehicles.filter((v) => v.customerId === customerId).length
  }

  return (
    <>
      <AdminHeader title="Kelola Pelanggan" description="Daftar dan manajemen pelanggan" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Daftar Pelanggan</CardTitle>
                  <CardDescription>
                    Total {filteredCustomers.length} pelanggan terdaftar
                  </CardDescription>
                </div>
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="mr-2 size-4" />
                  Tambah Pelanggan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama, email, atau telepon..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={typeFilter}
                  onValueChange={(value: CustomerType | "all") => setTypeFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="pribadi">Pribadi</SelectItem>
                    <SelectItem value="korporat">Korporat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Terdaftar</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Tidak ada pelanggan ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {customer.address}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{customer.email}</p>
                            <p className="text-muted-foreground">{customer.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={customer.type === "korporat" ? "default" : "secondary"}>
                            {customer.type === "korporat" ? "Korporat" : "Pribadi"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/admin/vehicles?customer=${customer.id}`}
                            className="flex items-center gap-1 text-sm hover:underline text-primary"
                          >
                            <Car className="size-4" />
                            {getVehicleCount(customer.id)} unit
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(customer.createdAt)}
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
                                  setEditingCustomer(customer)
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
                                  setCustomerToDelete(customer)
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
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customer Form Dialog */}
      <CustomerForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingCustomer(undefined)
        }}
        customer={editingCustomer}
        onSubmit={editingCustomer ? handleEditCustomer : handleAddCustomer}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pelanggan?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus pelanggan &quot;{customerToDelete?.name}&quot;? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCustomer}
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
