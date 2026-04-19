// src/services/report.service.ts

import { prisma } from '../config/database.config';

export class ReportService {
  async getDashboardSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todayWorkOrders,
      activeWorkOrders,
      monthlyRevenue,
      totalCustomers,
      lowStockCount,
      pendingInvoices,
    ] = await Promise.all([
      // Today's work orders
      prisma.workOrder.count({
        where: { createdAt: { gte: today } },
      }),

      // Active work orders
      prisma.workOrder.count({
        where: {
          status: { in: ['PENDING', 'IN_PROGRESS', 'WAITING_PARTS', 'QUALITY_CHECK'] },
        },
      }),

      // Monthly revenue
      prisma.payment.aggregate({
        where: {
          paymentDate: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),

      // Total active customers
      prisma.customer.count({
        where: { isActive: true },
      }),

      // Low stock items count
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM spareparts 
        WHERE stock_quantity <= min_stock AND is_active = true
      `,

      // Pending invoices
      prisma.invoice.count({
        where: { status: { in: ['DRAFT', 'SENT', 'PARTIAL'] } },
      }),
    ]);

    return {
      todayWorkOrders,
      activeWorkOrders,
      monthlyRevenue: monthlyRevenue._sum.amount || 0,
      totalCustomers,
      lowStockCount: Number(lowStockCount[0]?.count || 0),
      pendingInvoices,
    };
  }

  async getRevenueReport(startDate: Date, endDate: Date) {
    const payments = await prisma.payment.groupBy({
      by: ['paymentMethod'],
      where: {
        paymentDate: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
      _count: true,
    });

    const totalRevenue = await prisma.payment.aggregate({
      where: {
        paymentDate: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
      _count: true,
    });

    return {
      total: totalRevenue._sum.amount || 0,
      count: totalRevenue._count,
      byMethod: payments,
    };
  }

  async getMechanicPerformance(startDate: Date, endDate: Date) {
    const mechanics = await prisma.user.findMany({
      where: { role: 'MEKANIK', isActive: true },
      select: {
        id: true,
        name: true,
        assignedWorkOrders: {
          where: {
            createdAt: { gte: startDate, lte: endDate },
          },
          select: {
            id: true,
            status: true,
            grandTotal: true,
          },
        },
      },
    });

    return mechanics.map((m) => ({
      id: m.id,
      name: m.name,
      totalOrders: m.assignedWorkOrders.length,
      completed: m.assignedWorkOrders.filter(
        (wo) => wo.status === 'COMPLETED' || wo.status === 'INVOICED'
      ).length,
      inProgress: m.assignedWorkOrders.filter(
        (wo) => wo.status === 'IN_PROGRESS'
      ).length,
      totalRevenue: m.assignedWorkOrders.reduce(
        (sum, wo) => sum + Number(wo.grandTotal),
        0
      ),
    }));
  }

  async getWorkOrderStats(startDate: Date, endDate: Date) {
    const byStatus = await prisma.workOrder.groupBy({
      by: ['status'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: true,
    });

    const byPriority = await prisma.workOrder.groupBy({
      by: ['priority'],
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      _count: true,
    });

    return { byStatus, byPriority };
  }
}

export const reportService = new ReportService();
