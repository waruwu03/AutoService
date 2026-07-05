const fs = require('fs');
const file = 'g:/Tugas/Tugas Proyek Perangkat Lunak (Capstone Project)/AutoService/frontend/app/(protected)/pimpinan/reports/inventory/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("useSWR('/inventory/stock-movements?limit=5', fetcher)", "useSWR('/inventory/stock-movements?limit=1000', fetcher)");

const mappingScript = `
  const stockMovement = React.useMemo(() => {
    if (!movRaw?.data?.data) return [];
    const grouped = {};
    const movements = movRaw.data.data;
    movements.forEach(m => {
      const date = new Date(m.createdAt);
      const month = date.toLocaleString('id-ID', { month: 'short' });
      if (!grouped[month]) grouped[month] = { month, masuk: 0, keluar: 0 };
      if (m.movementType.includes('OUT') || m.movementType.includes('SALE')) {
        grouped[month].keluar += m.quantity;
      } else {
        grouped[month].masuk += m.quantity;
      }
    });
    return Object.values(grouped).reverse().slice(-6); // last 6 months
  }, [movRaw]);
`;

content = content.replace(/const stockMovement = \[\s*([\s\S]*?)\]/g, mappingScript);

fs.writeFileSync(file, content);
console.log('Inventory patched.');
