"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { TopicStat, Topic } from "@/lib/types";
import { TOPIC_COLORS_HEX } from "@/components/TopicBadge";

export function TopicChart24h({ data }: { data: TopicStat[] }) {
  if (!data.length) return (
    <p className="text-xs text-center py-6" style={{ color: "var(--text-muted)" }}>
      Sin datos aún
    </p>
  );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="topic"
          tick={{ fill: "#64748b", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
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
          itemStyle={{ color: "#94a3b8", fontSize: 11 }}
          cursor={{ fill: "#1e2f4d" }}
        />
        <Bar dataKey="count" radius={[3, 3, 0, 0]}>
          {data.map(({ topic }) => (
            <Cell key={topic} fill={TOPIC_COLORS_HEX[topic as Topic] ?? "#64748b"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
