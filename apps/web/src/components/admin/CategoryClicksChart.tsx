'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function CategoryClicksChart({ data }: { data: Array<{ name: string; clicks: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#C9A24B20" />
        <XAxis type="number" tick={{ fontSize: 10 }} />
        <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
        <Tooltip contentStyle={{ backgroundColor: '#0F3D2E', border: 'none', borderRadius: 8, color: '#F7F5F0' }} />
        <Bar dataKey="clicks" fill="#0F3D2E" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
