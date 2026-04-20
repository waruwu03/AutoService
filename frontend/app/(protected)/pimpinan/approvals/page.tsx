"use client"

import * as React from "react"
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Search,
  Download,
  AlertCircle,
  MessageSquare,
  User,
  Car,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PimpinanHeader } from "@/components/pimpinan/pimpinan-header"

const pendingApprovals = [
  {
    id: 1,
    spkNumber: "SPK-2024-0150",
    customer: { name: "PT Maju Bersama", phone: "021-5551234", email: "fleet@majubersama.co.id" },
    vehicle: { brand: "Toyota", model: "Avanza", year: 2022, plate: "B 1234 ABC" },
    services: [
      { name: "Servis Berkala 40.000 KM", price: 2500000 },
      { name: "Ganti Kampas Rem Depan & Belakang", price: 1200000 },
      { name: "Ganti V-Belt", price: 850000 },
    ],
    totalAmount: 4550000,
    discount: 455000,
    finalAmount: 4095000,
    createdAt: "2024-11-15T10:30:00",
    createdBy: "Dewi (Service Advisor)",
    priority: "high",
    notes: "Pelanggan fleet, minta diskon 10%",
  },
  {
    id: 2,
    spkNumber: "SPK-2024-0149",
    customer: { name: "Ahmad Wijaya", phone: "0812-3456-7890", email: "ahmad.wijaya@gmail.com" },
    vehicle: { brand: "Honda", model: "Civic", year: 2020, plate: "B 5678 DEF" },
    services: [
      { name: "Overhaul AC Kompresor", price: 3500000 },
      { name: "Ganti Freon + Evaporator Clean", price: 750000 },
    ],
    totalAmount: 4250000,
    discount: 0,
    finalAmount: 4250000,
    createdAt: "2024-11-15T09:15:00",
    createdBy: "Rina (Service Advisor)",
    priority: "medium",
    notes: "Customer complaint AC tidak dingin sudah 2 minggu",
  },
  {
    id: 3,
    spkNumber: "SPK-2024-0148",
    customer: { name: "Siti Rahayu", phone: "0815-9876-5432", email: "siti.r@yahoo.com" },
    vehicle: { brand: "Daihatsu", model: "Xenia", year: 2019, plate: "B 9012 GHI" },
    services: [
      { name: "Tune Up Mesin Lengkap", price: 1500000 },
      { name: "Ganti Busi Iridium 4 pcs", price: 480000 },
      { name: "Ganti Oli Mesin + Filter", price: 550000 },
    ],
    totalAmount: 2530000,
    discount: 0,
    finalAmount: 2530000,
    createdAt: "2024-11-14T16:45:00",
    createdBy: "Dewi (Service Advisor)",
    priority: "low",
    notes: "",
  },
]

const approvalHistory = [
  { spkNumber: "SPK-2024-0145", customer: "Riko Santoso", amount: 2500000, status: "approved", approvedAt: "2024-11-15T08:30:00", approvedBy: "Budi Santoso" },
  { spkNumber: "SPK-2024-0144", customer: "Dewi Lestari", amount: 1500000, status: "approved", approvedAt: "2024-11-14T17:00:00", approvedBy: "Budi Santoso" },
  { spkNumber: "SPK-2024-0140", customer: "PT Jaya Abadi", amount: 12500000, status: "rejected", approvedAt: "2024-11-14T10:00:00", approvedBy: "Budi Santoso", rejectReason: "Harga tidak sesuai standar" },
  { spkNumber: "SPK-2024-0138", customer: "Andi Kurniawan", amount: 3750000, status: "approved", approvedAt: "2024-11-13T15:45:00", approvedBy: "Budi Santoso" },
]

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

function ApprovalDetailDialog({ approval, onApprove, onReject }: { approval: (typeof pendingApprovals)[0]; onApprove: () => void; onReject: () => void }) {
  const [rejectReason, setRejectReason] = React.useState("")
  const [showRejectForm, setShowRejectForm] = React.useState(false)

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Detail Quotation {approval.spkNumber}
        </DialogTitle>
        <DialogDescription>
          Dibuat oleh {approval.createdBy} pada {formatDateTime(approval.createdAt)}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold"><User className="size-4" /> Informasi Pelanggan</h4>
            <div className="rounded-lg border p-3 text-sm">
              <p className="font-medium">{approval.customer.name}</p>
              <p className="text-muted-foreground">{approval.customer.phone}</p>
              <p className="text-muted-foreground">{approval.customer.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold"><Car className="size-4" /> Informasi Kendaraan</h4>
            <div className="rounded-lg border p-3 text-sm">
              <p className="font-medium">{approval.vehicle.brand} {approval.vehicle.model} ({approval.vehicle.year})</p>
              <p className="text-muted-foreground">{approval.vehicle.plate}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-semibold"><Wrench className="size-4" /> Layanan & Sparepart</h4>
          <div className="rounded-lg border">
            <Table>
              <TableHeader><TableRow><TableHead>Item</TableHead><TableHead className="text-right">Harga</TableHead></TableRow></TableHeader>
              <TableBody>
                {approval.services.map((service, index) => (
                  <TableRow key={index}><TableCell>{service.name}</TableCell><TableCell className="text-right">{formatRupiah(service.price)}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatRupiah(approval.totalAmount)}</span></div>
          {approval.discount > 0 && (<div className="flex justify-between text-sm text-destructive"><span>Diskon</span><span>-{formatRupiah(approval.discount)}</span></div>)}
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold"><span>Total</span><span className="text-lg">{formatRupiah(approval.finalAmount)}</span></div>
        </div>

        {approval.notes && (
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold"><MessageSquare className="size-4" /> Catatan</h4>
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">{approval.notes}</p>
          </div>
        )}

        {showRejectForm && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Alasan Penolakan</h4>
            <Textarea placeholder="Masukkan alasan penolakan..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
          </div>
        )}
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        {!showRejectForm ? (
          <>
            <Button variant="outline" onClick={() => setShowRejectForm(true)}><XCircle className="mr-2 size-4" /> Tolak</Button>
            <Button onClick={onApprove} className="bg-emerald-500 hover:bg-emerald-600"><CheckCircle className="mr-2 size-4" /> Setujui</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setShowRejectForm(false)}>Batal</Button>
            <Button variant="destructive" onClick={onReject} disabled={!rejectReason.trim()}><XCircle className="mr-2 size-4" /> Konfirmasi Tolak</Button>
          </>
        )}
      </DialogFooter>
    </DialogContent>
  )
}

