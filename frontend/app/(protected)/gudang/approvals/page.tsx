'use client'

import { useState } from 'react'
import { Check, X, Eye, Clock, AlertTriangle, FileText, Filter, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { approvalNotes, formatDate, type ApprovalNote } from '@/lib/gudang-data'
import { GudangHeader } from '@/components/gudang/gudang-header'

export default function ApprovalsPage() {
  const [selectedNote, setSelectedNote] = useState<ApprovalNote | null>(null)
  const [notes, setNotes] = useState(approvalNotes)
  const [typeFilter, setTypeFilter] = useState('all')
  const [rejectReason, setRejectReason] = useState('')

  const pendingNotes = notes.filter(n => n.status === 'pending')
  const approvedNotes = notes.filter(n => n.status === 'approved')
  const rejectedNotes = notes.filter(n => n.status === 'rejected')

  const handleApprove = (noteId: string) => {
    setNotes(prev => prev.map(n => 
      n.id === noteId ? { ...n, status: 'approved' as const } : n
    ))
    setSelectedNote(null)
  }

  const handleReject = (noteId: string) => {
    setNotes(prev => prev.map(n => 
      n.id === noteId ? { ...n, status: 'rejected' as const } : n
    ))
    setSelectedNote(null)
    setRejectReason('')
  }

  const filteredPending = typeFilter === 'all' 
    ? pendingNotes 
    : pendingNotes.filter(n => n.type === typeFilter)

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'pengeluaran': return 'Pengeluaran'
      case 'penerimaan': return 'Penerimaan'
      case 'transfer': return 'Transfer'
      default: return type
    }
  }

  return (
    <>
      <GudangHeader title="Validasi Nota" description="Kelola persetujuan nota pengeluaran dan penerimaan barang" />
      
      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">{pendingNotes.length}</div>
                <p className="text-[10px] text-slate-400 font-medium">Menunggu validasi</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-red-100 bg-red-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-red-600 uppercase tracking-wider">Urgent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {pendingNotes.filter(n => n.priority === 'urgent').length}
                </div>
                <p className="text-[10px] text-red-500/80 font-medium font-bold">Perlu segera diproses</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Disetujui Hari Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{approvedNotes.length}</div>
                <p className="text-[10px] text-slate-400 font-medium font-bold">Nota disetujui</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ditolak Hari Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-400">{rejectedNotes.length}</div>
                <p className="text-[10px] text-slate-400 font-medium font-bold">Nota ditolak</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="pending" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <TabsList className="bg-slate-100 p-1 rounded-xl">
                <TabsTrigger value="pending" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Clock className="size-4 mr-2" />
                  Pending
                  <Badge className="ml-2 bg-amber-500 text-white border-none h-5 px-1.5 min-w-[20px] justify-center">{pendingNotes.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="approved" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Check className="size-4 mr-2" />
                  Disetujui
                </TabsTrigger>
                <TabsTrigger value="rejected" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <X className="size-4 mr-2" />
                  Ditolak
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter:</span>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[160px] h-9 bg-white border-slate-200 text-xs font-semibold rounded-lg">
                    <Filter className="mr-2 size-3 text-slate-400" />
                    <SelectValue placeholder="Semua Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                    <SelectItem value="penerimaan">Penerimaan</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="pending" className="mt-0">
              {filteredPending.length > 0 ? (
                <div className="space-y-4">
                  {filteredPending.map((note) => (
                    <Card key={note.id} className={`shadow-sm transition-all hover:shadow-md ${note.priority === 'urgent' ? 'border-l-4 border-l-red-500' : 'border-slate-200'}`}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="space-y-4 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                <FileText className="size-5 text-slate-500" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-slate-900">{note.noteNumber}</span>
                                  {note.priority === 'urgent' && (
                                    <Badge className="bg-red-500 text-white border-none text-[9px] font-bold uppercase tracking-wider h-4 px-1.5">
                                      Urgent
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">
                                  {getTypeLabel(note.type)} • {formatDate(note.requestDate)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <div className="size-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-100">
                                  {note.requestedBy.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Diminta Oleh</p>
                                  <p className="text-sm font-bold text-slate-700">{note.requestedBy}</p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1.5 items-center">
                                {note.items.map((item, idx) => (
                                  <Badge key={idx} variant="outline" className="text-[10px] bg-white border-slate-200 text-slate-600 font-medium px-2 py-0">
                                    {item.partName} x{item.quantity}
                                  </Badge>
                                ))}
                                {note.totalItems > 3 && <span className="text-[10px] text-slate-400 font-bold">+{note.totalItems - 3} lagi</span>}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="flex-1 lg:w-32 h-9 text-xs font-bold border-slate-200 hover:bg-slate-50">
                                  <Eye className="mr-2 size-3 text-slate-500" />
                                  Detail Data
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Detail Nota {note.noteNumber}</DialogTitle>
                                  <DialogDescription>Review permintaan sebelum memberikan keputusan</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                                    <div className="bg-slate-50 p-3 rounded-xl">
                                      <p className="text-slate-400 mb-1">Tipe Nota</p>
                                      <p className="font-bold text-slate-900">{getTypeLabel(note.type)}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl">
                                      <p className="text-slate-400 mb-1">Prioritas</p>
                                      <p className={`font-bold ${note.priority === 'urgent' ? 'text-red-500' : 'text-blue-500'}`}>{note.priority.toUpperCase()}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl col-span-2 flex items-center justify-between">
                                      <div>
                                        <p className="text-slate-400 mb-1">Diminta oleh</p>
                                        <p className="font-bold text-slate-900">{note.requestedBy}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-slate-400 mb-1">Tanggal</p>
                                        <p className="font-bold text-slate-900">{formatDate(note.requestDate)}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Daftar Item ({note.totalItems})</p>
                                    <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100 bg-white">
                                      {note.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3">
                                          <div>
                                            <p className="font-bold text-sm text-slate-900">{item.partName}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">{item.partCode}</p>
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-xs text-slate-400">Qty:</span>
                                            <Badge variant="secondary" className="bg-slate-900 text-[#FFC107] border-none font-bold">x{item.quantity}</Badge>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter className="gap-2 sm:gap-0">
                                  <Button variant="ghost" className="text-slate-500 font-bold hover:bg-slate-100" onClick={() => setSelectedNote(null)}>Tutup</Button>
                                  <div className="flex flex-1 gap-2">
                                    <Button variant="destructive" className="flex-1 font-bold h-11" onClick={() => handleReject(note.id)}>
                                      <X className="mr-2 size-4" />
                                      Tolak
                                    </Button>
                                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11" onClick={() => handleApprove(note.id)}>
                                      <Check className="mr-2 size-4" />
                                      Setujui
                                    </Button>
                                  </div>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <div className="flex gap-2">
                              <Button variant="ghost" className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all" onClick={() => handleReject(note.id)}>
                                <X className="size-4" />
                              </Button>
                              <Button className="h-9 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm shadow-emerald-200 transition-all active:scale-95" onClick={() => handleApprove(note.id)}>
                                <Check className="mr-2 size-3" />
                                Setujui
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed border-2 border-slate-200 bg-white">
                  <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="size-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                      <Check className="size-8 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Semua Beres!</h3>
                    <p className="text-sm text-slate-500 max-w-xs mt-1">Tidak ada nota pending yang menunggu validasi saat ini.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="approved" className="mt-0 space-y-4">
              {approvedNotes.map((note) => (
                <Card key={note.id} className="border-slate-200 shadow-sm opacity-80 transition-opacity hover:opacity-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Check className="size-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-700 text-sm">{note.noteNumber}</span>
                            <Badge className="bg-emerald-100 text-emerald-700 border-none text-[8px] font-bold uppercase py-0 px-1.5 h-3.5">Approved</Badge>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">{note.requestedBy} • {note.totalItems} item</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{formatDate(note.requestDate)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="rejected" className="mt-0 space-y-4">
              {rejectedNotes.map((note) => (
                <Card key={note.id} className="border-slate-200 shadow-sm opacity-80 hover:opacity-100 border-l-4 border-l-slate-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-slate-100 flex items-center justify-center">
                          <X className="size-4 text-slate-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-700 text-sm">{note.noteNumber}</span>
                            <Badge className="bg-slate-200 text-slate-600 border-none text-[8px] font-bold uppercase py-0 px-1.5 h-3.5">Rejected</Badge>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">{note.requestedBy} • {note.totalItems} item</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{formatDate(note.requestDate)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </>
  )
}
