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
  Loader2,
} from "lucide-react"

import useSWR from "swr"
import { api, fetcher } from "@/lib/api-client"
import { toast } from "sonner"

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

// Hardcoded data removed, using SWR now

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

function ApprovalDetailDialog({ workOrderId, basicData, onApprove, onReject }: { workOrderId: string; basicData: any; onApprove: () => void; onReject: (reason: string) => void }) {
  const [rejectReason, setRejectReason] = React.useState("")
  const [showRejectForm, setShowRejectForm] = React.useState(false)

  const { data: detailData, isLoading } = useSWR(`/work-orders/${workOrderId}`, fetcher)
  const approval = detailData?.data || basicData

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Detail Quotation {approval.orderNumber}
        </DialogTitle>
        <DialogDescription>
          Dibuat oleh {approval.createdBy?.name || '-'} pada {formatDateTime(approval.createdAt)}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold"><User className="size-4" /> Informasi Pelanggan</h4>
            <div className="rounded-lg border p-3 text-sm">
              <p className="font-medium">{approval.customer?.name}</p>
              <p className="text-muted-foreground">{approval.customer?.phone}</p>
              <p className="text-muted-foreground">{approval.customer?.email || '-'}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold"><Car className="size-4" /> Informasi Kendaraan</h4>
            <div className="rounded-lg border p-3 text-sm">
              <p className="font-medium">{approval.vehicle?.brand} {approval.vehicle?.model}</p>
              <p className="text-muted-foreground">{approval.vehicle?.licensePlate}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-semibold"><Wrench className="size-4" /> Layanan & Sparepart</h4>
          <div className="rounded-lg border">
            <Table>
              <TableHeader><TableRow><TableHead>Item</TableHead><TableHead className="text-right">Harga</TableHead></TableRow></TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={2} className="text-center h-24"><Loader2 className="size-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                ) : (
                  <>
                    {approval.services?.map((s: any, index: number) => (
                      <TableRow key={`srv-${index}`}><TableCell>{s.service?.name || 'Layanan'}</TableCell><TableCell className="text-right">{formatRupiah(Number(s.totalPrice))}</TableCell></TableRow>
                    ))}
                    {approval.spareparts?.map((p: any, index: number) => (
                      <TableRow key={`part-${index}`}><TableCell>{p.sparepart?.name || 'Sparepart'} ({p.quantity} {p.sparepart?.unit})</TableCell><TableCell className="text-right">{formatRupiah(Number(p.totalPrice))}</TableCell></TableRow>
                    ))}
                    {(!approval.services?.length && !approval.spareparts?.length) && (
                      <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">Tidak ada item</TableCell></TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex justify-between text-sm"><span>Subtotal (Layanan & Sparepart)</span><span>{formatRupiah(Number(approval.totalServiceCost) + Number(approval.totalPartsCost))}</span></div>
          {Number(approval.discountAmount) > 0 && (<div className="flex justify-between text-sm text-destructive"><span>Diskon</span><span>-{formatRupiah(Number(approval.discountAmount))}</span></div>)}
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold"><span>Total</span><span className="text-lg">{formatRupiah(Number(approval.grandTotal))}</span></div>
        </div>

        {approval.customerComplaints && (
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold"><MessageSquare className="size-4" /> Keluhan Pelanggan</h4>
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">{approval.customerComplaints}</p>
          </div>
        )}
        {approval.internalNotes && (
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold"><MessageSquare className="size-4" /> Catatan Internal</h4>
            <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">{approval.internalNotes}</p>
          </div>
        )}

        {showRejectForm && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Alasan Penolakan</h4>
            <Textarea placeholder="Masukkan alasan penolakan..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
          </div>
        )}
      </div>

      <DialogFooter className="gap-2 sm:gap-0 mt-4">
        {!showRejectForm ? (
          <>
            <Button variant="outline" onClick={() => setShowRejectForm(true)}><XCircle className="mr-2 size-4" /> Tolak</Button>
            <Button onClick={onApprove} className="bg-emerald-500 hover:bg-emerald-600"><CheckCircle className="mr-2 size-4" /> Setujui</Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setShowRejectForm(false)}>Batal</Button>
            <Button variant="destructive" onClick={() => onReject(rejectReason)} disabled={!rejectReason.trim()}><XCircle className="mr-2 size-4" /> Konfirmasi Tolak</Button>
          </>
        )}
      </DialogFooter>
    </DialogContent>
  )
}

