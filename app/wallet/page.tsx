"use client"

 

type Tx = {
  id: string
  date: string
  description: string
  amount: number // positive earn, negative spend
}

const transactions: Tx[] = [
  { id: "tx_1001", date: "2025-08-01", description: "Tree Planting (Action)", amount: 120 },
  { id: "tx_1002", date: "2025-08-05", description: "Recycling Drive (Action)", amount: 60 },
  { id: "tx_1003", date: "2025-08-12", description: "Donation Payout", amount: -80 },
  { id: "tx_1004", date: "2025-08-20", description: "Solar Workshop (Action)", amount: 150 },
]

export default function WalletPage() {
  const balance = transactions.reduce((acc, t) => acc + t.amount, 0) + 2000 // stub starting balance

  return (
    <main className="min-h-dvh" style={{ backgroundColor: "#F3F4F6", color: "#111827" }}>
 
      <section className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Wallet</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(17,24,39,0.75)" }}>
            View your token balance and transactions.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Balance Card */}
          <div
            className="rounded-lg p-5"
            style={{ backgroundColor: "rgba(17,24,39,0.02)", border: "1px solid rgba(17,24,39,0.15)" }}
          >
            <h2 className="font-medium mb-2">Token Balance</h2>
            <div className="text-3xl font-semibold" style={{ color: "#1E3A8A" }}>
              {balance.toLocaleString()} ECO
            </div>
            <div className="mt-3 flex gap-2">
              <button
                className="rounded-md px-3 py-2 text-sm font-medium"
                style={{ backgroundColor: "#059669", color: "#F3F4F6" }}
              >
                Add
              </button>
              <button
                className="rounded-md px-3 py-2 text-sm font-medium"
                style={{ backgroundColor: "#1E3A8A", color: "#F3F4F6" }}
              >
                Withdraw
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div
            className="lg:col-span-2 rounded-lg p-5 overflow-x-auto"
            style={{ backgroundColor: "rgba(17,24,39,0.02)", border: "1px solid rgba(17,24,39,0.15)" }}
          >
            <h2 className="font-medium mb-3">Transactions</h2>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(17,24,39,0.15)" }}>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} style={{ borderBottom: "1px solid rgba(17,24,39,0.08)" }}>
                    <td className="py-2">{t.date}</td>
                    <td className="py-2">{t.description}</td>
                    <td className="py-2 text-right" style={{ color: t.amount >= 0 ? "#059669" : "#1E3A8A" }}>
                      {t.amount >= 0 ? "+" : ""}
                      {t.amount} ECO
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-xs" style={{ color: "rgba(17,24,39,0.6)" }}>
              Positive amounts indicate tokens earned from actions; negative amounts indicate spending/withdrawals.
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
