import { SiteNavbar } from "@/components/site-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const rows = [
  { date: "2025-08-01", type: "Recycling", co2: "1.2 kg", tokens: "+12", status: "Verified" },
  { date: "2025-08-04", type: "Public Transport", co2: "0.8 kg", tokens: "+8", status: "Verified" },
  { date: "2025-08-09", type: "Tree Planting", co2: "2.5 kg", tokens: "+25", status: "Pending" },
  { date: "2025-08-11", type: "Community Cleanup", co2: "1.8 kg", tokens: "+18", status: "Verified" },
]

export default function HistoryPage() {
  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
      <SiteNavbar />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">History</h1>
          <div className="w-full md:w-64">
            <Input
              placeholder="Filter or search..."
              style={{ backgroundColor: "#F3F4F6", color: "#111827", borderColor: "rgba(17,24,39,0.15)" }}
            />
          </div>
        </header>

        <Card style={{ backgroundColor: "#F3F4F6", border: "1px solid rgba(17,24,39,0.15)" }}>
          <CardHeader>
            <CardTitle>Actions Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow style={{ backgroundColor: "#1E3A8A" }}>
                    <TableHead style={{ color: "#F3F4F6" }}>Date</TableHead>
                    <TableHead style={{ color: "#F3F4F6" }}>Action Type</TableHead>
                    <TableHead style={{ color: "#F3F4F6" }}>CO₂ Saved</TableHead>
                    <TableHead style={{ color: "#F3F4F6" }}>Tokens Earned</TableHead>
                    <TableHead style={{ color: "#F3F4F6" }}>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={i} style={{ backgroundColor: i % 2 ? "#F3F4F6" : "rgba(17,24,39,0.03)" }}>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.type}</TableCell>
                      <TableCell>{r.co2}</TableCell>
                      <TableCell style={{ color: "#059669" }}>{r.tokens}</TableCell>
                      <TableCell>
                        <span
                          className="rounded px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: r.status === "Verified" ? "#059669" : "#FACC15",
                            color: "#F3F4F6",
                          }}
                        >
                          {r.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
