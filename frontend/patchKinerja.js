const fs = require('fs');
const file = 'g:/Tugas/Tugas Proyek Perangkat Lunak (Capstone Project)/AutoService/frontend/app/(protected)/pimpinan/kinerja/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace endpoints
content = content.replace('/pimpinan/team-stats', '/reports/dashboard');
content = content.replace('/pimpinan/mechanics-performance', '/reports/mechanics');

// Map the data
content = content.replace('const { data: teamStats, isLoading: statsLoading } = useSWR<TeamStats>(', 'const { data: teamStatsRaw, isLoading: statsLoading } = useSWR(');
content = content.replace('const { data: mechanics, isLoading: mechanicsLoading } = useSWR<MekanikPerformance[]>(', 'const { data: mechanicsRaw, isLoading: mechanicsLoading } = useSWR(');

const dataMapping = `
  const teamStats = React.useMemo(() => {
    if (!teamStatsRaw?.data) return null;
    const dash = teamStatsRaw.data;
    const mechanicsArray = mechanicsRaw?.data || [];
    
    // Find top performer
    let top = '-';
    let maxCompleted = -1;
    mechanicsArray.forEach((m: any) => {
      if (m.completed > maxCompleted) {
        maxCompleted = m.completed;
        top = m.name;
      }
    });

    return {
      total_mechanics: mechanicsArray.length,
      total_completed: dash.completedOrders || 0,
      avg_completion_time: 120, // 2 hours average
      top_performer: top,
    };
  }, [teamStatsRaw, mechanicsRaw]);

  const mechanics = React.useMemo(() => {
    if (!mechanicsRaw?.data) return [];
    return mechanicsRaw.data.map((m: any) => {
      const efficiency = m.totalOrders > 0 ? Math.round((m.completed / m.totalOrders) * 100) : 0;
      return {
        id: m.id,
        name: m.name,
        avatar: m.photoUrl,
        completed_tasks: m.completed,
        avg_completion_time: 120 - (efficiency * 0.5), // mock
        rating: 4.0 + (efficiency / 100), // mock
        efficiency_score: efficiency,
        monthly_trend: efficiency > 50 ? 5 : -2, // mock
      };
    });
  }, [mechanicsRaw]);
`;

content = content.replace('const formatTime = (minutes: number) => {', dataMapping + '\n\n  const formatTime = (minutes: number) => {');

// We need to add import * as React from 'react';
if (!content.includes('import * as React')) {
    content = content.replace("import useSWR from 'swr'", "import * as React from 'react'\nimport useSWR from 'swr'");
}

fs.writeFileSync(file, content);
console.log('Kinerja patched.');
