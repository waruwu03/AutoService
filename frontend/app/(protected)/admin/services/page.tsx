"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Search, Package, Wrench } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { serviceCatalog, partsCatalog, formatCurrency } from "@/lib/mock-data"

interface ServiceItem {
  name: string
  price: number
  description?: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>(serviceCatalog)
  const [parts, setParts] = useState<ServiceItem[]>(partsCatalog)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null)
  const [activeTab, setActiveTab] = useState<"services" | "parts">("services")
  const [formData, setFormData] = useState<ServiceItem>({
    name: "",
    price: 0,
    description: "",
  })

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredParts = parts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({ name: "", price: 0, description: "" })
    setDialogOpen(true)
  }

  const handleEdit = (item: ServiceItem) => {
    setEditingItem(item)
    setFormData(item)
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (activeTab === "services") {
      if (editingItem) {
        setServices(services.map((s) => (s.name === editingItem.name ? formData : s)))
      } else {
        setServices([...services, formData])
      }
    } else {
      if (editingItem) {
        setParts(parts.map((p) => (p.name === editingItem.name ? formData : p)))
      } else {
        setParts([...parts, formData])
      }
    }
    setDialogOpen(false)
  }

  const handleDelete = (item: ServiceItem) => {
    if (activeTab === "services") {
      setServices(services.filter((s) => s.name !== item.name))
    } else {
      setParts(parts.filter((p) => p.name !== item.name))
    }
  }

  return (
    <>
      <AdminHeader
        title="Katalog Layanan"
        description="Kelola daftar layanan dan spare parts"
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "services" | "parts")}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <TabsList>
                <TabsTrigger value="services" className="gap-2">
                  <Wrench className="size-4" />
                  Layanan Servis
                </TabsTrigger>
                <TabsTrigger value="parts" className="gap-2">
                  <Package className="size-4" />
                  Spare Parts
                </TabsTrigger>
              </TabsList>

              <Button onClick={handleAdd}>
                <Plus className="mr-2 size-4" />
                Tambah {activeTab === "services" ? "Layanan" : "Part"}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>
                      {activeTab === "services" ? "Daftar Layanan Servis" : "Daftar Spare Parts"}
                    </CardTitle>
                    <CardDescription>
                      {activeTab === "services"
                        ? `${filteredServices.length} layanan tersedia`
                        : `${filteredParts.length} spare parts tersedia`}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama layanan atau part..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <TabsContent value="services" className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Layanan</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead className="text-right">Harga</TableHead>
                        <TableHead className="w-24"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            Tidak ada layanan ditemukan
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredServices.map((service) => (
                          <TableRow key={service.name}>
                            <TableCell className="font-medium">{service.name}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {service.description || "-"}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(service.price)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(service)}
                                >
                                  <Edit className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(service)}
                                >
                                  <Trash2 className="size-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="parts" className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Part</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead className="text-right">Harga</TableHead>
                        <TableHead className="w-24"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredParts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            Tidak ada part ditemukan
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredParts.map((part) => (
                          <TableRow key={part.name}>
                            <TableCell className="font-medium">{part.name}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {part.description || "-"}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(part.price)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(part)}
                                >
                                  <Edit className="size-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(part)}
                                >
                                  <Trash2 className="size-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? `Edit ${activeTab === "services" ? "Layanan" : "Part"}`
                : `Tambah ${activeTab === "services" ? "Layanan" : "Part"} Baru`}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Ubah informasi di bawah ini"
                : "Isi informasi untuk item baru"}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="name">Nama</FieldLabel>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={activeTab === "services" ? "Ganti Oli Mesin" : "Oli Shell Helix"}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="price">Harga (Rp)</FieldLabel>
              <Input
                id="price"
                type="number"
                min={0}
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseInt(e.target.value) || 0 })
                }
                placeholder="150000"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Deskripsi (Opsional)</FieldLabel>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi singkat..."
                rows={2}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={!formData.name || !formData.price}>
              {editingItem ? "Simpan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
