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
  Loader2,
} from "lucide-react"

import useSWR from "swr"
import { api, fetcher } from "@/lib/api-client"
import { toast } from "sonner"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PimpinanHeader } from "@/components/pimpinan/pimpinan-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPage() {
  const [hasChanges, setHasChanges] = React.useState(false)
  const { data: usersData, isLoading: isUsersLoading, mutate: mutateUsers } = useSWR("/users", fetcher)
  
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<any>(null)
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "MEKANIK",
    phone: "",
  })
  const [isSaving, setIsSaving] = React.useState(false)

  const users = usersData?.data || []


  const { data: settingsData, mutate: mutateSettings } = useSWR('/settings', fetcher);
  const settings = settingsData?.data || settingsData || [];

  const getSetting = (key, defaultValue) => {
    const s = settings.find(s => s.key === key);
    if (!s) return defaultValue;
    if (typeof defaultValue === 'boolean') return s.value === 'true';
    if (typeof defaultValue === 'number') return Number(s.value);
    return s.value;
  };

  const [general, setGeneral] = React.useState({
    name: 'AutoServis Jakarta',
    code: 'AS-JKT-001',
    address: 'Jl. Raya Otomotif No. 123, Jakarta Timur 13450',
    phone: '021-5551234',
    email: 'info@autoservis.id',
    npwp: '01.234.567.8-901.000',
    openTime: '08:00',
    closeTime: '17:00',
    openSaturday: true,
    openSunday: false
  });

  const [workflow, setWorkflow] = React.useState({
    reqApproval: true,
    noApprovalLimit: 1000000,
    noApprovalDiscount: 5,
    spkPrefix: 'SPK',
    invPrefix: 'INV',
    format: 'year-seq'
  });

  const [pricing, setPricing] = React.useState({
    partMarkup: 25,
    serviceMarkup: 30,
    taxRate: 11,
    showTaxIncluded: true
  });

  const [isSavingSettings, setIsSavingSettings] = React.useState(false);

  React.useEffect(() => {
    if (settings.length > 0) {
      setGeneral({
        name: getSetting('business_name', 'AutoServis Jakarta'),
        code: getSetting('business_code', 'AS-JKT-001'),
        address: getSetting('business_address', 'Jl. Raya Otomotif No. 123, Jakarta Timur 13450'),
        phone: getSetting('business_phone', '021-5551234'),
        email: getSetting('business_email', 'info@autoservis.id'),
        npwp: getSetting('business_npwp', '01.234.567.8-901.000'),
        openTime: getSetting('open_time', '08:00'),
        closeTime: getSetting('close_time', '17:00'),
        openSaturday: getSetting('open_saturday', true),
        openSunday: getSetting('open_sunday', false)
      });
      setWorkflow({
        reqApproval: getSetting('req_approval', true),
        noApprovalLimit: getSetting('no_approval_limit', 1000000),
        noApprovalDiscount: getSetting('no_approval_discount', 5),
        spkPrefix: getSetting('spk_prefix', 'SPK'),
        invPrefix: getSetting('invoice_prefix', 'INV'),
        format: getSetting('invoice_format', 'year-seq')
      });
      setPricing({
        partMarkup: getSetting('part_markup', 25),
        serviceMarkup: getSetting('service_markup', 30),
        taxRate: getSetting('tax_rate', 11),
        showTaxIncluded: getSetting('show_tax_included', true)
      });
    }
  }, [settingsData]);

  const handleSaveSettings = async () => {
    try {
      setIsSavingSettings(true);
      const payload = [
        { key: 'business_name', value: String(general.name), group: 'GENERAL' },
        { key: 'business_code', value: String(general.code), group: 'GENERAL' },
        { key: 'business_address', value: String(general.address), group: 'GENERAL' },
        { key: 'business_phone', value: String(general.phone), group: 'GENERAL' },
        { key: 'business_email', value: String(general.email), group: 'GENERAL' },
        { key: 'business_npwp', value: String(general.npwp), group: 'GENERAL' },
        { key: 'open_time', value: String(general.openTime), group: 'GENERAL' },
        { key: 'close_time', value: String(general.closeTime), group: 'GENERAL' },
        { key: 'open_saturday', value: String(general.openSaturday), group: 'GENERAL' },
        { key: 'open_sunday', value: String(general.openSunday), group: 'GENERAL' },
        
        { key: 'req_approval', value: String(workflow.reqApproval), group: 'WORKFLOW' },
        { key: 'no_approval_limit', value: String(workflow.noApprovalLimit), group: 'WORKFLOW' },
        { key: 'no_approval_discount', value: String(workflow.noApprovalDiscount), group: 'WORKFLOW' },
        { key: 'spk_prefix', value: String(workflow.spkPrefix), group: 'WORKFLOW' },
        { key: 'invoice_prefix', value: String(workflow.invPrefix), group: 'WORKFLOW' },
        { key: 'invoice_format', value: String(workflow.format), group: 'WORKFLOW' },

        { key: 'part_markup', value: String(pricing.partMarkup), group: 'PRICING' },
        { key: 'service_markup', value: String(pricing.serviceMarkup), group: 'PRICING' },
        { key: 'tax_rate', value: String(pricing.taxRate), group: 'PRICING' },
        { key: 'show_tax_included', value: String(pricing.showTaxIncluded), group: 'PRICING' }
      ];
      
      await api.post('/settings/bulk', { settings: payload });
      setHasChanges(false);
      toast.success('Pengaturan berhasil disimpan');
      mutateSettings();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Gagal menyimpan pengaturan');
    } finally {
      setIsSavingSettings(false);
    }
  };


  const handleOpenAddUser = () => {
    setEditingUser(null)
    setFormData({ name: "", email: "", password: "", role: "MEKANIK", phone: "" })
    setIsUserModalOpen(true)
  }

  const handleOpenEditUser = (user: any) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, password: "", role: user.role, phone: user.phone || "" })
    setIsUserModalOpen(true)
  }

  const handleSaveUser = async () => {
    try {
      setIsSaving(true)
      if (editingUser) {
        // Update user
        const updateData: any = { name: formData.name, role: formData.role, phone: formData.phone }
        if (formData.password) updateData.password = formData.password
        await api.put(`/users/${editingUser.id}`, updateData)
        toast.success("Data tim berhasil diupdate")
      } else {
        // Create user
        if (!formData.email || !formData.password || !formData.name) {
           toast.error("Nama, Email, dan Password wajib diisi")
           setIsSaving(false)
           return
        }
        await api.post("/users", formData)
        toast.success("Anggota tim berhasil ditambahkan")
      }
      setIsUserModalOpen(false)
      mutateUsers()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Terjadi kesalahan")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(`/users/${userId}`, { role: newRole })
      toast.success("Role berhasil diubah")
      mutateUsers()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal mengubah role")
    }
  }

  return (
    <>
      <PimpinanHeader title="Pengaturan" description="Konfigurasi sistem dan preferensi" />
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6 bg-background">
        {/* Header Actions */}
        {hasChanges && (
                    <div className="flex items-center justify-end gap-2 mb-2">
            <Button variant="outline" onClick={() => setHasChanges(false)}>
              <RotateCcw className="mr-2 size-4" /> Reset
            </Button>
            <Button onClick={handleSaveSettings} disabled={isSavingSettings} className="bg-orange-500 hover:bg-orange-600 text-white">
              {isSavingSettings ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
              Simpan Perubahan
            </Button>
          </div>
        )}

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
                  <div className="space-y-2"><Label htmlFor="workshop-name">Nama Bengkel</Label><Input id="workshop-name" value={general.name} onChange={(e) => { setGeneral({...general, name: e.target.value}); setHasChanges(true); }} onChange={() => setHasChanges(true)} /></div>
                  <div className="space-y-2"><Label htmlFor="workshop-code">Kode Bengkel</Label><Input id="workshop-code" value={general.code} onChange={(e) => { setGeneral({...general, code: e.target.value}); setHasChanges(true); }} onChange={() => setHasChanges(true)} /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="address">Alamat</Label><Textarea id="address" value={general.address} onChange={(e) => { setGeneral({...general, address: e.target.value}); setHasChanges(true); }} onChange={() => setHasChanges(true)} /></div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2"><Label htmlFor="phone">Telepon</Label><Input id="phone" value={general.phone} onChange={(e) => { setGeneral({...general, phone: e.target.value}); setHasChanges(true); }} onChange={() => setHasChanges(true)} /></div>
                  <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={general.email} onChange={(e) => { setGeneral({...general, email: e.target.value}); setHasChanges(true); }} onChange={() => setHasChanges(true)} /></div>
                  <div className="space-y-2"><Label htmlFor="npwp">NPWP</Label><Input id="npwp" value={general.npwp} onChange={(e) => { setGeneral({...general, npwp: e.target.value}); setHasChanges(true); }} onChange={() => setHasChanges(true)} /></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Jam Operasional</CardTitle><CardDescription>Atur jam buka dan tutup bengkel</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="open-time">Jam Buka</Label><Input id="open-time" type="time" value={general.openTime} onChange={(e) => { setGeneral({...general, openTime: e.target.value}); setHasChanges(true); }} onChange={() => setHasChanges(true)} /></div>
                  <div className="space-y-2"><Label htmlFor="close-time">Jam Tutup</Label><Input id="close-time" type="time" value={general.closeTime} onChange={(e) => { setGeneral({...general, closeTime: e.target.value}); setHasChanges(true); }} onChange={() => setHasChanges(true)} /></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5"><Label>Buka di Hari Sabtu</Label><p className="text-sm text-muted-foreground">Terima booking dan servis di hari Sabtu</p></div>
                  <Switch checked={general.openSaturday} onCheckedChange={(val) => { setGeneral({...general, openSaturday: val}); setHasChanges(true); }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5"><Label>Buka di Hari Minggu</Label><p className="text-sm text-muted-foreground">Terima booking dan servis di hari Minggu</p></div>
                  <Switch checked={general.openSunday} onCheckedChange={(val) => { setGeneral({...general, openSunday: val}); setHasChanges(true); }} />
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
                  <Switch checked={workflow.reqApproval} onCheckedChange={(val) => { setWorkflow({...workflow, reqApproval: val}); setHasChanges(true); }} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Batas Nilai Tanpa Approval</Label>
                  <p className="text-sm text-muted-foreground">SPK di bawah nilai ini tidak perlu approval</p>
                  <div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">Rp</span><Input type="number" value={workflow.noApprovalLimit} onChange={(e) => { setWorkflow({...workflow, noApprovalLimit: Number(e.target.value)}); setHasChanges(true); }} className="w-40" onChange={() => setHasChanges(true)} /></div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Batas Diskon Tanpa Approval</Label>
                  <p className="text-sm text-muted-foreground">Persentase diskon maksimal yang bisa diberikan tanpa approval</p>
                  <div className="flex items-center gap-2"><Input type="number" value={workflow.noApprovalDiscount} onChange={(e) => { setWorkflow({...workflow, noApprovalDiscount: Number(e.target.value)}); setHasChanges(true); }} className="w-20" onChange={() => setHasChanges(true)} /><span className="text-sm text-muted-foreground">%</span></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Penomoran Otomatis</CardTitle><CardDescription>Format dan prefix untuk dokumen</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="spk-prefix">Prefix SPK</Label><Input id="spk-prefix" value={workflow.spkPrefix} onChange={(e) => { setWorkflow({...workflow, spkPrefix: e.target.value}); setHasChanges(true); }} onChange={() => setHasChanges(true)} /></div>
                  <div className="space-y-2"><Label htmlFor="inv-prefix">Prefix Invoice</Label><Input id="inv-prefix" value={workflow.invPrefix} onChange={(e) => { setWorkflow({...workflow, invPrefix: e.target.value}); setHasChanges(true); }} onChange={() => setHasChanges(true)} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Format Penomoran</Label>
                  <Select value={workflow.format} onValueChange={(val) => { setWorkflow({...workflow, format: val}); setHasChanges(true); }}>
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
                  <div className="space-y-2"><Label>Markup Sparepart (%)</Label><Input type="number" value={pricing.partMarkup} onChange={(e) => { setPricing({...pricing, partMarkup: Number(e.target.value)}); setHasChanges(true); }} onChange={() => setHasChanges(true)} /><p className="text-xs text-muted-foreground">Markup default untuk harga sparepart</p></div>
                  <div className="space-y-2"><Label>Markup Jasa (%)</Label><Input type="number" value={pricing.serviceMarkup} onChange={(e) => { setPricing({...pricing, serviceMarkup: Number(e.target.value)}); setHasChanges(true); }} onChange={() => setHasChanges(true)} /><p className="text-xs text-muted-foreground">Markup default untuk biaya jasa</p></div>
                </div>
                <Separator />
                <div className="space-y-2"><Label>PPN (%)</Label><Input type="number" value={pricing.taxRate} onChange={(e) => { setPricing({...pricing, taxRate: Number(e.target.value)}); setHasChanges(true); }} className="w-20" onChange={() => setHasChanges(true)} /><p className="text-xs text-muted-foreground">Persentase PPN yang dikenakan</p></div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5"><Label>Tampilkan Harga Termasuk PPN</Label><p className="text-sm text-muted-foreground">Harga yang ditampilkan sudah termasuk PPN</p></div>
                  <Switch checked={pricing.showTaxIncluded} onCheckedChange={(val) => { setPricing({...pricing, showTaxIncluded: val}); setHasChanges(true); }} />
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
                  {isUsersLoading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="size-8 animate-spin text-primary" />
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground">Tidak ada data tim.</div>
                  ) : (
                    users.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="size-10">
                            <AvatarImage src={user.photoUrl || ""} alt={user.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                              {user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Select value={user.role || "MEKANIK"} onValueChange={(val) => handleRoleChange(user.id, val)}>
                            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PIMPINAN">Pimpinan</SelectItem>
                              <SelectItem value="ADMIN">Admin / Kasir</SelectItem>
                              <SelectItem value="MEKANIK">Mekanik</SelectItem>
                              <SelectItem value="GUDANG">Gudang</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" onClick={() => handleOpenEditUser(user)}>Edit</Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white shadow-sm" onClick={handleOpenAddUser}><Users className="mr-2 size-4" /> Tambah Anggota Tim</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Modal */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit Anggota Tim" : "Tambah Anggota Tim"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Ubah detail anggota tim di sini." : "Tambahkan anggota tim baru untuk mengakses sistem."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nama</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="col-span-3" />
            </div>
            {!editingUser && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="col-span-3" />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">{editingUser ? "Password Baru" : "Password"}</Label>
              <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder={editingUser ? "(Kosongkan jika tidak diubah)" : ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Telepon</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PIMPINAN">Pimpinan</SelectItem>
                  <SelectItem value="ADMIN">Admin / Kasir</SelectItem>
                  <SelectItem value="MEKANIK">Mekanik</SelectItem>
                  <SelectItem value="GUDANG">Gudang</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>Batal</Button>
            <Button onClick={handleSaveUser} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSaving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
