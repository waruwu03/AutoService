"use client"

import * as React from "react"
import {
  Settings,
  Building2,
  Bell,
  DollarSign,
  Users,
  Save,
  RotateCcw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PimpinanHeader } from "@/components/pimpinan/pimpinan-header"

export default function SettingsPage() {
  const [hasChanges, setHasChanges] = React.useState(false)

  return (
    <>
      <PimpinanHeader title="Pengaturan" description="Konfigurasi sistem dan preferensi" />
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
            <p className="text-muted-foreground">Konfigurasi sistem dan preferensi</p>
          </div>
          {hasChanges && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setHasChanges(false)}>
                <RotateCcw className="mr-2 size-4" /> Reset
              </Button>
              <Button onClick={() => setHasChanges(false)}>
                <Save className="mr-2 size-4" /> Simpan Perubahan
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="general" className="gap-2"><Building2 className="size-4" /><span className="hidden sm:inline">Umum</span></TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="size-4" /><span className="hidden sm:inline">Notifikasi</span></TabsTrigger>
            <TabsTrigger value="workflow" className="gap-2"><Settings className="size-4" /><span className="hidden sm:inline">Workflow</span></TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2"><DollarSign className="size-4" /><span className="hidden sm:inline">Harga</span></TabsTrigger>
            <TabsTrigger value="users" className="gap-2"><Users className="size-4" /><span className="hidden sm:inline">Tim</span></TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Informasi Bengkel</CardTitle><CardDescription>Data dasar bengkel yang ditampilkan di invoice dan dokumen</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="workshop-name">Nama Bengkel</Label><Input id="workshop-name" defaultValue="AutoServis Jakarta" onChange={() => setHasChanges(true)} /></div>
                  <div className="space-y-2"><Label htmlFor="workshop-code">Kode Bengkel</Label><Input id="workshop-code" defaultValue="AS-JKT-001" onChange={() => setHasChanges(true)} /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="address">Alamat</Label><Textarea id="address" defaultValue="Jl. Raya Otomotif No. 123, Jakarta Timur 13450" onChange={() => setHasChanges(true)} /></div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2"><Label htmlFor="phone">Telepon</Label><Input id="phone" defaultValue="021-5551234" onChange={() => setHasChanges(true)} /></div>
                  <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue="info@autoservis.id" onChange={() => setHasChanges(true)} /></div>
                  <div className="space-y-2"><Label htmlFor="npwp">NPWP</Label><Input id="npwp" defaultValue="01.234.567.8-901.000" onChange={() => setHasChanges(true)} /></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Jam Operasional</CardTitle><CardDescription>Atur jam buka dan tutup bengkel</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="open-time">Jam Buka</Label><Input id="open-time" type="time" defaultValue="08:00" onChange={() => setHasChanges(true)} /></div>
                  <div className="space-y-2"><Label htmlFor="close-time">Jam Tutup</Label><Input id="close-time" type="time" defaultValue="17:00" onChange={() => setHasChanges(true)} /></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5"><Label>Buka di Hari Sabtu</Label><p className="text-sm text-muted-foreground">Terima booking dan servis di hari Sabtu</p></div>
                  <Switch defaultChecked onChange={() => setHasChanges(true)} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5"><Label>Buka di Hari Minggu</Label><p className="text-sm text-muted-foreground">Terima booking dan servis di hari Minggu</p></div>
                  <Switch onChange={() => setHasChanges(true)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Notifikasi Email</CardTitle><CardDescription>Atur kapan Anda menerima notifikasi email</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "SPK Baru", desc: "Notifikasi saat ada SPK baru yang perlu approval", defaultChecked: true },
                  { label: "Stok Rendah", desc: "Notifikasi saat stok barang di bawah minimum", defaultChecked: true },
                  { label: "Laporan Harian", desc: "Ringkasan pendapatan dan aktivitas harian", defaultChecked: true },
                  { label: "Laporan Mingguan", desc: "Ringkasan performa mingguan", defaultChecked: true },
                  { label: "Review Pelanggan", desc: "Notifikasi saat ada review baru dari pelanggan", defaultChecked: false },
                ].map((item, index) => (
                  <React.Fragment key={item.label}>
                    {index > 0 && <Separator />}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5"><Label>{item.label}</Label><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                      <Switch defaultChecked={item.defaultChecked} onChange={() => setHasChanges(true)} />
                    </div>
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Settings */}
          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Approval Workflow</CardTitle><CardDescription>Atur alur persetujuan SPK dan quotation</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5"><Label>Wajib Approval Kepala Bengkel</Label><p className="text-sm text-muted-foreground">Semua SPK harus disetujui Kepala Bengkel</p></div>
                  <Switch defaultChecked onChange={() => setHasChanges(true)} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Batas Nilai Tanpa Approval</Label>
                  <p className="text-sm text-muted-foreground">SPK di bawah nilai ini tidak perlu approval</p>
                  <div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">Rp</span><Input type="number" defaultValue="1000000" className="w-40" onChange={() => setHasChanges(true)} /></div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Batas Diskon Tanpa Approval</Label>
                  <p className="text-sm text-muted-foreground">Persentase diskon maksimal yang bisa diberikan tanpa approval</p>
                  <div className="flex items-center gap-2"><Input type="number" defaultValue="5" className="w-20" onChange={() => setHasChanges(true)} /><span className="text-sm text-muted-foreground">%</span></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Penomoran Otomatis</CardTitle><CardDescription>Format dan prefix untuk dokumen</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="spk-prefix">Prefix SPK</Label><Input id="spk-prefix" defaultValue="SPK" onChange={() => setHasChanges(true)} /></div>
                  <div className="space-y-2"><Label htmlFor="inv-prefix">Prefix Invoice</Label><Input id="inv-prefix" defaultValue="INV" onChange={() => setHasChanges(true)} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Format Penomoran</Label>
                  <Select defaultValue="year-seq" onValueChange={() => setHasChanges(true)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year-seq">PREFIX-YYYY-NNNN (SPK-2024-0001)</SelectItem>
                      <SelectItem value="month-seq">PREFIX-YYYY-MM-NNN (SPK-2024-11-001)</SelectItem>
                      <SelectItem value="seq-only">PREFIX-NNNNNN (SPK-000001)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Settings */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Pengaturan Harga</CardTitle><CardDescription>Markup dan margin default</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label>Markup Sparepart (%)</Label><Input type="number" defaultValue="25" onChange={() => setHasChanges(true)} /><p className="text-xs text-muted-foreground">Markup default untuk harga sparepart</p></div>
                  <div className="space-y-2"><Label>Markup Jasa (%)</Label><Input type="number" defaultValue="30" onChange={() => setHasChanges(true)} /><p className="text-xs text-muted-foreground">Markup default untuk biaya jasa</p></div>
                </div>
                <Separator />
                <div className="space-y-2"><Label>PPN (%)</Label><Input type="number" defaultValue="11" className="w-20" onChange={() => setHasChanges(true)} /><p className="text-xs text-muted-foreground">Persentase PPN yang dikenakan</p></div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5"><Label>Tampilkan Harga Termasuk PPN</Label><p className="text-sm text-muted-foreground">Harga yang ditampilkan sudah termasuk PPN</p></div>
                  <Switch defaultChecked onChange={() => setHasChanges(true)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Settings */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Manajemen Tim</CardTitle><CardDescription>Kelola akses dan peran anggota tim</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Budi Santoso", role: "Kepala Bengkel", email: "budi@autoservis.id" },
                    { name: "Dewi Lestari", role: "Service Advisor", email: "dewi@autoservis.id" },
                    { name: "Rina Susanti", role: "Service Advisor", email: "rina@autoservis.id" },
                    { name: "Admin Gudang", role: "Inventory", email: "gudang@autoservis.id" },
                    { name: "Kasir", role: "Kasir", email: "kasir@autoservis.id" },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Select defaultValue={user.role.toLowerCase().replace(" ", "-")}>
                          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kepala-bengkel">Kepala Bengkel</SelectItem>
                            <SelectItem value="service-advisor">Service Advisor</SelectItem>
                            <SelectItem value="mekanik">Mekanik</SelectItem>
                            <SelectItem value="inventory">Inventory</SelectItem>
                            <SelectItem value="kasir">Kasir</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="mt-4"><Users className="mr-2 size-4" /> Tambah Anggota Tim</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
