"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Dot,
} from "recharts";
import { DayBucket } from "@/lib/stats";

export function WeeklyChart({ data }: { data: DayBucket[] }) {
  if (!data.length) return (
    <p className="text-sm py-6" style={{ color: "var(--text-muted)" }}>
      &gt; SIN DATOS AÚN_
    </p>
  );

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tick={{ fill: "#4d6e8a", fontSize: 10, fontFamily: "Share Tech Mono, monospace" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#4d6e8a", fontSize: 10, fontFamily: "Share Tech Mono, monospace" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          domain={[0, maxCount]}
          width={28}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#06111f",
            border: "1px solid #1a3050",
            borderRadius: 0,
            fontFamily: "Share Tech Mono, monospace",
          }}
          labelStyle={{ color: "#dde8f5", fontSize: 11 }}
          itemStyle={{ color: "#4589ff", fontSize: 11 }}
          cursor={{ stroke: "#1a3050" }}
          formatter={(v) => [v, "NOTICIAS"]}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#4589ff"
          strokeWidth={2}
          dot={<Dot r={3} fill="#4589ff" stroke="#06111f" strokeWidth={1} />}
          activeDot={{ r: 5, fill: "#4589ff" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
