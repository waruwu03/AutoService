// src/services/report.service.ts

import { prisma } from '../config/database.config';

export class ReportService {
  async getDashboardSummary(startDate: Date, endDate: Date) {
    // 6 months ago for chart data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [
      completedOrders,
      activeWorkOrders,
      totalRevenue,
      totalCustomers,
      lowStockCount,
      pendingInvoices,
      sixMonthsPayments,
      serviceBreakdownRaw,
    ] = await Promise.all([
      // Completed work orders in the period
      prisma.workOrder.count({
        where: { 
          status: { in: ['COMPLETED', 'INVOICED'] },
          createdAt: { gte: startDate, lte: endDate }
        },
      }),

      // Active work orders
      prisma.workOrder.count({
        where: {
          status: { in: ['PENDING', 'IN_PROGRESS', 'WAITING_PARTS', 'QUALITY_CHECK'] },
        },
      }),

      // Revenue in the period
      prisma.payment.aggregate({
        where: {
          paymentDate: { gte: startDate, lte: endDate },
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

      // For Monthly Revenue Stats (last 6 months)
      prisma.payment.findMany({
        where: {
          paymentDate: { gte: sixMonthsAgo }
        },
        select: {
          paymentDate: true,
          amount: true
        }
      }),

      // For Service Breakdown
      prisma.workOrderService.findMany({
        where: {
          createdAt: { gte: startDate, lte: endDate }
        },
        include: {
          service: true
        }
      })
    ]);

    // Process Service Breakdown
    const serviceCategories: Record<string, number> = {};
    let totalServices = 0;
    serviceBreakdownRaw.forEach(item => {
      const cat = item.service.category.replace(/_/g, ' ');
      serviceCategories[cat] = (serviceCategories[cat] || 0) + 1;
      totalServices++;
    });

    const serviceBreakdown = Object.entries(serviceCategories)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalServices > 0 ? Math.round((count / totalServices) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5

    // Process Monthly Revenue Stats (Bar Chart)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    const monthlyStatsMap: Record<string, number> = {};
    
    sixMonthsPayments.forEach(p => {
      const m = `${p.paymentDate.getFullYear()}-${p.paymentDate.getMonth()}`;
      monthlyStatsMap[m] = (monthlyStatsMap[m] || 0) + Number(p.amount);
    });

    const monthlyRevenueStats = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mKey = `${d.getFullYear()}-${d.getMonth()}`;
      
      monthlyRevenueStats.push({
        month: monthNames[d.getMonth()],
        target: 50, // default dummy target in millions
        realisasi: Number(((monthlyStatsMap[mKey] || 0) / 1000000).toFixed(1)) // Convert to millions
      });
    }

    return {
      completedOrders,
      activeWorkOrders,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalCustomers,
      lowStockCount: Number(lowStockCount[0]?.count || 0),
      pendingInvoices,
      monthlyRevenueStats,
      serviceBreakdown,
      avgRating: 4.8 // default placeholder as it doesn't exist in DB
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

  async getRevenueTimeSeries(startDate: Date, endDate: Date) {
    const payments = await prisma.payment.findMany({
      where: {
        paymentDate: { gte: startDate, lte: endDate },
      },
      select: {
        paymentDate: true,
        amount: true,
      },
      orderBy: {
        paymentDate: 'asc',
      },
    });

    // Group by date
    const dailyData: Record<string, number> = {};
    
    // Fill gaps with 0
    const curr = new Date(startDate);
    while (curr <= endDate) {
      const dateStr = curr.toISOString().split('T')[0];
      dailyData[dateStr] = 0;
      curr.setDate(curr.getDate() + 1);
    }

    payments.forEach((p) => {
      const dateStr = p.paymentDate.toISOString().split('T')[0];
      dailyData[dateStr] = (dailyData[dateStr] || 0) + Number(p.amount);
    });

    return Object.entries(dailyData).map(([date, value]) => ({
      date: date.split('-').slice(1).reverse().join('/'), // Format to DD/MM
      value,
    }));
  }

  async getMechanicPerformance(startDate: Date, endDate: Date) {
    const mechanics = await prisma.user.findMany({
      where: { role: 'MEKANIK', isActive: true },
      select: {
        id: true,
        name: true,
        photoUrl: true,
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
      photoUrl: m.photoUrl,
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

  async getInventoryReport() {
    const items = await prisma.sparepart.findMany({
      where: { isActive: true },
      orderBy: { stockQuantity: 'asc' },
    });

    const lowStock = items.filter(i => i.stockQuantity <= i.minStock);
    const criticalStock = items.filter(i => i.stockQuantity <= i.minStock * 0.5);

    return {
      totalItems: items.length,
      items,
      lowStockCount: lowStock.length,
      criticalStockCount: criticalStock.length,
    };
  }
}

export const reportService = new ReportService();
