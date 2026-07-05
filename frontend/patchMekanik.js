const fs = require('fs');
const file = 'g:/Tugas/Tugas Proyek Perangkat Lunak (Capstone Project)/AutoService/frontend/app/(protected)/pimpinan/reports/mekanik/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("m.avgTime || Math.floor(Math.random() * 30) + 60", "m.avgTime || (m.completed ? 120 - Math.min((m.completed / (m.totalOrders || 1)) * 100, 100) * 0.5 : 120)");
content = content.replace("m.rating || (4.5 + Math.random() * 0.5).toFixed(1)", "m.rating || (m.completed ? (4.0 + (m.completed / (m.totalOrders || 1))).toFixed(1) : '0.0')");
content = content.replace("m.efficiency || Math.floor(Math.random() * 15) + 85", "m.efficiency || (m.completed ? Math.round((m.completed / (m.totalOrders || 1)) * 100) : 0)");

fs.writeFileSync(file, content);
console.log('Mekanik patched.');
