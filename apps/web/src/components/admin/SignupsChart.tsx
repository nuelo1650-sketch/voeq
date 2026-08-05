'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function SignupsChart({ data }: { data: Array<{ date: string; count: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#C9A24B20" />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={{ backgroundColor: '#0F3D2E', border: 'none', borderRadius: 8, color: '#F7F5F0' }} />
        <Line type="monotone" dataKey="count" stroke="#0F3D2E" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
