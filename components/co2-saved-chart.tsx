"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { month: "Jan", co2: 12 },
  { month: "Feb", co2: 18 },
  { month: "Mar", co2: 25 },
  { month: "Apr", co2: 31 },
  { month: "May", co2: 40 },
  { month: "Jun", co2: 46 },
]

export function CO2SavedChart() {
  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="greenFill" x1="0" y1="0" x2="0" y2="1">
              {/* Emerald with alpha, staying within the palette by using opacity only */}
              <stop offset="5%" stopColor="#059669" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(17, 24, 39, 0.1)" />
          <XAxis dataKey="month" stroke="#111827" />
          <YAxis stroke="#111827" />
          <Tooltip
            contentStyle={{ backgroundColor: "#F3F4F6", border: "1px solid rgba(17, 24, 39, 0.15)", color: "#111827" }}
          />
          <Area type="monotone" dataKey="co2" stroke="#059669" fill="url(#greenFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
