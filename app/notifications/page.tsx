// ...existing code...
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const notifications = [
  { id: 1, title: "Project Received", desc: "Your Eco Park Expansion was submitted.", time: "2h ago", unread: true },
  { id: 2, title: "Verification Update", desc: "Review scheduled for 2025-09-12.", time: "1d ago", unread: false },
  {
    id: 3,
    title: "Tokens Awarded",
    desc: "You earned 120 ECO tokens for verified actions.",
    time: "3d ago",
    unread: false,
  },
]

export default function NotificationsPage() {
  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
// ...existing code...
      <section className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <Button style={{ backgroundColor: "#059669", color: "#F3F4F6" }}>Mark all as read</Button>
        </header>

        <div className="space-y-3">
          {notifications.map((n) => (
            <Card key={n.id} style={{ backgroundColor: "#F3F4F6", border: "1px solid rgba(17,24,39,0.15)" }}>
              <CardContent className="flex items-start gap-3 p-4">
                <div
                  aria-hidden="true"
                  className="h-10 w-1 rounded"
                  style={{ backgroundColor: n.unread ? "#059669" : "rgba(17,24,39,0.15)" }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium">{n.title}</h2>
                    <span className="text-xs" style={{ color: "rgba(17,24,39,0.7)" }}>
                      {n.time}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "rgba(17,24,39,0.85)" }}>
                    {n.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
