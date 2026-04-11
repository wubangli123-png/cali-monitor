"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Dot,
} from "recharts";
import { DayBucket } from "@/lib/stats";

export function WeeklyChart({ data }: { data: DayBucket[] }) {
  if (!data.length) return (
    <p className="text-xs py-6" style={{ color: "var(--text-muted)" }}>
      &gt; SIN DATOS AÚN_
    </p>
  );

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tick={{ fill: "#7a5200", fontSize: 9, fontFamily: "Share Tech Mono, monospace" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#7a5200", fontSize: 10, fontFamily: "Share Tech Mono, monospace" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          domain={[0, maxCount]}
          width={28}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#110e00",
            border: "1px solid #3d2800",
            borderRadius: 0,
            fontFamily: "Share Tech Mono, monospace",
          }}
          labelStyle={{ color: "#ffb000", fontSize: 11 }}
          itemStyle={{ color: "#ffd700", fontSize: 11 }}
          cursor={{ stroke: "#3d2800" }}
          formatter={(v) => [v, "NOTICIAS"]}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#ffb000"
          strokeWidth={1.5}
          dot={<Dot r={2} fill="#ffd700" stroke="#110e00" strokeWidth={1} />}
          activeDot={{ r: 4, fill: "#ffd700" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