export default function ApprovalsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredApprovals = pendingApprovals.filter(
    (approval) =>
      approval.spkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleApprove = (spkNumber: string) => { console.log("Approved:", spkNumber) }
  const handleReject = (spkNumber: string) => { console.log("Rejected:", spkNumber) }

  return (
    <>
      <PimpinanHeader title="Approval Quotation" description="Kelola persetujuan SPK" />
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Menunggu Approval</CardTitle>
              <Clock className="size-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{pendingApprovals.length}</div>
              <p className="text-xs text-muted-foreground">quotation pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Disetujui Hari Ini</CardTitle>
              <CheckCircle className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">2</div>
              <p className="text-xs text-muted-foreground">quotation approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ditolak Hari Ini</CardTitle>
              <XCircle className="size-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">0</div>
              <p className="text-xs text-muted-foreground">quotation rejected</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Nilai Pending</CardTitle>
              <FileText className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRupiah(pendingApprovals.reduce((sum, a) => sum + a.finalAmount, 0))}</div>
              <p className="text-xs text-muted-foreground">menunggu approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2"><Clock className="size-4" /> Pending <Badge variant="secondary" className="ml-1">{pendingApprovals.length}</Badge></TabsTrigger>
            <TabsTrigger value="history" className="gap-2"><FileText className="size-4" /> Riwayat</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Cari SPK atau customer..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Prioritas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="high">Tinggi</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="low">Rendah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {filteredApprovals.map((approval) => (
                <Card key={approval.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="size-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{approval.spkNumber}</h3>
                            <Badge
                              variant={approval.priority === "high" ? "destructive" : approval.priority === "medium" ? "secondary" : "outline"}
                              className={approval.priority === "high" ? "bg-destructive hover:bg-destructive/90" : approval.priority === "medium" ? "bg-amber-500 hover:bg-amber-600 text-white border-0" : "border-muted-foreground/30"}
                            >
                              {approval.priority === "high" ? "Prioritas Tinggi" : approval.priority === "medium" ? "Prioritas Sedang" : "Prioritas Rendah"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {approval.customer.name} • {approval.vehicle.brand} {approval.vehicle.model} ({approval.vehicle.plate})
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {approval.services.length} layanan • Dibuat {formatDateTime(approval.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold">{formatRupiah(approval.finalAmount)}</p>
                          {approval.discount > 0 && (<p className="text-xs text-destructive">Diskon: {formatRupiah(approval.discount)}</p>)}
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm"><Eye className="mr-2 size-4" /> Detail</Button>
                            </DialogTrigger>
                            <ApprovalDetailDialog
                              approval={approval}
                              onApprove={() => handleApprove(approval.spkNumber)}
                              onReject={() => handleReject(approval.spkNumber)}
                            />
                          </Dialog>
                          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600" onClick={() => handleApprove(approval.spkNumber)}>
                            <CheckCircle className="mr-2 size-4" /> Setujui
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Approval</CardTitle>
                <CardDescription>Quotation yang sudah diproses</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SPK</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Diproses</TableHead>
                      <TableHead>Oleh</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalHistory.map((item) => (
                      <TableRow key={item.spkNumber}>
                        <TableCell className="font-medium">{item.spkNumber}</TableCell>
                        <TableCell>{item.customer}</TableCell>
                        <TableCell className="text-right">{formatRupiah(item.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={item.status === "approved" ? "default" : "destructive"} className={item.status === "approved" ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                            {item.status === "approved" ? <CheckCircle className="mr-1 size-3" /> : <XCircle className="mr-1 size-3" />}
                            {item.status === "approved" ? "Disetujui" : "Ditolak"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDateTime(item.approvedAt)}</TableCell>
                        <TableCell>{item.approvedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
