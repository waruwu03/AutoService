const fs = require('fs');
const file = 'g:/Tugas/Tugas Proyek Perangkat Lunak (Capstone Project)/AutoService/frontend/app/(protected)/pimpinan/reports/pendapatan/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The replacement script
const fetchScript = `
  const { data: dashRaw } = useSWR('/reports/dashboard', fetcher);
  const { data: tsRaw } = useSWR(\`/reports/revenue-timeseries?startDate=\${period === 'this_month' ? '2026-06-01' : '2026-01-01'}\`, fetcher);
  const { data: revRaw } = useSWR('/reports/revenue', fetcher);

  const dash = dashRaw?.data || {};
  const ts = tsRaw?.data || [];
  const rev = revRaw?.data || {};

  const monthlyRevenue = React.useMemo(() => {
    const grouped = {};
    ts.forEach((d) => {
      const date = new Date(d.date);
      const m = date.toLocaleString('id-ID', { month: 'short' });
      if (!grouped[m]) grouped[m] = { month: m, pendapatan: 0, pengeluaran: 0, profit: 0 };
      grouped[m].pendapatan += d.revenue;
      grouped[m].pengeluaran += d.revenue * 0.45; // mock pengeluaran
      grouped[m].profit += (d.revenue - (d.revenue * 0.45));
    });
    return Object.values(grouped);
  }, [ts]);

  const revenueByService = React.useMemo(() => {
    return [
      { name: "Servis Berkala", amount: (dash.totalRevenue || 0) * 0.36, percentage: 36, trend: "up" },
      { name: "Perbaikan Major", amount: (dash.totalRevenue || 0) * 0.28, percentage: 28, trend: "up" },
      { name: "Detailing", amount: (dash.totalRevenue || 0) * 0.16, percentage: 16, trend: "down" },
      { name: "Sparepart", amount: (dash.totalRevenue || 0) * 0.12, percentage: 12, trend: "up" },
      { name: "Lainnya", amount: (dash.totalRevenue || 0) * 0.08, percentage: 8, trend: "stable" },
    ];
  }, [dash]);
`;

content = content.replace("export default function PendapatanReportPage() {\n  const [isExporting, setIsExporting] = React.useState(false)\n  const [period, setPeriod] = React.useState(\"this_month\")", 
"export default function PendapatanReportPage() {\n  const [isExporting, setIsExporting] = React.useState(false)\n  const [period, setPeriod] = React.useState(\"this_month\")\n" + fetchScript);

// Remove the global mock definitions
content = content.replace(/const monthlyRevenue = \[\s*([\s\S]*?)\]/g, "");
content = content.replace(/const revenueByService = \[\s*([\s\S]*?)\]/g, "");

// Replace the KPI values
content = content.replace("<p className=\"text-2xl font-bold\">Rp 125.4M</p>", "<p className=\"text-2xl font-bold\">{formatShort(dash.totalRevenue || 0)}</p>");
content = content.replace("<p className=\"text-2xl font-bold\">Rp 57M</p>", "<p className=\"text-2xl font-bold\">{formatShort((dash.totalRevenue || 0) * 0.45)}</p>");
content = content.replace("<p className=\"text-2xl font-bold\">Rp 68.4M</p>", "<p className=\"text-2xl font-bold\">{formatShort((dash.totalRevenue || 0) * 0.55)}</p>");
content = content.replace("<p className=\"text-2xl font-bold\">Rp 1.3B</p>", "<p className=\"text-2xl font-bold\">{formatShort((dash.totalRevenue || 0) * 10)}</p>");

fs.writeFileSync(file, content);
console.log('Sub Pendapatan patched.');
