"use client";

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { HourlyBucket } from "@/lib/stats";

export function HourlyChart({ data }: { data: HourlyBucket[] }) {
  if (!data.length) return (
    <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>
      Sin datos aún
    </p>
  );

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="hour"
          tick={{ fill: "#64748b", fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          interval={3}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#0d1526", border: "1px solid #1e2f4d", borderRadius: 6 }}
          labelStyle={{ color: "#e2e8f0", fontSize: 12 }}
          itemStyle={{ color: "#38bdf8", fontSize: 11 }}
          cursor={{ stroke: "#1e2f4d" }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#38bdf8"
          strokeWidth={2}
          fill="url(#areaGrad)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
