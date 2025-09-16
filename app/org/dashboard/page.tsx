"use client"

 

export default function OrgDashboardPage() {
  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
 
      <section className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Organization Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(17,24,39,0.75)" }}>
            Manage projects, verification, and your wallet.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Submit Project */}
          <div
            className="rounded-lg p-5"
            style={{
              backgroundColor: "rgba(17,24,39,0.02)",
              border: "1px solid rgba(17,24,39,0.15)",
            }}
          >
            <h2 className="font-medium mb-2">Submit Project</h2>
            <p className="text-sm mb-4" style={{ color: "rgba(17,24,39,0.75)" }}>
              Register a new sustainability project for review.
            </p>
            <a
              href="/submit/project/ngo"
              className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium"
              style={{ backgroundColor: "#059669", color: "#F3F4F6" }}
            >
              New Project
            </a>
            
          </div>

          {/* Verification Status */}
          <div
            className="rounded-lg p-5"
            style={{
              backgroundColor: "rgba(17,24,39,0.02)",
              border: "1px solid rgba(17,24,39,0.15)",
            }}
          >
            <h2 className="font-medium mb-2">Verification Status</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>Urban Tree Planting</span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: "#FACC15", color: "#111827" }}
                >
                  Pending
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Solar Rooftop Pilot</span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: "#059669", color: "#F3F4F6" }}
                >
                  Verified
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Recycling Initiative</span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: "#1E3A8A", color: "#F3F4F6" }}
                >
                  In Review
                </span>
              </li>
            </ul>
          </div>

          {/* Wallet */}
          <div
            className="rounded-lg p-5"
            style={{
              backgroundColor: "rgba(17,24,39,0.02)",
              border: "1px solid rgba(17,24,39,0.15)",
            }}
          >
            <h2 className="font-medium mb-2">Wallet</h2>
            <p className="text-sm" style={{ color: "rgba(17,24,39,0.75)" }}>
              Current Balance
            </p>
            <div className="mt-2 text-2xl font-semibold" style={{ color: "#1E3A8A" }}>
              12,450 ECO
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
      </section>
    </main>
  )
}
