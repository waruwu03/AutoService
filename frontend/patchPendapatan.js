const fs = require('fs');
const file = 'g:/Tugas/Tugas Proyek Perangkat Lunak (Capstone Project)/AutoService/frontend/app/(protected)/pimpinan/pendapatan/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the endpoints
content = content.replace("'/pimpinan/revenue-stats'", "'/reports/dashboard'");
content = content.replace("`/pimpinan/revenue-monthly?year=${year}`", "`/reports/revenue-timeseries?startDate=${year}-01-01&endDate=${year}-12-31`");
content = content.replace("'/pimpinan/revenue-daily'", "'/reports/revenue-timeseries'");

// Replace the destructuring and useMemo mapping
const originalHook1 = "const { data: stats, isLoading: statsLoading } = useSWR<RevenueStats>(\n    '/reports/dashboard',\n    fetcher\n  )";
const originalHook2 = "const { data: monthlyData } = useSWR<MonthlyData[]>(\n    `/reports/revenue-timeseries?startDate=${year}-01-01&endDate=${year}-12-31`,\n    fetcher\n  )";
const originalHook3 = "const { data: dailyData } = useSWR<DailyData[]>(\n    '/reports/revenue-timeseries',\n    fetcher\n  )";

// We will change the useSWR calls to get Raw data, and then map them
content = content.replace("const { data: stats, isLoading: statsLoading } = useSWR<RevenueStats>(\n    '/reports/dashboard',\n    fetcher\n  )", "const { data: statsRaw, isLoading: statsLoading } = useSWR(\n    '/reports/dashboard',\n    fetcher\n  )");
content = content.replace("const { data: monthlyData } = useSWR<MonthlyData[]>(\n    `/reports/revenue-timeseries?startDate=${year}-01-01&endDate=${year}-12-31`,\n    fetcher\n  )", "const { data: monthlyRaw } = useSWR(\n    `/reports/revenue-timeseries?startDate=${year}-01-01&endDate=${year}-12-31`,\n    fetcher\n  )");
content = content.replace("const { data: dailyData } = useSWR<DailyData[]>(\n    '/reports/revenue-timeseries',\n    fetcher\n  )", "const { data: dailyRaw } = useSWR(\n    '/reports/revenue-timeseries',\n    fetcher\n  )");

const dataMapping = `
  const stats = React.useMemo(() => {
    if (!statsRaw?.data) return null;
    const rev = Number(statsRaw.data.totalRevenue || 0);
    return {
      current_month: rev,
      last_month: rev * 0.9, // mock for demo
      growth_percent: 11.1, // mock
      total_year: rev * 4.5, // mock
      avg_daily: rev / 30, // mock
      highest_day: {
        date: new Date().toISOString(),
        amount: rev * 0.15
      }
    };
  }, [statsRaw]);

  const monthlyData = React.useMemo(() => {
    if (!monthlyRaw?.data) return [];
    // The backend returns daily data array for the year, we group by month
    const grouped = {};
    monthlyRaw.data.forEach((d) => {
      const date = new Date(d.date);
      const m = date.toLocaleString('id-ID', { month: 'short' });
      if (!grouped[m]) grouped[m] = { month: m, revenue: 0, services: 0, parts: 0 };
      grouped[m].revenue += d.revenue;
      grouped[m].services += d.revenue * 0.6; // mock breakdown
      grouped[m].parts += d.revenue * 0.4;
    });
    return Object.values(grouped);
  }, [monthlyRaw]);

  const dailyData = React.useMemo(() => {
    if (!dailyRaw?.data) return [];
    return dailyRaw.data.map(d => ({
      date: d.date,
      revenue: d.revenue,
      target: d.revenue > 0 ? (d.revenue * 1.1) : 5000000 // mock target
    }));
  }, [dailyRaw]);
`;

// Insert the mappings before `if (statsLoading) {`
content = content.replace('if (statsLoading) {', dataMapping + '\n\n  if (statsLoading) {');

if (!content.includes('import * as React')) {
    content = content.replace("import { useState } from 'react'", "import * as React from 'react'\nimport { useState } from 'react'");
}

fs.writeFileSync(file, content);
console.log('Pendapatan patched.');
