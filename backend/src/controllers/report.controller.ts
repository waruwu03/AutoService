// src/controllers/report.controller.ts

import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';
import { sendSuccess } from '../utils/response.util';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

export class ReportController {
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : new Date();
        
      const summary = await reportService.getDashboardSummary(startDate, endDate);
      sendSuccess(res, summary);
    } catch (error) {
      next(error);
    }
  }

  async getRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const startDate = new Date(
        (req.query.startDate as string) || new Date().toISOString().slice(0, 8) + '01'
      );
      const endDate = new Date(
        (req.query.endDate as string) || new Date().toISOString()
      );

      const report = await reportService.getRevenueReport(startDate, endDate);
      sendSuccess(res, report);
    } catch (error) {
      next(error);
    }
  }

  async getRevenueTimeSeries(req: Request, res: Response, next: NextFunction) {
    try {
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const startDate = (req.query.startDate as string) ? new Date(req.query.startDate as string) : sevenDaysAgo;
      const endDate = (req.query.endDate as string) ? new Date(req.query.endDate as string) : now;

      const report = await reportService.getRevenueTimeSeries(startDate, endDate);
      sendSuccess(res, report);
    } catch (error) {
      next(error);
    }
  }

  async getMechanicPerformance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const startDate = new Date(
        (req.query.startDate as string) || new Date().toISOString().slice(0, 8) + '01'
      );
      const endDate = new Date(
        (req.query.endDate as string) || new Date().toISOString()
      );

      const report = await reportService.getMechanicPerformance(
        startDate,
        endDate
      );
      sendSuccess(res, report);
    } catch (error) {
      next(error);
    }
  }

  async getWorkOrderStats(req: Request, res: Response, next: NextFunction) {
    try {
      const startDate = new Date(
        (req.query.startDate as string) || new Date().toISOString().slice(0, 8) + '01'
      );
      const endDate = new Date(
        (req.query.endDate as string) || new Date().toISOString()
      );

      const report = await reportService.getWorkOrderStats(
        startDate,
        endDate
      );
      sendSuccess(res, report);
    } catch (error) {
      next(error);
    }
  }

  async exportReport(req: Request, res: Response, next: NextFunction) {
    try {
      const type = (req.query.type as string) || 'revenue';
      const format = (req.query.format as string) || 'excel';
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      let filename = `laporan-${type}-${now.toISOString().split('T')[0]}`;
      
      if (format === 'excel') {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Laporan');
        
        switch (type) {
          case 'revenue': {
            const report = await reportService.getRevenueReport(startOfMonth, now);
            sheet.columns = [
              { header: 'Metode Pembayaran', key: 'method', width: 25 },
              { header: 'Jumlah Transaksi', key: 'count', width: 20 },
              { header: 'Total Nominal', key: 'amount', width: 20 },
            ];
            if (report.byMethod) {
              report.byMethod.forEach((m: any) => {
                sheet.addRow({
                  method: m.paymentMethod,
                  count: m._count,
                  amount: Number(m._sum?.amount || 0),
                });
              });
            }
            break;
          }
          case 'mekanik': {
            const mechanics = await reportService.getMechanicPerformance(startOfMonth, now);
            sheet.columns = [
              { header: 'Nama Mekanik', key: 'name', width: 25 },
              { header: 'Total Order', key: 'total', width: 15 },
              { header: 'Selesai', key: 'completed', width: 15 },
              { header: 'Dalam Proses', key: 'inProgress', width: 15 },
              { header: 'Total Revenue', key: 'revenue', width: 20 },
            ];
            mechanics.forEach((m: any) => {
              sheet.addRow({
                name: m.name,
                total: m.totalOrders,
                completed: m.completed,
                inProgress: m.inProgress,
                revenue: Number(m.totalRevenue),
              });
            });
            break;
          }
          case 'inventory': {
            const inventory = await reportService.getInventoryReport();
            sheet.columns = [
              { header: 'Nama Barang', key: 'name', width: 30 },
              { header: 'Stok', key: 'stock', width: 15 },
              { header: 'Min Stok', key: 'min', width: 15 },
              { header: 'Harga', key: 'price', width: 20 },
            ];
            inventory.items.forEach((i: any) => {
              sheet.addRow({
                name: i.name,
                stock: i.stockQuantity,
                min: i.minStock,
                price: Number(i.price),
              });
            });
            break;
          }
          default: {
            const dash = await reportService.getDashboardSummary(startOfMonth, now);
            sheet.columns = [
              { header: 'Metrik', key: 'metric', width: 30 },
              { header: 'Nilai', key: 'value', width: 20 },
            ];
            sheet.addRows([
              { metric: 'SPK Selesai', value: dash.completedOrders },
              { metric: 'SPK Aktif', value: dash.activeWorkOrders },
              { metric: 'Pendapatan Periode Ini', value: dash.totalRevenue },
              { metric: 'Total Pelanggan', value: dash.totalCustomers },
              { metric: 'Stok Menipis', value: dash.lowStockCount },
            ]);
          }
        }
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
        await workbook.xlsx.write(res);
        return res.end();
        
      } else if (format === 'pdf') {
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
        doc.pipe(res);
        
        // Header with "Logo"
        doc.rect(0, 0, 612, 80).fill('#18181b'); // Dark industrial header
        doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('AUTO', 50, 25, { continued: true }).fillColor('#f97316').text('SERVIS');
        doc.fillColor('#94a3b8').fontSize(10).font('Helvetica').text('EXECUTIVE PORTAL ANALYTICS', 50, 52);
        
        doc.moveDown(4);
        
        // Report Info
        doc.fillColor('#1f2937').fontSize(16).font('Helvetica-Bold').text(`LAPORAN ${type.toUpperCase()}`);
        doc.fontSize(10).font('Helvetica').fillColor('#6b7280').text(`Dicetak pada: ${now.toLocaleString('id-ID')}`);
        doc.moveDown();
        doc.path('M 50 145 L 562 145').lineWidth(1).strokeColor('#e5e7eb').stroke();
        doc.moveDown(2);
        
        doc.fillColor('#374151');
        
        switch (type) {
          case 'revenue': {
            const report = await reportService.getRevenueReport(startOfMonth, now);
            const dash = await reportService.getDashboardSummary(startOfMonth, now);
            
            // Summary Cards (simulated in PDF)
            doc.fontSize(12).font('Helvetica-Bold').text('RINGKASAN PENDAPATAN');
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica').text(`Total Pendapatan: `, { continued: true }).font('Helvetica-Bold').text(`Rp ${Number(report.total).toLocaleString('id-ID')}`);
            doc.font('Helvetica').text(`Jumlah Transaksi: `, { continued: true }).font('Helvetica-Bold').text(`${report.count}`);
            doc.moveDown();
            
            doc.fontSize(12).font('Helvetica-Bold').text('METODE PEMBAYARAN');
            doc.moveDown(0.5);
            if (report.byMethod) {
              report.byMethod.forEach((m: any) => {
                doc.fontSize(10).font('Helvetica').text(`${m.paymentMethod}: `, { continued: true }).font('Helvetica-Bold').text(`Rp ${Number(m._sum?.amount || 0).toLocaleString('id-ID')} (${m._count} Transaksi)`);
              });
            }
            break;
          }
          case 'mekanik': {
            const mechanics = await reportService.getMechanicPerformance(startOfMonth, now);
            doc.fontSize(12).font('Helvetica-Bold').text('PERFORMA MEKANIK');
            doc.moveDown();
            
            mechanics.forEach((m: any, idx: number) => {
              doc.fontSize(10).font('Helvetica-Bold').text(`${idx + 1}. ${m.name}`);
              doc.fontSize(9).font('Helvetica').fillColor('#6b7280').text(`   Total Order: ${m.totalOrders} | Selesai: ${m.completed} | Revenue: Rp ${Number(m.totalRevenue).toLocaleString('id-ID')}`);
              doc.moveDown(0.5);
            });
            break;
          }
          case 'inventory': {
            const inventory = await reportService.getInventoryReport();
            doc.fontSize(12).font('Helvetica-Bold').text('STATUS INVENTORY');
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica').text(`Total Item Aktif: ${inventory.totalItems}`);
            doc.fillColor('#ef4444').text(`Stok Menipis: ${inventory.lowStockCount}`);
            doc.moveDown();
            
            doc.fillColor('#374151').fontSize(11).font('Helvetica-Bold').text('DAFTAR STOK (20 TERATAS)');
            doc.moveDown(0.5);
            inventory.items.slice(0, 20).forEach((i: any) => {
              const status = i.stockQuantity <= i.minStock ? '(LOW)' : '';
              doc.fontSize(9).font('Helvetica').text(`${i.name.padEnd(40)} | Stok: ${i.stockQuantity} ${i.unit} ${status}`);
            });
            break;
          }
          default: {
            const dash = await reportService.getDashboardSummary(startOfMonth, now);
            doc.fontSize(12).font('Helvetica-Bold').text('RINGKASAN DASHBOARD');
            doc.moveDown();
            doc.fontSize(10).font('Helvetica').text(`SPK Aktif: ${dash.activeWorkOrders}`);
            doc.text(`SPK Selesai: ${dash.completedOrders}`);
            doc.text(`Pendapatan Periode Ini: Rp ${Number(dash.totalRevenue).toLocaleString('id-ID')}`);
            doc.text(`Invoice Pending: ${dash.pendingInvoices}`);
          }
        }
        
        // Footer
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
          doc.switchToPage(i);
          doc.fontSize(8).fillColor('#94a3b8').text(
            `Halaman ${i + 1} dari ${range.count} - AutoServis Management System`,
            50,
            740,
            { align: 'center' }
          );
        }
        
        doc.end();
        return;
      }
      
      throw new Error('Unsupported format');
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();