export default function ApprovalsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterPriority, setFilterPriority] = React.useState("all")

  // Fetch work orders
  const { data: woData, isLoading, mutate } = useSWR("/work-orders?limit=100", fetcher)
  const allWorkOrders = woData?.data?.data || []

  const pendingApprovals = allWorkOrders.filter((wo: any) => wo.status === "PENDING")
  const approvalHistory = allWorkOrders.filter((wo: any) => ["IN_PROGRESS", "QUALITY_CHECK", "COMPLETED", "INVOICED", "CANCELLED"].includes(wo.status))
  const approvedCount = approvalHistory.filter((wo: any) => wo.status !== "CANCELLED").length
  const rejectedCount = approvalHistory.filter((wo: any) => wo.status === "CANCELLED").length

  const filteredApprovals = pendingApprovals.filter(
    (approval: any) => {
      const matchSearch = approval.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          approval.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchPriority = filterPriority === "all" || approval.priority?.toLowerCase() === filterPriority.toLowerCase()
      return matchSearch && matchPriority
    }
  )

  const handleApprove = async (workOrderId: string) => { 
    try {
      await api.put(`/work-orders/${workOrderId}/status`, { status: "IN_PROGRESS", notes: "Disetujui oleh Pimpinan" })
      toast.success("Quotation berhasil disetujui")
      mutate()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal menyetujui quotation")
    }
  }

  const handleReject = async (workOrderId: string, reason: string) => { 
    try {
      await api.put(`/work-orders/${workOrderId}/status`, { status: "CANCELLED", notes: reason })
      toast.success("Quotation telah ditolak")
      mutate()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal menolak quotation")
    }
  }

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
              <div className="text-2xl font-bold text-emerald-500">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">quotation approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ditolak</CardTitle>
              <XCircle className="size-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{rejectedCount}</div>
              <p className="text-xs text-muted-foreground">quotation rejected</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Nilai Pending</CardTitle>
              <FileText className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRupiah(pendingApprovals.reduce((sum: number, a: any) => sum + Number(a.grandTotal), 0))}</div>
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
              <Select value={filterPriority} onValueChange={setFilterPriority}>
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
              {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>
              ) : filteredApprovals.length === 0 ? (
                <Card><CardContent className="p-8 text-center text-muted-foreground">Tidak ada quotation yang menunggu approval.</CardContent></Card>
              ) : filteredApprovals.map((approval: any) => (
                <Card key={approval.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="size-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{approval.orderNumber}</h3>
                            <Badge
                              variant={approval.priority === "HIGH" || approval.priority === "URGENT" ? "destructive" : approval.priority === "NORMAL" ? "secondary" : "outline"}
                              className={approval.priority === "HIGH" || approval.priority === "URGENT" ? "bg-destructive hover:bg-destructive/90" : approval.priority === "NORMAL" ? "bg-amber-500 hover:bg-amber-600 text-white border-0" : "border-muted-foreground/30"}
                            >
                              Prioritas {approval.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {approval.customer?.name} • {approval.vehicle?.brand} {approval.vehicle?.model} ({approval.vehicle?.licensePlate})
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {approval._count?.services || 0} layanan • Dibuat {formatDateTime(approval.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold">{formatRupiah(Number(approval.grandTotal))}</p>
                          {Number(approval.discountAmount) > 0 && (<p className="text-xs text-destructive">Diskon: {formatRupiah(Number(approval.discountAmount))}</p>)}
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm"><Eye className="mr-2 size-4" /> Detail</Button>
                            </DialogTrigger>
                            <ApprovalDetailDialog
                              workOrderId={approval.id}
                              basicData={approval}
                              onApprove={() => handleApprove(approval.id)}
                              onReject={(reason) => handleReject(approval.id, reason)}
                            />
                          </Dialog>
                          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600" onClick={() => handleApprove(approval.id)}>
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
                    {approvalHistory.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Belum ada riwayat approval</TableCell></TableRow>
                    ) : approvalHistory.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.orderNumber}</TableCell>
                        <TableCell>{item.customer?.name}</TableCell>
                        <TableCell className="text-right">{formatRupiah(Number(item.grandTotal))}</TableCell>
                        <TableCell>
                          <Badge variant={item.status !== "CANCELLED" ? "default" : "destructive"} className={item.status !== "CANCELLED" ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                            {item.status !== "CANCELLED" ? <CheckCircle className="mr-1 size-3" /> : <XCircle className="mr-1 size-3" />}
                            {item.status !== "CANCELLED" ? "Disetujui" : "Ditolak"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDateTime(item.updatedAt)}</TableCell>
                        <TableCell>{item.updatedBy?.name || '-'}</TableCell>
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
