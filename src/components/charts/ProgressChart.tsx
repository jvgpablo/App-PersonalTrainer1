"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import type { ChartDataPoint, WeeklyProgressData } from "@/types/progress.types";
import { Skeleton } from "@/components/ui/Skeleton";

export function WeightLineChart({ data, isLoading }: { data: ChartDataPoint[]; isLoading?: boolean }) {
  if (isLoading) return <Skeleton className="h-40 w-full" />;
  if (data.length < 2) return <p className="text-text-muted text-xs text-center py-8">Registra al menos 2 entradas para ver el gráfico</p>;
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="x" stroke="#52525B" tick={{ fill: "#52525B", fontSize: 10 }} />
        <YAxis stroke="#52525B" tick={{ fill: "#52525B", fontSize: 10 }} />
        <Tooltip
          contentStyle={{ background: "#111", border: "1px solid #1F1F1F", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#A1A1AA" }} itemStyle={{ color: "#00FF87" }}
        />
        <Line type="monotone" dataKey="y" stroke="#00FF87" strokeWidth={2.5} dot={{ fill: "#00FF87", r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function WeeklySessionsChart({ data, isLoading }: { data: WeeklyProgressData[]; isLoading?: boolean }) {
  if (isLoading) return <Skeleton className="h-36 w-full" />;
  if (!data.length) return <p className="text-text-muted text-xs text-center py-8">Sin datos de sesiones aún</p>;
  const chartData = data.slice(-6).map(d => ({ name: d.week, sesiones: d.totalSessions }));
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" stroke="#52525B" tick={{ fill: "#52525B", fontSize: 10 }} />
        <YAxis stroke="#52525B" tick={{ fill: "#52525B", fontSize: 10 }} allowDecimals={false} />
        <Tooltip contentStyle={{ background: "#111", border: "1px solid #1F1F1F", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#A1A1AA" }} itemStyle={{ color: "#00FF87" }} />
        <Bar dataKey="sesiones" fill="#00FF87" radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}
