"use client"

import { useState } from "react"
import { Save, Building2, Users, Wrench, Receipt, Bell } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { mockMechanics } from "@/lib/mock-data"

export default function SettingsPage() {
  const [businessSettings, setBusinessSettings] = useState({
    name: "AutoServis",
    tagline: "Bengkel Otomotif Terpercaya",
    address: "Jl. Raya Utama No. 123, Jakarta Selatan",
    phone: "021-5551234",
    email: "info@autoservis.id",
    taxRate: 10,
    invoicePrefix: "INV",
    spkPrefix: "SPK",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    spkReminders: true,
    paymentAlerts: true,
    dailyReports: false,
  })

  const handleSaveSettings = () => {
    // In a real app, this would save to the database
    alert("Pengaturan berhasil disimpan!")
  }

  return (
    <>
      <AdminHeader title="Pengaturan" description="Kelola pengaturan sistem AutoServis" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="business" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="business" className="gap-2">
                <Building2 className="size-4" />
                <span className="hidden sm:inline">Bisnis</span>
              </TabsTrigger>
              <TabsTrigger value="mechanics" className="gap-2">
                <Wrench className="size-4" />
                <span className="hidden sm:inline">Mekanik</span>
              </TabsTrigger>
              <TabsTrigger value="invoices" className="gap-2">
                <Receipt className="size-4" />
                <span className="hidden sm:inline">Invoice</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="size-4" />
                <span className="hidden sm:inline">Notifikasi</span>
              </TabsTrigger>
            </TabsList>

            {/* Business Settings */}
            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Bisnis</CardTitle>
                  <CardDescription>
                    Pengaturan dasar informasi bengkel Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="businessName">Nama Bengkel</FieldLabel>
                      <Input
                        id="businessName"
                        value={businessSettings.name}
                        onChange={(e) =>
                          setBusinessSettings({ ...businessSettings, name: e.target.value })
                        }
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="tagline">Tagline</FieldLabel>
                      <Input
                        id="tagline"
                        value={businessSettings.tagline}
                        onChange={(e) =>
                          setBusinessSettings({ ...businessSettings, tagline: e.target.value })
                        }
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="address">Alamat</FieldLabel>
                      <Textarea
                        id="address"
                        value={businessSettings.address}
                        onChange={(e) =>
                          setBusinessSettings({ ...businessSettings, address: e.target.value })
                        }
                        rows={2}
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="phone">Telepon</FieldLabel>
                        <Input
                          id="phone"
                          value={businessSettings.phone}
                          onChange={(e) =>
                            setBusinessSettings({ ...businessSettings, phone: e.target.value })
                          }
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          id="email"
                          type="email"
                          value={businessSettings.email}
                          onChange={(e) =>
                            setBusinessSettings({ ...businessSettings, email: e.target.value })
                          }
                        />
                      </Field>
                    </div>

                    <Button onClick={handleSaveSettings}>
                      <Save className="mr-2 size-4" />
                      Simpan Perubahan
                    </Button>
                  </FieldGroup>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mechanics Management */}
            <TabsContent value="mechanics">
              <Card>
                <CardHeader>
                  <CardTitle>Daftar Mekanik</CardTitle>
                  <CardDescription>Kelola data mekanik bengkel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockMechanics.map((mechanic) => (
                      <div
                        key={mechanic.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                            {mechanic.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{mechanic.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {mechanic.specialization} | {mechanic.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              mechanic.status === "available"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : mechanic.status === "busy"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                            }`}
                          >
                            {mechanic.status === "available"
                              ? "Tersedia"
                              : mechanic.status === "busy"
                              ? "Sibuk"
                              : "Tidak Aktif"}
                          </span>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      + Tambah Mekanik Baru
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Invoice Settings */}
            <TabsContent value="invoices">
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Invoice</CardTitle>
                  <CardDescription>
                    Konfigurasi format dan pengaturan invoice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="invoicePrefix">Prefix Invoice</FieldLabel>
                        <Input
                          id="invoicePrefix"
                          value={businessSettings.invoicePrefix}
                          onChange={(e) =>
                            setBusinessSettings({
                              ...businessSettings,
                              invoicePrefix: e.target.value,
                            })
                          }
                          placeholder="INV"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Contoh: {businessSettings.invoicePrefix}/2024/03/001
                        </p>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="spkPrefix">Prefix SPK</FieldLabel>
                        <Input
                          id="spkPrefix"
                          value={businessSettings.spkPrefix}
                          onChange={(e) =>
                            setBusinessSettings({
                              ...businessSettings,
                              spkPrefix: e.target.value,
                            })
                          }
                          placeholder="SPK"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Contoh: {businessSettings.spkPrefix}/2024/03/001
                        </p>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="taxRate">Tarif Pajak (%)</FieldLabel>
                      <Input
                        id="taxRate"
                        type="number"
                        min={0}
                        max={100}
                        value={businessSettings.taxRate}
                        onChange={(e) =>
                          setBusinessSettings({
                            ...businessSettings,
                            taxRate: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Pajak akan diterapkan otomatis ke setiap invoice
                      </p>
                    </Field>

                    <Separator />

                    <div className="p-4 rounded-lg bg-muted/30">
                      <h4 className="font-medium mb-2">Template Invoice</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Preview template invoice yang akan dicetak
                      </p>
                      <Button variant="outline" size="sm">
                        Preview Template
                      </Button>
                    </div>

                    <Button onClick={handleSaveSettings}>
                      <Save className="mr-2 size-4" />
                      Simpan Perubahan
                    </Button>
                  </FieldGroup>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Notifikasi</CardTitle>
                  <CardDescription>
                    Atur preferensi notifikasi sistem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifikasi Email</p>
                        <p className="text-sm text-muted-foreground">
                          Terima notifikasi melalui email
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Pengingat SPK</p>
                        <p className="text-sm text-muted-foreground">
                          Notifikasi untuk SPK yang mendekati deadline
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.spkReminders}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            spkReminders: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Alert Pembayaran</p>
                        <p className="text-sm text-muted-foreground">
                          Notifikasi untuk invoice yang belum dibayar
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.paymentAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            paymentAlerts: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Laporan Harian</p>
                        <p className="text-sm text-muted-foreground">
                          Terima ringkasan harian via email
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.dailyReports}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            dailyReports: checked,
                          })
                        }
                      />
                    </div>

                    <Button onClick={handleSaveSettings}>
                      <Save className="mr-2 size-4" />
                      Simpan Perubahan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
