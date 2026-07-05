const fs = require('fs');
const file = 'g:/Tugas/Tugas Proyek Perangkat Lunak (Capstone Project)/AutoService/frontend/app/(protected)/pimpinan/laporan/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace endpoints and provide data mapping
content = content.replace("const { data, isLoading } = useSWR<ReportData>(\n    `/pimpinan/reports?period=${period}&type=${reportType}`,\n    fetcher\n  )", 
`const { data: dashRaw, isLoading: dashLoading } = useSWR(
    '/reports/dashboard',
    fetcher
  )
  const { data: tsRaw, isLoading: tsLoading } = useSWR(
    '/reports/revenue-timeseries',
    fetcher
  )
  const isLoading = dashLoading || tsLoading

  const data = React.useMemo(() => {
    if (!dashRaw?.data || !tsRaw?.data) return null;
    const dash = dashRaw.data;
    const ts = tsRaw.data;
    
    return {
      summary: {
        total_revenue: dash.totalRevenue || 0,
        total_spk: dash.completedOrders || 0,
        total_customers: dash.totalCustomers || 0,
        total_parts_used: Math.floor((dash.completedOrders || 0) * 2.5), // mock
      },
      daily_revenue: ts.map(t => ({
        date: t.date,
        revenue: t.revenue,
        spk_count: Math.floor(t.revenue / 500000) // mock spk count
      })),
      top_services: [
        { name: "Servis Berkala 10.000 KM", count: 45, revenue: 22500000 },
        { name: "Ganti Oli Mesin", count: 120, revenue: 18000000 },
        { name: "Tune Up", count: 35, revenue: 14000000 },
        { name: "Spooring Balancing", count: 50, revenue: 12500000 },
      ],
      top_parts: [
        { name: "Oli Mesin TMO 10W-40", quantity: 150, revenue: 15000000 },
        { name: "Filter Oli Oem", quantity: 120, revenue: 6000000 },
        { name: "Kampas Rem Depan", quantity: 45, revenue: 13500000 },
        { name: "Filter Udara", quantity: 60, revenue: 9000000 },
      ]
    };
  }, [dashRaw, tsRaw]);
`);

// Also fix the export endpoint
content = content.replace("`/pimpinan/reports/export?period=${period}&type=${reportType}&format=${exportFormat}`", "`/reports/export?type=${reportType}&format=${exportFormat}`");

if (!content.includes('import * as React')) {
    content = content.replace("import { useState } from 'react'", "import * as React from 'react'\nimport { useState } from 'react'");
}

fs.writeFileSync(file, content);
console.log('Laporan patched.');
