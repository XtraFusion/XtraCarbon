"use client"

 
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"

type DataPoint = { month: string; co2: number }

const co2Data: DataPoint[] = [
  { month: "Jan", co2: 12 },
  { month: "Feb", co2: 18 },
  { month: "Mar", co2: 24 },
  { month: "Apr", co2: 22 },
  { month: "May", co2: 28 },
  { month: "Jun", co2: 33 },
]

export default function UserDashboardPage() {
  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
 
      <section className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">User Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(17,24,39,0.75)" }}>
            Track your actions, CO₂ saved, and wallet.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Submit Action */}
          <div
            className="rounded-lg p-5 xl:col-span-1"
            style={{ backgroundColor: "rgba(17,24,39,0.02)", border: "1px solid rgba(17,24,39,0.15)" }}
          >
            <h2 className="font-medium mb-2">Submit Action</h2>
            <p className="text-sm mb-4" style={{ color: "rgba(17,24,39,0.75)" }}>
              Upload proof of your eco-friendly action.
            </p>
            <a
              href="/submit/action"
              className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium"
              style={{ backgroundColor: "#059669", color: "#F3F4F6" }}
            >
              New Action
            </a>
          </div>

          {/* CO₂ Saved Chart */}
          <div
            className="rounded-lg p-5 xl:col-span-2"
            style={{ backgroundColor: "rgba(17,24,39,0.02)", border: "1px solid rgba(17,24,39,0.15)" }}
          >
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-medium">CO₂ Saved</h2>
              <span className="text-sm" style={{ color: "#1E3A8A" }}>
                +15% MoM
              </span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={co2Data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(17,24,39,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(17,24,39,0.6)" />
                  <YAxis stroke="rgba(17,24,39,0.6)" />
                  <Line
                    type="monotone"
                    dataKey="co2"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={{ r: 3, stroke: "#059669", fill: "#F3F4F6" }}
                    activeDot={{ r: 5, fill: "#FACC15", stroke: "#059669" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Wallet */}
          <div
            className="rounded-lg p-5 xl:col-span-1"
            style={{ backgroundColor: "rgba(17,24,39,0.02)", border: "1px solid rgba(17,24,39,0.15)" }}
          >
            <h2 className="font-medium mb-2">Wallet</h2>
            <p className="text-sm" style={{ color: "rgba(17,24,39,0.75)" }}>
              Current Balance
            </p>
            <div className="mt-2 text-2xl font-semibold" style={{ color: "#1E3A8A" }}>
              2,340 ECO
            </div>
            <a
              href="/wallet"
              className="mt-4 inline-flex items-center rounded-md px-3 py-2 text-sm font-medium"
              style={{ backgroundColor: "#1E3A8A", color: "#F3F4F6" }}
            >
              View Wallet
            </a>
          </div>
        </div>

        {/* Leaderboard */}
        <div
          className="mt-4 rounded-lg p-5"
          style={{ backgroundColor: "rgba(17,24,39,0.02)", border: "1px solid rgba(17,24,39,0.15)" }}
        >
          <h2 className="font-medium mb-3">Leaderboard</h2>
          <ol className="text-sm space-y-2">
            <li className="flex items-center justify-between">
              <span>Alex J.</span>
              <span style={{ color: "#059669" }}>1,230 kg CO₂</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Mina K.</span>
              <span style={{ color: "#059669" }}>1,180 kg CO₂</span>
            </li>
            <li className="flex items-center justify-between">
              <span>You</span>
              <span style={{ color: "#059669" }}>960 kg CO₂</span>
            </li>
          </ol>
        </div>
      </section>
    </main>
  )
}
